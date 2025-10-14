import { DateRange } from '../value-objects/DateRange';

export const EventStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export type EventStatusType = (typeof EventStatus)[keyof typeof EventStatus];

interface EventData {
  id?: string | null;
  title?: string;
  description?: string;
  status?: EventStatusType;
  category?: string;
  location?: string;
  mode?: string;
  dateRange?: DateRange;
  start_date?: Date | string;
  startDate?: Date | string;
  end_date?: Date | string;
  endDate?: Date | string;
  maxParticipants?: number | null;
  max_participants?: number | null;
  registeredParticipants?: number;
  registered_participants?: number;
  imageUrl?: string;
  image_url?: string;
  registrationUrl?: string;
  registration_url?: string;
  tags?: string[];
  organizers?: string[];
  createdBy?: string | null;
  created_by?: string | null;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export class Event {
  id: string | null;
  title: string;
  description: string;
  status: EventStatusType;
  category: string;
  location: string;
  mode: string;
  dateRange: DateRange;
  maxParticipants: number | null;
  registeredParticipants: number;
  imageUrl: string;
  registrationUrl: string;
  tags: string[];
  organizers: string[];
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
  cancellationReason?: string;

  constructor(data: EventData = {}) {
    this.id = data.id || null;
    this.title = data.title || '';
    this.description = data.description || '';
    this.status = data.status || EventStatus.DRAFT;
    this.category = data.category || '';
    this.location = data.location || '';
    this.mode = data.mode || 'offline';
    this.dateRange =
      data.dateRange instanceof DateRange
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

  publish(): void {
    if (this.status === EventStatus.PUBLISHED) {
      throw new Error('Event is already published');
    }
    this.validate();
    this.status = EventStatus.PUBLISHED;
    this.updatedAt = new Date().toISOString();
  }

  start(): void {
    if (!this.dateRange.hasStarted()) {
      throw new Error('Cannot start event before start date');
    }
    this.status = EventStatus.ONGOING;
    this.updatedAt = new Date().toISOString();
  }

  complete(): void {
    this.status = EventStatus.COMPLETED;
    this.updatedAt = new Date().toISOString();
  }

  cancel(reason: string): void {
    this.status = EventStatus.CANCELLED;
    this.cancellationReason = reason;
    this.updatedAt = new Date().toISOString();
  }

  registerParticipant(): void {
    if (!this.canAcceptRegistrations()) {
      throw new Error('Event is not accepting registrations');
    }
    if (this.isFull()) {
      throw new Error('Event is full');
    }
    this.registeredParticipants++;
    this.updatedAt = new Date().toISOString();
  }

  unregisterParticipant(): void {
    if (this.registeredParticipants > 0) {
      this.registeredParticipants--;
      this.updatedAt = new Date().toISOString();
    }
  }

  isActive(): boolean {
    return this.status === EventStatus.PUBLISHED && this.dateRange.isActive();
  }

  isOngoing(): boolean {
    return this.status === EventStatus.ONGOING;
  }

  isFull(): boolean {
    if (!this.maxParticipants) {
      return false;
    }
    return this.registeredParticipants >= this.maxParticipants;
  }

  canAcceptRegistrations(): boolean {
    return this.status === EventStatus.PUBLISHED && !this.dateRange.hasEnded() && !this.isFull();
  }

  hasEnded(): boolean {
    return this.dateRange.hasEnded() || this.status === EventStatus.COMPLETED;
  }

  canBeEditedBy(user: any): boolean {
    return user.isAdmin() || user.id === this.createdBy;
  }

  getAvailableSlots(): number | null {
    if (!this.maxParticipants) {
      return null;
    }
    return Math.max(0, this.maxParticipants - this.registeredParticipants);
  }

  getRegistrationPercentage(): number {
    if (!this.maxParticipants) {
      return 0;
    }
    return (this.registeredParticipants / this.maxParticipants) * 100;
  }

  validate(): ValidationResult {
    const errors: string[] = [];

    if (!this.title || this.title.length < 5) {
      errors.push('Title must be at least 5 characters long');
    }

    if (!this.description || this.description.length < 20) {
      errors.push('Description must be at least 20 characters long');
    }

    try {
      // DateRange validation is done in DateRange constructor
      if (this.dateRange) {
        this.dateRange.toString(); // Just to check it exists
      }
    } catch (error) {
      errors.push((error as Error).message);
    }

    if (!Object.values(EventStatus).includes(this.status)) {
      errors.push('Invalid event status');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  toJSON(): Record<string, any> {
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
      updated_at: this.updatedAt,
    };
  }

  static fromAPI(data: EventData): Event {
    return new Event(data);
  }

  static fromAPIArray(dataArray: EventData[]): Event[] {
    if (!Array.isArray(dataArray)) {
      return [];
    }
    return dataArray.map((data) => Event.fromAPI(data));
  }
}

export const createEvent = (eventData: EventData): Event => {
  return new Event(eventData);
};
