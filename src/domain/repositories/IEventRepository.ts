import { Event } from '../entities/Event';

/**
 * Event Repository Interface
 * Defines the contract for event data access
 */
export interface IEventRepository {
  findAll(filters?: Record<string, unknown>): Promise<Event[]>;
  findById(id: string): Promise<Event | null>;
  findByStatus(status: string): Promise<Event[]>;
  findUpcoming(): Promise<Event[]>;
  save(event: Event): Promise<Event>;
  delete(id: string): Promise<boolean>;
  count(): Promise<number>;
}
