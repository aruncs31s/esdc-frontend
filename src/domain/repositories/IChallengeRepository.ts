/**
 * Challenge Repository Interface
 * Defines the contract for challenge data access
 */
export interface IChallengeRepository {
  findAll(filters?: Record<string, unknown>): Promise<unknown[]>;
  findById(id: string): Promise<unknown | null>;
  findByStatus(status: string): Promise<unknown[]>;
  findByDifficulty(difficulty: string): Promise<unknown[]>;
  save(challenge: unknown): Promise<unknown>;
  delete(id: string): Promise<boolean>;
  count(): Promise<number>;
}
