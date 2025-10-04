# User Dashboard System

## Overview
Personalized dashboard showing user statistics, progress, achievements, and recent activity.

## Frontend Features
- Personal statistics overview
- Recent activity feed
- Achievement badges
- Progress tracking
- Quick access to user actions

## Backend Implementation

### Database Schema

```sql
-- User achievements
CREATE TABLE achievements (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    badge_color VARCHAR(7), -- Hex color
    points_required INTEGER,
    challenge_count_required INTEGER,
    event_attendance_required INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User earned achievements
CREATE TABLE user_achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    achievement_id INTEGER REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, achievement_id)
);

-- User activity log
CREATE TABLE user_activities (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    activity_type ENUM('login', 'challenge_completed', 'event_registered', 'resource_downloaded', 'achievement_earned') NOT NULL,
    activity_data JSONB, -- Additional activity-specific data
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User statistics (materialized view for performance)
CREATE MATERIALIZED VIEW user_stats AS
SELECT 
    u.id as user_id,
    u.username,
    COALESCE(SUM(up.points_earned), 0) as total_points,
    COUNT(DISTINCT cs.challenge_id) as completed_challenges,
    COUNT(DISTINCT er.event_id) as events_attended,
    COUNT(DISTINCT ua.achievement_id) as achievements_earned,
    RANK() OVER (ORDER BY COALESCE(SUM(up.points_earned), 0) DESC) as rank
FROM users u
LEFT JOIN user_points up ON u.id = up.user_id
LEFT JOIN challenge_submissions cs ON u.id = cs.user_id AND cs.status = 'accepted'
LEFT JOIN event_registrations er ON u.id = er.user_id
LEFT JOIN user_achievements ua ON u.id = ua.user_id
GROUP BY u.id, u.username;

-- Refresh function for materialized view
CREATE OR REPLACE FUNCTION refresh_user_stats()
RETURNS TRIGGER AS $$
BEGIN
    REFRESH MATERIALIZED VIEW user_stats;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers to refresh stats
CREATE TRIGGER refresh_stats_on_points
    AFTER INSERT OR UPDATE OR DELETE ON user_points
    FOR EACH STATEMENT EXECUTE FUNCTION refresh_user_stats();

CREATE TRIGGER refresh_stats_on_submissions
    AFTER INSERT OR UPDATE ON challenge_submissions
    FOR EACH STATEMENT EXECUTE FUNCTION refresh_user_stats();
```

### API Endpoints

