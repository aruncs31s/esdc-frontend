/**
 * User Repository Interface
 * Defines the contract for user data access
 */
export class IUserRepository {
  async findAll(_filters = {}) {
    throw new Error('Method not implemented');
  }

  async findById(_id: string) {
    throw new Error('Method not implemented');
  }

  async findByEmail(_email: string) {
    throw new Error('Method not implemented');
  }

  async findByUsername(_username: string) {
    throw new Error('Method not implemented');
  }

  async save(_user: any) {
    throw new Error('Method not implemented');
  }

  async delete(_id: string) {
    throw new Error('Method not implemented');
  }

  async existsByEmail(_email: string) {
    throw new Error('Method not implemented');
  }

  async existsByUsername(_username: string) {
    throw new Error('Method not implemented');
  }

  async count() {
    throw new Error('Method not implemented');
  }
}
