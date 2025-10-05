import { IChallengeRepository } from '../../domain/repositories/IChallengeRepository.js';
import { Challenge } from '../../domain/entities/Challenge.js';
import apiClient from '../api/ApiClient.js';

/**
 * Challenge Repository Implementation
 * Handles challenge data persistence via API
 */
export class ChallengeRepository extends IChallengeRepository {
  constructor(client = apiClient) {
    super();
    this.api = client;
  }

  /**
   * Find all challenges with optional filters
   */
  async findAll(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const response = await this.api.get(`/api/admin/challenges?${params}`);
      const data = response.data?.data || response.data || [];
      return Challenge.fromAPIArray(data);
    } catch (error) {
      console.error('Error fetching challenges:', error);
      return [];
    }
  }

  /**
   * Find challenge by ID
   */
  async findById(id) {
    try {
      const response = await this.api.get(`/api/admin/challenges/${id}`);
      const data = response.data?.data || response.data;
      return Challenge.fromAPI(data);
    } catch (error) {
      console.error(`Error fetching challenge ${id}:`, error);
      return null;
    }
  }

  /**
   * Find challenges by status
   */
  async findByStatus(status) {
    try {
      const response = await this.api.get(`/api/admin/challenges?status=${status}`);
      const data = response.data?.data || response.data || [];
      return Challenge.fromAPIArray(data);
    } catch (error) {
      console.error(`Error fetching challenges by status ${status}:`, error);
      return [];
    }
  }

  /**
   * Find challenges by difficulty
   */
  async findByDifficulty(difficulty) {
    try {
      const response = await this.api.get(`/api/admin/challenges?difficulty=${difficulty}`);
      const data = response.data?.data || response.data || [];
      return Challenge.fromAPIArray(data);
    } catch (error) {
      console.error(`Error fetching challenges by difficulty ${difficulty}:`, error);
      return [];
    }
  }

  /**
   * Save challenge (create or update)
   */
  async save(challenge) {
    try {
      if (challenge.id) {
        // Update existing challenge
        const response = await this.api.put(
          `/api/admin/challenges/${challenge.id}`,
          challenge.toJSON()
        );
        const data = response.data?.data || response.data;
        return Challenge.fromAPI(data);
      } else {
        // Create new challenge
        const response = await this.api.post('/api/admin/challenges', challenge.toJSON());
        const data = response.data?.data || response.data;
        return Challenge.fromAPI(data);
      }
    } catch (error) {
      console.error('Error saving challenge:', error);
      throw error;
    }
  }

  /**
   * Delete challenge by ID
   */
  async delete(id) {
    try {
      await this.api.delete(`/api/admin/challenges/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting challenge ${id}:`, error);
      throw error;
    }
  }

  /**
   * Count total challenges
   */
  async count() {
    try {
      const challenges = await this.findAll();
      return challenges.length;
    } catch (error) {
      console.error('Error counting challenges:', error);
      return 0;
    }
  }
}

// Singleton instance
const challengeRepository = new ChallengeRepository();

export default challengeRepository;
