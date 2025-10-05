/**
 * Base Domain Event
 */
export class DomainEvent {
  constructor(eventType, data) {
    this.eventType = eventType;
    this.timestamp = new Date().toISOString();
    this.eventId = this.generateEventId();
    this.data = data;
  }

  generateEventId() {
    return `${this.eventType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  toJSON() {
    return {
      eventId: this.eventId,
      eventType: this.eventType,
      timestamp: this.timestamp,
      data: this.data
    };
  }
}

/**
 * User Created Event
 */
export class UserCreatedEvent extends DomainEvent {
  constructor(userId, email, username) {
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
  constructor(userId) {
    super('UserActivated', { userId });
    this.userId = userId;
  }
}

/**
 * User Suspended Event
 */
export class UserSuspendedEvent extends DomainEvent {
  constructor(userId, reason) {
    super('UserSuspended', { userId, reason });
    this.userId = userId;
    this.reason = reason;
  }
}

/**
 * Challenge Completed Event
 */
export class ChallengeCompletedEvent extends DomainEvent {
  constructor(userId, challengeId, points) {
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
  constructor(challengeId, title, difficulty) {
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
  constructor(projectId, userId, title) {
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
  constructor(projectId, userId) {
    super('ProjectCompleted', { projectId, userId });
    this.projectId = projectId;
    this.userId = userId;
  }
}

/**
 * Event Published Event
 */
export class EventPublishedEvent extends DomainEvent {
  constructor(eventId, title, startDate) {
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
  constructor(eventId, userId) {
    super('EventRegistration', { eventId, userId });
    this.eventId = eventId;
    this.userId = userId;
  }
}

/**
 * Points Awarded Event
 */
export class PointsAwardedEvent extends DomainEvent {
  constructor(userId, points, reason) {
    super('PointsAwarded', { userId, points, reason });
    this.userId = userId;
    this.points = points;
    this.reason = reason;
  }
}
