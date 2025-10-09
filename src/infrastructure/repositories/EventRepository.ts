import { IEventRepository } from '../../domain/repositories/IEventRepository.js';
import { Event } from '../../domain/entities/Event.js';
import apiClient from '../api/ApiClient.js';

/**
 * Event Repository Implementation
 * Handles event data persistence via API
 */
export class EventRepository extends IEventRepository {
  private api: typeof apiClient;

  constructor(client = apiClient) {
    super();
    this.api = client;
  }

  /**
   * Find all events with optional filters
   */
  async findAll(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const response = await this.api.get(`/api/events?${params}`);
      const data = response.data?.data || response.data || [];
      return Event.fromAPIArray(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  }

  /**
   * Find event by ID
   */
  async findById(id) {
    try {
      const response = await this.api.get(`/api/events/${id}`);
      const data = response.data?.data || response.data;
      return Event.fromAPI(data);
    } catch (error) {
      console.error(`Error fetching event ${id}:`, error);
      return null;
    }
  }

  /**
   * Find events by status
   */
  async findByStatus(status) {
    try {
      const response = await this.api.get(`/api/events?status=${status}`);
      const data = response.data?.data || response.data || [];
      return Event.fromAPIArray(data);
    } catch (error) {
      console.error(`Error fetching events by status ${status}:`, error);
      return [];
    }
  }

  /**
   * Find upcoming events
   */
  async findUpcoming() {
    try {
      const response = await this.api.get('/api/events?upcoming=true');
      const data = response.data?.data || response.data || [];
      return Event.fromAPIArray(data);
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      return [];
    }
  }

  /**
   * Save event (create or update)
   */
  async save(event) {
    try {
      if (event.id) {
        // Update existing event
        const response = await this.api.put(
          `/api/events/${event.id}`,
          event.toJSON()
        );
        const data = response.data?.data || response.data;
        return Event.fromAPI(data);
      } else {
        // Create new event
        const response = await this.api.post('/api/events', event.toJSON());
        const data = response.data?.data || response.data;
        return Event.fromAPI(data);
      }
    } catch (error) {
      console.error('Error saving event:', error);
      throw error;
    }
  }

  /**
   * Delete event by ID
   */
  async delete(id) {
    try {
      await this.api.delete(`/api/events/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting event ${id}:`, error);
      throw error;
    }
  }

  /**
   * Count total events
   */
  async count() {
    try {
      const events = await this.findAll();
      return events.length;
    } catch (error) {
      console.error('Error counting events:', error);
      return 0;
    }
  }
}

// Singleton instance
const eventRepository = new EventRepository();

export default eventRepository;
