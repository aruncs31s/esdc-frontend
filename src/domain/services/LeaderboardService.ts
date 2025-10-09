import { Points } from '../value-objects/Points.js';

/**
 * Leaderboard Service
 * Handles leaderboard calculations and rankings
 */
export class LeaderboardService {
  private userRepository: any;

  constructor(userRepository: any) {
    this.userRepository = userRepository;
  }

  /**
   * Get top users by points
   */
  async getTopUsers(limit = 10) {
    const users = await this.userRepository.findAll();
    
    // Sort by points (descending)
    const sortedUsers = users.sort((a, b) => {
      return b.points.value - a.points.value;
    });

    // Add rank
    return sortedUsers.slice(0, limit).map((user, index) => ({
      rank: index + 1,
      user: user,
      points: user.points.value,
      completedChallenges: user.completedChallenges
    }));
  }

  /**
   * Get user's rank
   */
  async getUserRank(userId) {
    const users = await this.userRepository.findAll();
    
    // Sort by points (descending)
    const sortedUsers = users.sort((a, b) => {
      return b.points.value - a.points.value;
    });

    const userIndex = sortedUsers.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return null;
    }

    return {
      rank: userIndex + 1,
      totalUsers: users.length,
      percentile: ((users.length - userIndex) / users.length) * 100
    };
  }

  /**
   * Get leaderboard by category
   */
  async getLeaderboardByCategory(category, limit = 10) {
    // This would require tracking points by category
    // Simplified implementation for now
    return this.getTopUsers(limit);
  }

  /**
   * Calculate user's points growth
   * @param {string} userId - User ID
   * @param {number} _days - Number of days (currently unused, for future implementation)
   */
  async getUserPointsGrowth(userId: string, _days = 30) {
    // This would require historical data tracking
    // Placeholder for future implementation
    const user = await this.userRepository.findById(userId);
    if (!user) {
      return null;
    }

    return {
      currentPoints: user.points.value,
      growth: 0, // Would calculate from historical data
      trend: 'stable'
    };
  }
}