```javascript
// GET /api/dashboard - Get user dashboard data
app.get('/api/dashboard', requireAuth, async (req, res) => {
    const userId = req.user.id;
    
    // Get user statistics
    const statsResult = await db.query(`
        SELECT * FROM user_stats WHERE user_id = $1
    `, [userId]);
    
    // Get recent activities
    const activitiesResult = await db.query(`
        SELECT activity_type, activity_data, created_at
        FROM user_activities
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 10
    `, [userId]);
    
    // Get recent achievements
    const achievementsResult = await db.query(`
        SELECT a.name, a.description, a.icon, a.badge_color, ua.earned_at
        FROM user_achievements ua
        JOIN achievements a ON ua.achievement_id = a.id
        WHERE ua.user_id = $1
        ORDER BY ua.earned_at DESC
        LIMIT 5
    `, [userId]);
    
    // Get upcoming events user is registered for
    const upcomingEventsResult = await db.query(`
        SELECT e.title, e.event_date, e.event_time, e.location
        FROM events e
        JOIN event_registrations er ON e.id = er.event_id
        WHERE er.user_id = $1 AND e.event_date >= CURRENT_DATE
        ORDER BY e.event_date ASC
        LIMIT 3
    `, [userId]);
    
    // Get active challenges
    const activeChallengesResult = await db.query(`
        SELECT c.title, c.difficulty, c.points, c.deadline,
               CASE WHEN cs.id IS NOT NULL THEN cs.status ELSE 'not_attempted' END as status
        FROM challenges c
        LEFT JOIN challenge_submissions cs ON c.id = cs.challenge_id AND cs.user_id = $1
        WHERE c.status = 'active' AND (c.deadline IS NULL OR c.deadline >= CURRENT_DATE)
        ORDER BY c.deadline ASC NULLS LAST
        LIMIT 5
    `, [userId]);
    
    res.json({
        stats: statsResult.rows[0] || {
            total_points: 0,
            completed_challenges: 0,
            events_attended: 0,
            achievements_earned: 0,
            rank: null
        },
        recentActivities: activitiesResult.rows,
        recentAchievements: achievementsResult.rows,
        upcomingEvents: upcomingEventsResult.rows,
        activeChallenges: activeChallengesResult.rows
    });
});

// GET /api/dashboard/progress - Get detailed progress data
app.get('/api/dashboard/progress', requireAuth, async (req, res) => {
    const userId = req.user.id;
    
    // Monthly points progression
    const monthlyProgressResult = await db.query(`
        SELECT 
            DATE_TRUNC('month', earned_at) as month,
            SUM(points_earned) as points
        FROM user_points
        WHERE user_id = $1 AND earned_at >= CURRENT_DATE - INTERVAL '12 months'
        GROUP BY DATE_TRUNC('month', earned_at)
        ORDER BY month
    `, [userId]);
    
    // Challenge completion by difficulty
    const challengeProgressResult = await db.query(`
        SELECT 
            c.difficulty,
            COUNT(*) as completed
        FROM challenge_submissions cs
        JOIN challenges c ON cs.challenge_id = c.id
        WHERE cs.user_id = $1 AND cs.status = 'accepted'
        GROUP BY c.difficulty
    `, [userId]);
    
    // Activity heatmap (last 365 days)
    const activityHeatmapResult = await db.query(`
        SELECT 
            DATE(created_at) as date,
            COUNT(*) as activity_count
        FROM user_activities
        WHERE user_id = $1 AND created_at >= CURRENT_DATE - INTERVAL '365 days'
        GROUP BY DATE(created_at)
        ORDER BY date
    `, [userId]);
    
    res.json({
        monthlyProgress: monthlyProgressResult.rows,
        challengeProgress: challengeProgressResult.rows,
        activityHeatmap: activityHeatmapResult.rows
    });
});

// POST /api/dashboard/activity - Log user activity
app.post('/api/dashboard/activity', requireAuth, async (req, res) => {
    const { activity_type, activity_data } = req.body;
    const userId = req.user.id;
    
    await db.query(`
        INSERT INTO user_activities (user_id, activity_type, activity_data)
        VALUES ($1, $2, $3)
    `, [userId, activity_type, activity_data]);
    
    // Check for new achievements
    await checkAndAwardAchievements(userId);
    
    res.json({ message: 'Activity logged successfully' });
});

// Achievement checking function
async function checkAndAwardAchievements(userId) {
    const userStats = await db.query(`
        SELECT * FROM user_stats WHERE user_id = $1
    `, [userId]);
    
    if (userStats.rows.length === 0) return;
    
    const stats = userStats.rows[0];
    
    // Get available achievements user hasn't earned
    const availableAchievements = await db.query(`
        SELECT a.*
        FROM achievements a
        WHERE a.id NOT IN (
            SELECT achievement_id FROM user_achievements WHERE user_id = $1
        )
    `, [userId]);
    
    for (const achievement of availableAchievements.rows) {
        let earned = false;
        
        // Check points requirement
        if (achievement.points_required && stats.total_points >= achievement.points_required) {
            earned = true;
        }
        
        // Check challenge count requirement
        if (achievement.challenge_count_required && stats.completed_challenges >= achievement.challenge_count_required) {
            earned = true;
        }
        
        // Check event attendance requirement
        if (achievement.event_attendance_required && stats.events_attended >= achievement.event_attendance_required) {
            earned = true;
        }
        
        if (earned) {
            // Award achievement
            await db.query(`
                INSERT INTO user_achievements (user_id, achievement_id)
                VALUES ($1, $2)
                ON CONFLICT (user_id, achievement_id) DO NOTHING
            `, [userId, achievement.id]);
            
            // Log achievement activity
            await db.query(`
                INSERT INTO user_activities (user_id, activity_type, activity_data)
                VALUES ($1, 'achievement_earned', $2)
            `, [userId, JSON.stringify({ achievement_name: achievement.name })]);
        }
    }
}

// GET /api/dashboard/leaderboard - Get leaderboard data
app.get('/api/dashboard/leaderboard', async (req, res) => {
    const { timeframe = 'all', limit = 10 } = req.query;
    
    let query = `
        SELECT username, total_points, rank
        FROM user_stats
        ORDER BY total_points DESC
        LIMIT $1
    `;
    
    if (timeframe === 'monthly') {
        query = `
            SELECT u.username, COALESCE(SUM(up.points_earned), 0) as total_points,
                   RANK() OVER (ORDER BY COALESCE(SUM(up.points_earned), 0) DESC) as rank
            FROM users u
            LEFT JOIN user_points up ON u.id = up.user_id 
                AND up.earned_at >= DATE_TRUNC('month', CURRENT_DATE)
            GROUP BY u.id, u.username
            ORDER BY total_points DESC
            LIMIT $1
        `;
    } else if (timeframe === 'weekly') {
        query = `
            SELECT u.username, COALESCE(SUM(up.points_earned), 0) as total_points,
                   RANK() OVER (ORDER BY COALESCE(SUM(up.points_earned), 0) DESC) as rank
            FROM users u
            LEFT JOIN user_points up ON u.id = up.user_id 
                AND up.earned_at >= DATE_TRUNC('week', CURRENT_DATE)
            GROUP BY u.id, u.username
            ORDER BY total_points DESC
            LIMIT $1
        `;
    }
    
    const result = await db.query(query, [limit]);
    res.json({ leaderboard: result.rows });
});
```

### Achievement System

```javascript
// Predefined achievements
const defaultAchievements = [
    {
        name: 'First Steps',
        description: 'Complete your first challenge',
        icon: 'trophy',
        badge_color: '#bronze',
        challenge_count_required: 1
    },
    {
        name: 'Point Collector',
        description: 'Earn 100 points',
        icon: 'star',
        badge_color: '#silver',
        points_required: 100
    },
    {
        name: 'Challenge Master',
        description: 'Complete 10 challenges',
        icon: 'crown',
        badge_color: '#gold',
        challenge_count_required: 10
    },
    {
        name: 'Social Butterfly',
        description: 'Attend 5 events',
        icon: 'users',
        badge_color: '#purple',
        event_attendance_required: 5
    }
];

// Initialize achievements
async function initializeAchievements() {
    for (const achievement of defaultAchievements) {
        await db.query(`
            INSERT INTO achievements (name, description, icon, badge_color, points_required, challenge_count_required, event_attendance_required)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (name) DO NOTHING
        `, [
            achievement.name,
            achievement.description,
            achievement.icon,
            achievement.badge_color,
            achievement.points_required || null,
            achievement.challenge_count_required || null,
            achievement.event_attendance_required || null
        ]);
    }
}
```