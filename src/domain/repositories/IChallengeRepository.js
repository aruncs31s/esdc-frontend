/**
 * Challenge Repository Interface
 * Defines the contract for challenge data access
 */
export class IChallengeRepository {
  async findAll(filters = {}) {
    throw new Error('Method not implemented');
  }

  async findById(id) {
    throw new Error('Method not implemented');
  }

  async findByStatus(status) {
    throw new Error('Method not implemented');
  }

  async findByDifficulty(difficulty) {
    throw new Error('Method not implemented');
  }

  async save(challenge) {
    throw new Error('Method not implemented');
  }

  async delete(id) {
    throw new Error('Method not implemented');
  }

  async count() {
    throw new Error('Method not implemented');
  }
}
