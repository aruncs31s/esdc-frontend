/**
 * Event Bus for Domain Events
 * Implements the Observer pattern for event handling
 */
class EventBus {
  handlers: Map<string, Function[]>;
  constructor() {
    this.handlers = new Map();
  }

  /**
   * Subscribe to an event
   */
  subscribe(eventType, handler) {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType).push(handler);
  }

  /**
   * Unsubscribe from an event
   */
  unsubscribe(eventType, handler) {
    if (!this.handlers.has(eventType)) {
      return;
    }
    const handlers = this.handlers.get(eventType);
    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
    }
  }

  /**
   * Publish an event
   */
  async publish(event) {
    const eventType = event.eventType;
    if (!this.handlers.has(eventType)) {
      return;
    }

    const handlers = this.handlers.get(eventType);
    const promises = handlers.map(handler => {
      try {
        return Promise.resolve(handler(event));
      } catch (error) {
        console.error(`Error handling event ${eventType}:`, error);
        return Promise.resolve();
      }
    });

    await Promise.all(promises);
  }

  /**
   * Clear all handlers
   */
  clear() {
    this.handlers.clear();
  }

  /**
   * Get handler count for an event type
   */
  getHandlerCount(eventType) {
    return this.handlers.has(eventType) ? this.handlers.get(eventType).length : 0;
  }
}

// Singleton instance
const eventBus = new EventBus();

export default eventBus;
