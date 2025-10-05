import { DateRange } from '../value-objects/DateRange.js';

/**
 * Event Status Enumeration
 */
export const EventStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

/**
 * Event Entity (Aggregate Root)
 * Represents an event in the ESDC system
 */
export class Event {
  constructor(data = {}) {
    this.id = data.id || null;
    this.title = data.title || '';
    this.description = data.description || '';
    this.status = data.status || EventStatus.DRAFT;
    this.category = data.category || '';
    this.location = data.location || '';
    this.mode = data.mode || 'offline'; // online, offline, hybrid
    this.dateRange = data.dateRange instanceof DateRange
      ? data.dateRange
      : new DateRange(
          data.start_date || data.startDate || new Date(),
          data.end_date || data.endDate || new Date()
        );
    this.maxParticipants = data.maxParticipants || data.max_participants || null;
    this.registeredParticipants = data.registeredParticipants || data.registered_participants || 0;
    this.imageUrl = data.imageUrl || data.image_url || '';
    this.registrationUrl = data.registrationUrl || data.registration_url || '';
    this.tags = data.tags || [];
    this.organizers = data.organizers || [];
    this.createdBy = data.createdBy || data.created_by || null;
    this.createdAt = data.createdAt || data.created_at || new Date().toISOString();
    this.updatedAt = data.updatedAt || data.updated_at || new Date().toISOString();
  }

  // Business Logic Methods

  /**
   * Publish event
   */
  publish() {
    if (this.status === EventStatus.PUBLISHED) {
      throw new Error('Event is already published');
    }
    this.validate();
    this.status = EventStatus.PUBLISHED;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Start event (make it ongoing)
   */
  start() {
    if (!this.dateRange.hasStarted()) {
      throw new Error('Cannot start event before start date');
    }
    this.status = EventStatus.ONGOING;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Complete event
   */
  complete() {
    this.status = EventStatus.COMPLETED;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Cancel event
   */
  cancel(reason) {
    this.status = EventStatus.CANCELLED;
    this.cancellationReason = reason;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Register a participant
   */
  registerParticipant() {
    if (!this.canAcceptRegistrations()) {
      throw new Error('Event is not accepting registrations');
    }
    if (this.isFull()) {
      throw new Error('Event is full');
    }
    this.registeredParticipants++;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Unregister a participant
   */
  unregisterParticipant() {
    if (this.registeredParticipants > 0) {
      this.registeredParticipants--;
      this.updatedAt = new Date().toISOString();
    }
  }

  // Query Methods

  /**
   * Check if event is active (published and within date range)
   */
  isActive() {
    return this.status === EventStatus.PUBLISHED && this.dateRange.isActive();
  }

  /**
   * Check if event is ongoing
   */
  isOngoing() {
    return this.status === EventStatus.ONGOING;
  }

  /**
   * Check if event is full
   */
  isFull() {
    if (!this.maxParticipants) {
      return false;
    }
    return this.registeredParticipants >= this.maxParticipants;
  }

  /**
   * Check if event can accept registrations
   */
  canAcceptRegistrations() {
    return this.status === EventStatus.PUBLISHED && 
           !this.dateRange.hasEnded() &&
           !this.isFull();
  }

  /**
   * Check if event has ended
   */
  hasEnded() {
    return this.dateRange.hasEnded() || this.status === EventStatus.COMPLETED;
  }

  /**
   * Check if user can edit event
   */
  canBeEditedBy(user) {
    return user.isAdmin() || user.id === this.createdBy;
  }

  /**
   * Get available slots
   */
  getAvailableSlots() {
    if (!this.maxParticipants) {
      return null;
    }
    return Math.max(0, this.maxParticipants - this.registeredParticipants);
  }

  /**
   * Get registration percentage
   */
  getRegistrationPercentage() {
    if (!this.maxParticipants) {
      return 0;
    }
    return (this.registeredParticipants / this.maxParticipants) * 100;
  }

  // Validation

  /**
   * Validate event data
   */
  validate() {
    const errors = [];

    if (!this.title || this.title.length < 5) {
      errors.push('Title must be at least 5 characters long');
    }

    if (!this.description || this.description.length < 20) {
      errors.push('Description must be at least 20 characters long');
    }

    try {
      this.dateRange.validate();
    } catch (error) {
      errors.push(error.message);
    }

    if (!Object.values(EventStatus).includes(this.status)) {
      errors.push('Invalid event status');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Serialization

  /**
   * Convert to JSON for API calls
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      category: this.category,
      location: this.location,
      mode: this.mode,
      start_date: this.dateRange.startDate.toISOString(),
      end_date: this.dateRange.endDate.toISOString(),
      max_participants: this.maxParticipants,
      registered_participants: this.registeredParticipants,
      image_url: this.imageUrl,
      registration_url: this.registrationUrl,
      tags: this.tags,
      organizers: this.organizers,
      created_by: this.createdBy,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    };
  }

  /**
   * Create Event from API response
   */
  static fromAPI(data) {
    return new Event(data);
  }

  /**
   * Create multiple Events from API response array
   */
  static fromAPIArray(dataArray) {
    if (!Array.isArray(dataArray)) {
      return [];
    }
    return dataArray.map(data => Event.fromAPI(data));
  }
}

/**
 * Factory function to create an event
 */
export const createEvent = (eventData) => {
  return new Event(eventData);
};
