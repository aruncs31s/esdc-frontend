# ESDC Frontend Architecture

**Version:** 1.0  
**Last Updated:** October 2025  
**Status:** ✅ Active - Strict Adherence Required

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architectural Principles](#architectural-principles)
3. [Domain-Driven Design (DDD)](#domain-driven-design-ddd)
4. [Layer Structure](#layer-structure)
5. [Directory Organization](#directory-organization)
6. [Coding Standards](#coding-standards)
7. [Design Patterns](#design-patterns)
8. [Testing Strategy](#testing-strategy)
9. [Best Practices](#best-practices)
10. [Anti-Patterns to Avoid](#anti-patterns-to-avoid)
11. [Architecture Decision Records](#architecture-decision-records)

---

## Overview

The ESDC Frontend follows **Domain-Driven Design (DDD)** principles with a strict layered architecture. This ensures maintainability, scalability, and clear separation of concerns.

### Core Principles

- **Separation of Concerns**: Each layer has a single, well-defined responsibility
- **Dependency Rule**: Dependencies flow inward (Presentation → Application → Domain)
- **Business Logic in Domain**: All business rules live in the domain layer
- **Testability**: Each layer can be tested independently
- **Type Safety**: Strong TypeScript usage throughout

### Technology Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **State Management**: React Context + TanStack Query
- **Routing**: React Router v7
- **Styling**: Tailwind CSS + Custom Theme System
- **Testing**: Vitest + Testing Library
- **Code Quality**: ESLint + Prettier + Husky

---

## Architectural Principles

### 1. **Clean Architecture**

Our architecture follows Clean Architecture principles:

```
┌─────────────────────────────────────┐
│     Presentation Layer (UI)         │  ← User Interface
├─────────────────────────────────────┤
│     Application Layer               │  ← Use Cases & Orchestration
├─────────────────────────────────────┤
│     Domain Layer                    │  ← Business Logic (Core)
├─────────────────────────────────────┤
│     Infrastructure Layer            │  ← External Services & Data
└─────────────────────────────────────┘
```

**Dependency Flow**: Outer layers depend on inner layers, never the reverse.

### 2. **SOLID Principles**

- **S**ingle Responsibility: Each class/module has one reason to change
- **O**pen/Closed: Open for extension, closed for modification
- **L**iskov Substitution: Subtypes must be substitutable for base types
- **I**nterface Segregation: Many specific interfaces over one general
- **D**ependency Inversion: Depend on abstractions, not concretions

### 3. **DRY (Don't Repeat Yourself)**

- Shared logic belongs in the domain layer
- Common UI patterns in shared components
- Utilities and helpers properly organized

### 4. **KISS (Keep It Simple, Stupid)**

- Favor simplicity over cleverness
- Write code that's easy to understand
- Avoid premature optimization

---

## Domain-Driven Design (DDD)

### What is DDD?

Domain-Driven Design focuses on creating software that models the problem domain accurately. Business logic is encapsulated in domain entities, value objects, and services.

### DDD Building Blocks

#### 1. **Entities**

Objects with identity that persist over time.

```typescript
// ✅ Good: Entity with identity and behavior
export class User {
  constructor(
    private readonly id: string,
    private username: string,
    private email: Email,
    private role: UserRole,
    private status: UserStatus
  ) {}

  // Business methods
  activate(): void {
    this.status = UserStatus.ACTIVE;
  }

  suspend(reason: string): void {
    this.status = UserStatus.SUSPENDED;
  }

  // Query methods
  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  canParticipateInChallenges(): boolean {
    return this.status === UserStatus.ACTIVE;
  }
}
```

#### 2. **Value Objects**

Immutable objects defined by their attributes, not identity.

```typescript
// ✅ Good: Value Object with validation
export class Email {
  private readonly value: string;

  constructor(email: string) {
    if (!this.isValid(email)) {
      throw new Error('Invalid email format');
    }
    this.value = email.toLowerCase();
  }

  private isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  toString(): string {
    return this.value;
  }
}
```

#### 3. **Aggregates**

A cluster of entities and value objects with a root entity.

```typescript
// User is an aggregate root
// It controls access to related objects
export class User {
  private projects: Project[] = [];

  addProject(project: Project): void {
    // Enforce business rules
    if (this.projects.length >= 10) {
      throw new Error('Maximum projects limit reached');
    }
    this.projects.push(project);
  }
}
```

#### 4. **Domain Services**

Business logic that doesn't naturally fit in an entity or value object.

```typescript
// ✅ Good: Domain Service
export class ChallengeEvaluationService {
  evaluateCompletion(user: User, challenge: Challenge, submission: Submission): EvaluationResult {
    // Complex business logic spanning multiple entities
    const pointsAwarded = challenge.getAwardPoints();

    if (user.hasCompletedChallenge(challenge.id)) {
      throw new Error('Challenge already completed');
    }

    return new EvaluationResult(pointsAwarded, true);
  }
}
```

#### 5. **Domain Events**

Events that represent something important that happened in the domain.

```typescript
// ✅ Good: Domain Event
export interface UserCreatedEvent {
  eventType: 'UserCreated';
  userId: string;
  email: string;
  timestamp: string;
}

// Publishing events
eventBus.publish({
  eventType: 'UserCreated',
  userId: user.id,
  email: user.email.toString(),
  timestamp: new Date().toISOString(),
});
```

#### 6. **Repositories**

Abstraction for data persistence and retrieval.

```typescript
// ✅ Good: Repository Interface
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  save(user: User): Promise<void>;
  delete(id: string): Promise<void>;
  findAll(filters?: UserFilters): Promise<User[]>;
}

// Infrastructure provides implementation
export class ApiUserRepository implements IUserRepository {
  // Implementation details
}
```

---

## Layer Structure

### 1. Domain Layer (`src/domain/`)

**Purpose**: Contains business logic and domain model. This is the heart of the application.

**Responsibilities**:

- Define domain entities
- Define value objects
- Implement business rules
- Define repository interfaces
- Domain services
- Domain events

**Rules**:

- ❌ NO dependencies on other layers
- ❌ NO framework dependencies
- ❌ NO infrastructure concerns
- ✅ Pure TypeScript/JavaScript
- ✅ Only business logic

**Structure**:

```
domain/
├── entities/          # Business entities (User, Challenge, etc.)
├── value-objects/     # Immutable value objects (Email, Points, etc.)
├── services/          # Domain services
├── events/            # Domain events and event bus
├── repositories/      # Repository interfaces
└── index.ts          # Public API
```

### 2. Application Layer (`src/application/`)

**Purpose**: Orchestrates use cases and application flow.

**Responsibilities**:

- Define use cases
- Coordinate domain objects
- Handle transactions
- Manage application state
- Provide facade to presentation layer

**Rules**:

- ✅ Can depend on domain layer
- ❌ NO direct dependencies on infrastructure
- ❌ NO UI concerns
- ✅ Use dependency injection for repositories

**Structure**:

```
application/
├── use-cases/         # Application use cases
├── ApplicationService.ts  # Main facade
├── Container.ts       # Dependency injection
└── index.ts          # Public API
```

### 3. Infrastructure Layer (`src/infrastructure/`)

**Purpose**: Implements technical concerns and external integrations.

**Responsibilities**:

- API communication
- Repository implementations
- External service integration
- Data transformation (DTOs)

**Rules**:

- ✅ Can depend on domain layer
- ✅ Implements domain interfaces
- ❌ NO direct access from presentation
- ✅ Handle all external I/O

**Structure**:

```
infrastructure/
├── api/              # API clients
├── repositories/     # Repository implementations
├── dto/             # Data Transfer Objects
└── index.ts         # Public API
```

### 4. Presentation Layer (`src/`)

**Purpose**: User interface and user interaction.

**Responsibilities**:

- React components
- Routing
- State management
- User events
- Display logic

**Rules**:

- ✅ Only depends on application layer
- ❌ NO direct domain or infrastructure access
- ✅ Use ApplicationService facade
- ✅ Handle UI state only

**Structure**:

```
presentation/
├── app/              # App setup and providers
├── components/       # Reusable UI components
├── pages/           # Page components
├── features/        # Feature modules
├── shared/          # Shared utilities
├── contexts/        # React contexts
├── hooks/           # Custom hooks
└── styles/          # Styling
```

---

## Directory Organization

### Complete Structure

```
esdc-frontend/
├── src/
│   ├── domain/                    # 🟢 Domain Layer
│   │   ├── entities/
│   │   │   ├── User.ts           # User aggregate root
│   │   │   ├── Challenge.ts      # Challenge entity
│   │   │   ├── Project.ts        # Project entity
│   │   │   └── Event.ts          # Event entity
│   │   ├── value-objects/
│   │   │   ├── Email.ts          # Email value object
│   │   │   ├── Points.ts         # Points value object
│   │   │   ├── Difficulty.ts     # Difficulty value object
│   │   │   └── DateRange.ts      # DateRange value object
│   │   ├── services/
│   │   │   ├── ChallengeEvaluationService.ts
│   │   │   ├── LeaderboardService.ts
│   │   │   └── NotificationService.ts
│   │   ├── events/
│   │   │   ├── EventBus.ts       # Event bus implementation
│   │   │   └── DomainEvents.ts   # Event definitions
│   │   ├── repositories/
│   │   │   ├── IUserRepository.ts
│   │   │   ├── IChallengeRepository.ts
│   │   │   ├── IProjectRepository.ts
│   │   │   └── IEventRepository.ts
│   │   └── index.ts
│   │
│   ├── application/               # 🔵 Application Layer
│   │   ├── use-cases/
│   │   │   ├── CreateUserUseCase.ts
│   │   │   ├── CompleteChallengeUseCase.ts
│   │   │   └── ...
│   │   ├── ApplicationService.ts  # Main facade
│   │   ├── Container.ts          # DI container
│   │   └── index.ts
│   │
│   ├── infrastructure/            # 🟡 Infrastructure Layer
│   │   ├── api/
│   │   │   ├── ApiClient.ts
│   │   │   └── endpoints.ts
│   │   ├── repositories/
│   │   │   ├── ApiUserRepository.ts
│   │   │   ├── ApiChallengeRepository.ts
│   │   │   └── ...
│   │   ├── dto/
│   │   │   └── UserDTO.ts
│   │   └── index.ts
│   │
│   ├── app/                       # 🔴 Presentation Layer
│   │   ├── providers/
│   │   │   └── AppProviders.tsx
│   │   ├── router/
│   │   │   └── AppRouter.tsx
│   │   └── App.tsx
│   │
│   ├── features/                  # Feature modules
│   │   ├── auth/
│   │   ├── admin/
│   │   ├── challenges/
│   │   ├── projects/
│   │   └── users/
│   │
│   ├── components/                # Shared components
│   │   ├── ui/
│   │   └── layout/
│   │
│   ├── pages/                     # Page components
│   │   ├── Home.tsx
│   │   ├── AdminPanel.tsx
│   │   └── ...
│   │
│   ├── shared/                    # Shared utilities
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── constants/
│   │   └── types/
│   │
│   └── main.tsx                   # Entry point
│
├── docs/                          # Documentation
│   ├── architecture/              # Architecture docs
│   ├── api/                       # API documentation
│   └── DDD_*.md                  # DDD guides
│
├── tests/                         # Tests
│   ├── unit/
│   └── integration/
│
└── [config files]                 # Configuration
```

---

## Coding Standards

### Import Order

Always follow this import order:

```typescript
// 1. External dependencies
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Application layer (REQUIRED for UI)
import applicationService from '@/application/ApplicationService';

// 3. Domain types (for type annotations only)
import { User, UserRole } from '@/domain';

// 4. Internal components/hooks
import { Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';

// 5. Styles
import './MyComponent.css';
```

### Naming Conventions

```typescript
// Entities: PascalCase
class User {}
class Challenge {}

// Value Objects: PascalCase
class Email {}
class Points {}

// Interfaces: PascalCase with I prefix
interface IUserRepository {}

// Services: PascalCase with Service suffix
class ChallengeEvaluationService {}

// Use Cases: PascalCase with UseCase suffix
class CreateUserUseCase {}

// Components: PascalCase
const UserProfile = () => {};

// Hooks: camelCase with use prefix
const useAuth = () => {};

// Constants: UPPER_SNAKE_CASE
const MAX_LOGIN_ATTEMPTS = 3;

// Enums: PascalCase
enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}
```

---

## Design Patterns

### 1. Repository Pattern

**Purpose**: Abstract data access

```typescript
// ✅ Good: Use repository through application service
const users = await applicationService.getAllUsers();

// ❌ Bad: Direct API call from component
const response = await fetch('/api/users');
```

### 2. Facade Pattern

**Purpose**: Simplified interface for complex subsystems

```typescript
// ✅ Good: Use ApplicationService facade
import applicationService from '@/application/ApplicationService';

const result = await applicationService.createUser(userData);
```

### 3. Factory Pattern

**Purpose**: Object creation logic

```typescript
// ✅ Good: Factory method
class Difficulty {
  static beginner(): Difficulty {
    return new Difficulty('beginner');
  }

  static advanced(): Difficulty {
    return new Difficulty('advanced');
  }
}
```

### 4. Observer Pattern (Events)

**Purpose**: Decoupled communication

```typescript
// ✅ Good: Subscribe to domain events
eventBus.subscribe('UserCreated', async (event) => {
  // Send welcome email
  await emailService.sendWelcome(event.userId);
});
```

### 5. Strategy Pattern

**Purpose**: Interchangeable algorithms

```typescript
// ✅ Good: Different evaluation strategies
interface EvaluationStrategy {
  evaluate(submission: Submission): boolean;
}

class AutomatedEvaluation implements EvaluationStrategy {}
class ManualEvaluation implements EvaluationStrategy {}
```

---

## Testing Strategy

### Testing Pyramid

```
        /\
       /  \      E2E Tests (Few)
      /____\
     /      \    Integration Tests (Some)
    /________\
   /          \  Unit Tests (Many)
  /____________\
```

### Unit Tests

Test individual units in isolation:

```typescript
// ✅ Good: Test domain entity
describe('User', () => {
  it('should activate user', () => {
    const user = new User({
      username: 'test',
      email: new Email('test@example.com'),
      status: UserStatus.PENDING,
    });

    user.activate();

    expect(user.isActive()).toBe(true);
  });
});
```

### Integration Tests

Test layer interactions:

```typescript
// ✅ Good: Test use case with mock repository
describe('CreateUserUseCase', () => {
  it('should create user', async () => {
    const mockRepo = { save: jest.fn() };
    const useCase = new CreateUserUseCase(mockRepo);

    const result = await useCase.execute({
      username: 'test',
      email: 'test@example.com',
    });

    expect(result.success).toBe(true);
    expect(mockRepo.save).toHaveBeenCalled();
  });
});
```

---

## Best Practices

### ✅ DO

1. **Use ApplicationService from UI**

   ```typescript
   import applicationService from '@/application/ApplicationService';
   const users = await applicationService.getAllUsers();
   ```

2. **Validate in Domain Layer**

   ```typescript
   class User {
     validate(): ValidationResult {
       // Business validation logic
     }
   }
   ```

3. **Use Value Objects**

   ```typescript
   const email = new Email('user@example.com');
   const points = new Points(100);
   ```

4. **Handle Errors Properly**

   ```typescript
   const result = await applicationService.createUser(data);
   if (result.success) {
     // Success handling
   } else {
     // Error handling with result.error
   }
   ```

5. **Subscribe to Domain Events**
   ```typescript
   eventBus.subscribe('ChallengeCompleted', async (event) => {
     // Side effects
   });
   ```

### ❌ DON'T

1. **Don't Access Infrastructure Directly**

   ```typescript
   // ❌ Bad
   import { userRepository } from '@/infrastructure';
   const users = await userRepository.findAll();
   ```

2. **Don't Put Business Logic in Components**

   ```typescript
   // ❌ Bad
   const handleComplete = () => {
     let points = challenge.points;
     if (challenge.difficulty === 'hard') points *= 2;
     user.points += points;
   };
   ```

3. **Don't Use Primitive Types for Domain Concepts**

   ```typescript
   // ❌ Bad
   const email: string = 'user@example.com';

   // ✅ Good
   const email: Email = new Email('user@example.com');
   ```

4. **Don't Skip Validation**

   ```typescript
   // ❌ Bad
   await api.createUser({ email: formData.email });

   // ✅ Good
   const result = await applicationService.createUser(formData);
   ```

5. **Don't Mix Layers**
   ```typescript
   // ❌ Bad: API call in domain entity
   class User {
     async save() {
       await fetch('/api/users', {...});
     }
   }
   ```

---

## Anti-Patterns to Avoid

### 1. Anemic Domain Model

**Problem**: Entities with no behavior, just getters/setters.

```typescript
// ❌ Bad: Anemic model
class User {
  username: string;
  points: number;

  getUsername() {
    return this.username;
  }
  setUsername(value) {
    this.username = value;
  }
}

// ✅ Good: Rich domain model
class User {
  activate(): void {
    /* logic */
  }
  addPoints(points: Points): void {
    /* logic */
  }
  isAdmin(): boolean {
    /* logic */
  }
}
```

### 2. God Objects

**Problem**: Classes that know/do too much.

```typescript
// ❌ Bad: God class
class ApplicationService {
  // 50+ methods handling everything
}

// ✅ Good: Focused services
class UserApplicationService {}
class ChallengeApplicationService {}
```

### 3. Primitive Obsession

**Problem**: Using primitives instead of value objects.

```typescript
// ❌ Bad
const email: string = 'user@example.com';
const points: number = 100;

// ✅ Good
const email: Email = new Email('user@example.com');
const points: Points = new Points(100);
```

### 4. Layer Violation

**Problem**: Skipping layers or wrong dependencies.

```typescript
// ❌ Bad: UI directly accessing repository
import { userRepository } from '@/infrastructure';

// ✅ Good: UI using application service
import applicationService from '@/application/ApplicationService';
```

### 5. Business Logic in UI

**Problem**: Domain rules in components.

```typescript
// ❌ Bad
const canComplete = user.status === 'active' && user.points >= 100 && !user.bannedUntil;

// ✅ Good
const canComplete = user.canParticipateInChallenges();
```

---

## Architecture Decision Records

### ADR-001: Domain-Driven Design

**Status**: Accepted  
**Date**: 2025-10

**Context**: Need clear architecture for maintainable, scalable application.

**Decision**: Adopt DDD with layered architecture.

**Consequences**:

- ✅ Clear separation of concerns
- ✅ Testable business logic
- ✅ Easier to maintain and extend
- ⚠️ Initial learning curve

### ADR-002: Application Service Facade

**Status**: Accepted  
**Date**: 2025-10

**Context**: Simplify UI interaction with domain/infrastructure.

**Decision**: Provide ApplicationService facade for all UI operations.

**Consequences**:

- ✅ Simple API for UI developers
- ✅ Consistent error handling
- ✅ Easy to refactor internals
- ⚠️ Additional abstraction layer

### ADR-003: Value Objects for Domain Concepts

**Status**: Accepted  
**Date**: 2025-10

**Context**: Improve type safety and validation.

**Decision**: Use value objects (Email, Points, etc.) instead of primitives.

**Consequences**:

- ✅ Built-in validation
- ✅ Type safety
- ✅ Self-documenting code
- ⚠️ More classes to manage

### ADR-004: Event-Driven Architecture

**Status**: Accepted  
**Date**: 2025-10

**Context**: Decouple side effects from main flows.

**Decision**: Use domain events for cross-cutting concerns.

**Consequences**:

- ✅ Loose coupling
- ✅ Easy to add side effects
- ✅ Better scalability
- ⚠️ Debugging can be harder

---

## Quick Reference

### Common Tasks

**Get All Users**:

```typescript
const result = await applicationService.getAllUsers();
const users = result.data;
```

**Create User**:

```typescript
const result = await applicationService.createUser({
  username: 'johndoe',
  email: 'john@example.com',
  role: 'user',
});
```

**Complete Challenge**:

```typescript
const result = await applicationService.completeChallenge(userId, challengeId);
```

**Subscribe to Events**:

```typescript
eventBus.subscribe('UserCreated', async (event) => {
  console.log('New user:', event.userId);
});
```

---

## Related Documentation

- **[DDD Quick Reference](./docs/DDD_QUICK_REFERENCE.md)** - Common operations
- **[DDD Implementation Guide](./docs/DDD_IMPLEMENTATION_GUIDE.md)** - Detailed guide
- **[DDD Before/After](./docs/DDD_BEFORE_AFTER.md)** - Migration examples
- **[API Documentation](./docs/api/)** - API endpoints
- **[Contributing Guide](./docs/CONTRIBUTE.md)** - How to contribute

---

## Enforcement

This architecture is **mandatory** for all new code. Code reviews will enforce:

1. ✅ No direct infrastructure access from UI
2. ✅ Business logic in domain layer
3. ✅ Use of ApplicationService facade
4. ✅ Proper error handling
5. ✅ Value objects for domain concepts
6. ✅ No layer violations
7. ✅ Proper testing at each layer

**Questions?** Check documentation or ask the team lead.

---

**Last Updated**: October 2025  
**Maintained By**: ESDC Development Team  
**Version**: 1.0
