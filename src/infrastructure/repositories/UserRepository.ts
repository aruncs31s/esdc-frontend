import { IUserRepository } from '@/domain/repositories/IUserRepository.js';
import { User } from '@/domain/entities/User.js';
import apiClient from '../api/ApiClient.js';
import { UserSearchData } from '@/types/user.js';
// import api from '../../services/api';
/**
 * User Repository Implementation
 * Handles user data persistence via API
 */
export class UserRepository extends IUserRepository {
  private api: typeof apiClient;

  constructor(client = apiClient) {
    super();
    this.api = client;
  }
  // From this remove unwanted and only add wanted

  async searchUsers(query: string): Promise<UserSearchData[]> {
    try {
      const response = await this.api.get(`/api/users/search?q=${encodeURIComponent(query)}`);
      console.log('User search response:', response);
      const users = response.data?.users || [];
      return users as UserSearchData[];
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }

  /**
   * Find all users with optional filters
   */

  // Find All Projects for User , Used in UserProjects page. '/my-projects'
  async findAllProjects(filters = {}): Promise<User[]> {
    try {
      const params = new URLSearchParams(filters);
      const response = await this.api.get(`/api/admin/users?${params}`);
      const data = response.data?.data || response.data || [];
      return User.fromAPIArray(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }

  // TODO: Not Tested.
  async findAll(filters = {}): Promise<User[]> {
    try {
      const params = new URLSearchParams(filters);
      const response = await this.api.get(`/api/admin/users?${params}`);
      const data = response.data?.data || response.data || [];
      return User.fromAPIArray(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }

  /**
   * Find user by ID
   */
  async findById(id: number): Promise<User | null> {
    try {
      const response = await this.api.get(`/api/admin/users/${id}`);
      const data = response.data?.data || response.data;
      return User.fromAPI(data);
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      return null;
    }
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string) {
    try {
      const response = await this.api.get(`/api/admin/users?email=${email}`);
      const data = response.data?.data || response.data || [];
      const users = User.fromAPIArray(data);
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error(`Error fetching user by email ${email}:`, error);
      return null;
    }
  }

  /**
   * Find user by username
   */
  async findByUsername(username: string) {
    try {
      const response = await this.api.get(`/api/admin/users?username=${username}`);
      const data = response.data?.data || response.data || [];
      const users = User.fromAPIArray(data);
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error(`Error fetching user by username ${username}:`, error);
      return null;
    }
  }

  /**
   * Save user (create or update)
   */
  async save(user: any) {
    try {
      if (user.id) {
        // Update existing user
        const response = await this.api.put(`/api/admin/users/${user.id}`, user.toJSON());
        const data = response.data?.data || response.data;
        return User.fromAPI(data);
      } else {
        // Create new user
        const response = await this.api.post('/api/admin/users', user.toJSON());
        const data = response.data?.data || response.data;
        return User.fromAPI(data);
      }
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }

  /**
   * Delete user by ID
   */
  async delete(id: string) {
    try {
      await this.api.delete(`/api/admin/users/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  }

  /**
   * Check if email exists
   */
  async existsByEmail(email: string) {
    try {
      const user = await this.findByEmail(email);
      return user !== null;
    } catch (error) {
      console.error(`Error checking email existence:`, error);
      return false;
    }
  }

  /**
   * Check if username exists
   */
  async existsByUsername(username: string) {
    try {
      const user = await this.findByUsername(username);
      return user !== null;
    } catch (error) {
      console.error(`Error checking username existence:`, error);
      return false;
    }
  }

  /**
   * Count total users
   */
  async count() {
    try {
      const users = await this.findAll();
      return users.length;
    } catch (error) {
      console.error('Error counting users:', error);
      return 0;
    }
  }
}

// Singleton instance
const userRepository = new UserRepository();

export default userRepository;
