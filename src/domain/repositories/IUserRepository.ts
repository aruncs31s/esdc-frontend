/**
 * User Repository Interface
 * Defines the contract for user data access
 */
export class IUserRepository {
  async findAll(_filters = {}): Promise<any[]> {
    throw new Error('Method not implemented');
  }

  async findById(_id: number): Promise<any> {
    throw new Error('Method not implemented');
  }

  async findByEmail(_email: string): Promise<any> {
    throw new Error('Method not implemented');
  }

  async findByUsername(_username: string): Promise<any> {
    throw new Error('Method not implemented');
  }

  async save(_user: any): Promise<any> {
    throw new Error('Method not implemented');
  }

  async delete(_id: string): Promise<boolean> {
    throw new Error('Method not implemented');
  }

  async existsByEmail(_email: string): Promise<boolean> {
    throw new Error('Method not implemented');
  }

  async existsByUsername(_username: string): Promise<boolean> {
    throw new Error('Method not implemented');
  }

  async count(): Promise<number> {
    throw new Error('Method not implemented');
  }
}
