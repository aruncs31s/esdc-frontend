/**
 * Challenge Repository Interface
 * Defines the contract for challenge data access
 */
export class IChallengeRepository {
  async findAll(_filters = {}): Promise<any[]> {
    throw new Error('Method not implemented');
  }

  async findById(_id: string): Promise<any> {
    throw new Error('Method not implemented');
  }

  async findByStatus(_status: string): Promise<any[]> {
    throw new Error('Method not implemented');
  }

  async findByDifficulty(_difficulty: string): Promise<any[]> {
    throw new Error('Method not implemented');
  }

  async save(_challenge: any): Promise<any> {
    throw new Error('Method not implemented');
  }

  async delete(_id: string): Promise<boolean> {
    throw new Error('Method not implemented');
  }

  async count(): Promise<number> {
    throw new Error('Method not implemented');
  }
}
