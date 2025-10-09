/**
 * Event Repository Interface
 * Defines the contract for event data access
 */
export class IEventRepository {
  async findAll(_filters = {}) {
    throw new Error('Method not implemented');
  }

  async findById(_id: string) {
    throw new Error('Method not implemented');
  }

  async findByStatus(_status: string) {
    throw new Error('Method not implemented');
  }

  async findUpcoming() {
    throw new Error('Method not implemented');
  }

  async save(_event: any) {
    throw new Error('Method not implemented');
  }

  async delete(_id: string) {
    throw new Error('Method not implemented');
  }

  async count() {
    throw new Error('Method not implemented');
  }
}
