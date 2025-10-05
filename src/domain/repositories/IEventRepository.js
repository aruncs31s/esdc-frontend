/**
 * Event Repository Interface
 * Defines the contract for event data access
 */
export class IEventRepository {
  async findAll(filters = {}) {
    throw new Error('Method not implemented');
  }

  async findById(id) {
    throw new Error('Method not implemented');
  }

  async findByStatus(status) {
    throw new Error('Method not implemented');
  }

  async findUpcoming() {
    throw new Error('Method not implemented');
  }

  async save(event) {
    throw new Error('Method not implemented');
  }

  async delete(id) {
    throw new Error('Method not implemented');
  }

  async count() {
    throw new Error('Method not implemented');
  }
}
