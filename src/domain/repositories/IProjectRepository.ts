/**
 * Project Repository Interface
 * Defines the contract for project data access
 */
export class IProjectRepository {
  async findAll(_filters = {}) {
    throw new Error('Method not implemented');
  }

  async findById(_id: string) {
    throw new Error('Method not implemented');
  }

  async findByUserId(_userId: string) {
    throw new Error('Method not implemented');
  }

  async findByStatus(_status: string) {
    throw new Error('Method not implemented');
  }

  async save(_project: any) {
    throw new Error('Method not implemented');
  }

  async delete(_id: string) {
    throw new Error('Method not implemented');
  }

  async count() {
    throw new Error('Method not implemented');
  }
}
