/**
 * Base Domain Event
 */
export class DomainEvent {
  eventType: string;
  timestamp: string;
  eventId: string;
  data: any;

  constructor(eventType: string, data: any) {
    this.eventType = eventType;
    this.timestamp = new Date().toISOString();
    this.eventId = this.generateEventId();
    this.data = data;
  }

  generateEventId(): string {
    return `${this.eventType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  toJSON(): any {
    return {
      eventId: this.eventId,
      eventType: this.eventType,
      timestamp: this.timestamp,
      data: this.data,
    };
  }
}

/**
 * User Created Event
 */
export class UserCreatedEvent extends DomainEvent {
  userId: string;
  email: string;
  username: string;

  constructor(userId: string, email: string, username: string) {
    super('UserCreated', { userId, email, username });
    this.userId = userId;
    this.email = email;
    this.username = username;
  }
}

/**
 * User Activated Event
 */
export class UserActivatedEvent extends DomainEvent {
  userId: string;

  constructor(userId: string) {
    super('UserActivated', { userId });
    this.userId = userId;
  }
}

/**
 * User Suspended Event
 */
export class UserSuspendedEvent extends DomainEvent {
  userId: number;
  reason: string;
  constructor(userId: number, reason: string) {
    super('UserSuspended', { userId, reason });
    this.userId = userId;
    this.reason = reason;
  }
}

/**
 * Challenge Completed Event
 */
export class ChallengeCompletedEvent extends DomainEvent {
  userId: string;
  challengeId: string;
  points: number;
  constructor(userId: string, challengeId: string, points: number) {
    super('ChallengeCompleted', { userId, challengeId, points });
    this.userId = userId;
    this.challengeId = challengeId;
    this.points = points;
  }
}

/**
 * Challenge Published Event
 */
export class ChallengePublishedEvent extends DomainEvent {
  challengeId: string;
  title: string;
  difficulty: string;
  constructor(challengeId: string, title: string, difficulty: string) {
    super('ChallengePublished', { challengeId, title, difficulty });
    this.challengeId = challengeId;
    this.title = title;
    this.difficulty = difficulty;
  }
}

/**
 * Project Created Event
 */
export class ProjectCreatedEvent extends DomainEvent {
  projectId: string;
  userId: string;
  title: string;
  constructor(projectId: string, userId: string, title: string) {
    super('ProjectCreated', { projectId, userId, title });
    this.projectId = projectId;
    this.userId = userId;
    this.title = title;
  }
}

/**
 * Project Completed Event
 */
export class ProjectCompletedEvent extends DomainEvent {
  projectId: string;
  userId: string;
  constructor(projectId: string, userId: string) {
    super('ProjectCompleted', { projectId, userId });
    this.projectId = projectId;
    this.userId = userId;
  }
}

/**
 * Event Published Event
 */
export class EventPublishedEvent extends DomainEvent {
  title: string;
  startDate: string;
  constructor(eventId: string, title: string, startDate: string) {
    super('EventPublished', { eventId, title, startDate });
    this.eventId = eventId;
    this.title = title;
    this.startDate = startDate;
  }
}

/**
 * Event Registration Event
 */
export class EventRegistrationEvent extends DomainEvent {
  userId: string;
  constructor(eventId: string, userId: string) {
    super('EventRegistration', { eventId, userId });
    this.eventId = eventId;
    this.userId = userId;
  }
}

/**
 * Points Awarded Event
 */
export class PointsAwardedEvent extends DomainEvent {
  userId: string;
  points: number;
  reason: string;
  constructor(userId: string, points: number, reason: string) {
    super('PointsAwarded', { userId, points, reason });
    this.userId = userId;
    this.points = points;
    this.reason = reason;
  }
}
