/**
 * Project Repository Interface
 * Defines the contract for project data access
 */
export class IAdminRepository {
  async findAllProjects(_filters = {}): Promise<any[]> {
    throw new Error('Method not implemented');
  }

  async findProjectById(_id: string): Promise<any> {
    throw new Error('Method not implemented');
  }

  async findProjectByUserId(_userId: string): Promise<any[]> {
    throw new Error('Method not implemented');
  }

  async findProjectByStatus(_status: string): Promise<any[]> {
    throw new Error('Method not implemented');
  }

  async saveProject(_project: any): Promise<any> {
    throw new Error('Method not implemented');
  }

  async deleteProject(_id: string): Promise<boolean> {
    throw new Error('Method not implemented');
  }
  async findAllUsers(_filters = {}): Promise<any[]> {
    throw new Error('Method not implemented');
  }

  async findUserById(_id: string): Promise<any> {
    throw new Error('Method not implemented');
  }

  async saveUser(_user: any): Promise<any> {
    throw new Error('Method not implemented');
  }

  async deleteUser(_id: string): Promise<boolean> {
    throw new Error('Method not implemented');
  }

  async countUsers(): Promise<number> {
    throw new Error('Method not implemented');
  }
  
 
}
