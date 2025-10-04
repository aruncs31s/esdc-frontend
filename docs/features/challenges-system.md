# Challenges & Competitions System

## Overview
Gamified learning system with coding/hardware challenges, submissions, and scoring.

## Frontend Features
- Challenge browsing with difficulty filters
- Solution submission interface
- Progress tracking
- Downloadable starter kits

## Backend Implementation

### Database Schema

```sql
-- Challenges table
CREATE TABLE challenges (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    difficulty ENUM('Beginner', 'Intermediate', 'Advanced') NOT NULL,
    points INTEGER NOT NULL,
    deadline DATE,
    starter_kit_url VARCHAR(500),
    solution_template TEXT,
    test_cases JSONB,
    status ENUM('draft', 'active', 'closed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Challenge submissions
CREATE TABLE challenge_submissions (
    id SERIAL PRIMARY KEY,
    challenge_id INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    solution_code TEXT,
    github_repo_url VARCHAR(500),
    submission_notes TEXT,
    score INTEGER DEFAULT 0,
    status ENUM('pending', 'reviewed', 'accepted', 'rejected') DEFAULT 'pending',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    reviewed_by INTEGER REFERENCES users(id),
    feedback TEXT
);

-- User points tracking
CREATE TABLE user_points (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    challenge_id INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
    points_earned INTEGER NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, challenge_id)
);
```

### API Endpoints

```javascript
// GET /api/challenges - Get all challenges
app.get('/api/challenges', async (req, res) => {
    const { difficulty, status } = req.query;
    let query = `
        SELECT c.*, 
               COALESCE(s.status, 'not_attempted') as user_status,
               s.score as user_score
        FROM challenges c
        LEFT JOIN challenge_submissions s ON c.id = s.challenge_id AND s.user_id = $1
        WHERE c.status = 'active'
    `;
    
    const params = [req.user?.id || null];
    let paramCount = 1;
    
    if (difficulty) {
        query += ` AND c.difficulty = $${++paramCount}`;
        params.push(difficulty);
    }
    
    query += ' ORDER BY c.created_at DESC';
    
    const result = await db.query(query, params);
    res.json({ challenges: result.rows });
});

// GET /api/challenges/:id - Get challenge details
app.get('/api/challenges/:id', async (req, res) => {
    const result = await db.query(
        `SELECT c.*, 
                COUNT(s.id) as total_submissions,
                AVG(s.score) as average_score
         FROM challenges c
         LEFT JOIN challenge_submissions s ON c.id = s.challenge_id
         WHERE c.id = $1
         GROUP BY c.id`,
        [req.params.id]
    );
    
    if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Challenge not found' });
    }
    
    res.json({ challenge: result.rows[0] });
});

// POST /api/challenges/:id/submit - Submit solution
app.post('/api/challenges/:id/submit', requireAuth, upload.single('solution_file'), async (req, res) => {
    const { solution_code, github_repo_url, submission_notes } = req.body;
    const challengeId = req.params.id;
    const userId = req.user.id;
    
    // Check if challenge exists and is active
    const challenge = await db.query(
        'SELECT * FROM challenges WHERE id = $1 AND status = $2',
        [challengeId, 'active']
    );
    
    if (challenge.rows.length === 0) {
        return res.status(404).json({ message: 'Challenge not found or inactive' });
    }
    
    // Check deadline
    if (challenge.rows[0].deadline && new Date() > new Date(challenge.rows[0].deadline)) {
        return res.status(400).json({ message: 'Challenge deadline has passed' });
    }
    
    // Insert or update submission
    const result = await db.query(`
        INSERT INTO challenge_submissions (challenge_id, user_id, solution_code, github_repo_url, submission_notes)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (challenge_id, user_id) 
        DO UPDATE SET 
            solution_code = EXCLUDED.solution_code,
            github_repo_url = EXCLUDED.github_repo_url,
            submission_notes = EXCLUDED.submission_notes,
            submitted_at = CURRENT_TIMESTAMP,
            status = 'pending'
        RETURNING *
    `, [challengeId, userId, solution_code, github_repo_url, submission_notes]);
    
    res.json({ 
        message: 'Solution submitted successfully',
        submission: result.rows[0]
    });
});

// GET /api/challenges/:id/submissions - Get user's submissions (admin: all submissions)
app.get('/api/challenges/:id/submissions', requireAuth, async (req, res) => {
    let query, params;
    
    if (req.user.role === 'admin') {
        query = `
            SELECT s.*, u.username, u.email
            FROM challenge_submissions s
            JOIN users u ON s.user_id = u.id
            WHERE s.challenge_id = $1
            ORDER BY s.submitted_at DESC
        `;
        params = [req.params.id];
    } else {
        query = `
            SELECT * FROM challenge_submissions
            WHERE challenge_id = $1 AND user_id = $2
            ORDER BY submitted_at DESC
        `;
        params = [req.params.id, req.user.id];
    }
    
    const result = await db.query(query, params);
    res.json({ submissions: result.rows });
});

// POST /api/challenges - Create new challenge (admin only)
app.post('/api/challenges', requireAuth, requireAdmin, async (req, res) => {
    const { title, description, difficulty, points, deadline, starter_kit_url, test_cases } = req.body;
    
    const result = await db.query(`
        INSERT INTO challenges (title, description, difficulty, points, deadline, starter_kit_url, test_cases)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
    `, [title, description, difficulty, points, deadline, starter_kit_url, test_cases]);
    
    res.json({ challenge: result.rows[0] });
});

// PUT /api/submissions/:id/review - Review submission (admin only)
app.put('/api/submissions/:id/review', requireAuth, requireAdmin, async (req, res) => {
    const { score, status, feedback } = req.body;
    const submissionId = req.params.id;
    
    const result = await db.query(`
        UPDATE challenge_submissions 
        SET score = $1, status = $2, feedback = $3, reviewed_at = CURRENT_TIMESTAMP, reviewed_by = $4
        WHERE id = $5
        RETURNING *
    `, [score, status, feedback, req.user.id, submissionId]);
    
    // If accepted, award points
    if (status === 'accepted' && score > 0) {
        const submission = result.rows[0];
        await db.query(`
            INSERT INTO user_points (user_id, challenge_id, points_earned)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, challenge_id)
            DO UPDATE SET points_earned = EXCLUDED.points_earned
        `, [submission.user_id, submission.challenge_id, score]);
    }
    
    res.json({ submission: result.rows[0] });
});
```

### File Upload Configuration

```javascript
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/solutions/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `solution-${req.user.id}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['.js', '.py', '.cpp', '.c', '.java', '.zip', '.rar'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    }
});
```