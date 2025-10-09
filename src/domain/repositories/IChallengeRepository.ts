/**
 * Challenge Repository Interface
 * Defines the contract for challenge data access
 */
export class IChallengeRepository {
  async findAll(_filters = {}) {
    throw new Error('Method not implemented');
  }

  async findById(_id: string) {
    throw new Error('Method not implemented');
  }

  async findByStatus(_status: string) {
    throw new Error('Method not implemented');
  }

  async findByDifficulty(_difficulty: string) {
    throw new Error('Method not implemented');
  }

  async save(_challenge: any) {
    throw new Error('Method not implemented');
  }

  async delete(_id: string) {
    throw new Error('Method not implemented');
  }

  async count() {
    throw new Error('Method not implemented');
  }
}
