import { User } from '../entities/User';

/**
 * User Repository Interface
 * Defines the contract for user data access
 */
export interface IUserRepository {
  findAll(filters?: Record<string, unknown>): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  save(user: User): Promise<User>;
  delete(id: string): Promise<boolean>;
  existsByEmail(email: string): Promise<boolean>;
  existsByUsername(username: string): Promise<boolean>;
  count(): Promise<number>;
}
