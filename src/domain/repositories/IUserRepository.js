/**
 * User Repository Interface
 * Defines the contract for user data access
 */
export class IUserRepository {
  async findAll(filters = {}) {
    throw new Error('Method not implemented');
  }

  async findById(id) {
    throw new Error('Method not implemented');
  }

  async findByEmail(email) {
    throw new Error('Method not implemented');
  }

  async findByUsername(username) {
    throw new Error('Method not implemented');
  }

  async save(user) {
    throw new Error('Method not implemented');
  }

  async delete(id) {
    throw new Error('Method not implemented');
  }

  async existsByEmail(email) {
    throw new Error('Method not implemented');
  }

  async existsByUsername(username) {
    throw new Error('Method not implemented');
  }

  async count() {
    throw new Error('Method not implemented');
  }
}
