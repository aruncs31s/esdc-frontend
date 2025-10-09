/**
 * Event Repository Interface
 * Defines the contract for event data access
 */
export class IEventRepository {
  async findAll(_filters = {}): Promise<any[]> {
    throw new Error('Method not implemented');
  }

  async findById(_id: string): Promise<any> {
    throw new Error('Method not implemented');
  }

  async findByStatus(_status: string): Promise<any[]> {
    throw new Error('Method not implemented');
  }

  async findUpcoming(): Promise<any[]> {
    throw new Error('Method not implemented');
  }

  async save(_event: any): Promise<any> {
    throw new Error('Method not implemented');
  }

  async delete(_id: string): Promise<boolean> {
    throw new Error('Method not implemented');
  }

  async count(): Promise<number> {
    throw new Error('Method not implemented');
  }
}
