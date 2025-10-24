# Design Patterns and Code Examples

**Purpose**: Reference guide for common patterns used in ESDC Frontend  
**Version**: 1.0

---

## Table of Contents

1. [Repository Pattern](#repository-pattern)
2. [Use Case Pattern](#use-case-pattern)
3. [Value Object Pattern](#value-object-pattern)
4. [Entity Pattern](#entity-pattern)
5. [Domain Service Pattern](#domain-service-pattern)
6. [Event-Driven Pattern](#event-driven-pattern)
7. [Facade Pattern](#facade-pattern)
8. [Dependency Injection](#dependency-injection)
9. [React Patterns](#react-patterns)

---

## Repository Pattern

### Purpose

Abstract data access and provide a collection-like interface for domain objects.

### Structure

```typescript
// 1. Define interface in domain layer
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  save(user: User): Promise<void>;
  delete(id: string): Promise<void>;
  findAll(filters?: UserFilters): Promise<User[]>;
}

// 2. Implement in infrastructure layer
export class ApiUserRepository implements IUserRepository {
  constructor(private apiClient: ApiClient) {}

  async findById(id: string): Promise<User | null> {
    try {
      const response = await this.apiClient.get(`/users/${id}`);
      return this.toDomain(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async save(user: User): Promise<void> {
    const dto = this.toDTO(user);
    await this.apiClient.post('/users', dto);
  }

  private toDomain(dto: UserDTO): User {
    return new User({
      id: dto.id,
      username: dto.username,
      email: new Email(dto.email),
      role: dto.role as UserRole,
      status: dto.status as UserStatus,
    });
  }

  private toDTO(user: User): UserDTO {
    return {
      id: user.id,
      username: user.username,
      email: user.email.toString(),
      role: user.role,
      status: user.status,
    };
  }
}
```

### Usage

```typescript
// In use case
export class GetUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<Result<User>> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      return Result.fail('User not found');
    }

    return Result.ok(user);
  }
}
```

---

## Use Case Pattern

### Purpose

Encapsulate a single business operation or user story.

### Structure

```typescript
// Use case interface
interface UseCase<TRequest, TResponse> {
  execute(request: TRequest): Promise<Result<TResponse>>;
}

// Example: Create User Use Case
export class CreateUserUseCase implements UseCase<CreateUserRequest, User> {
  constructor(
    private userRepository: IUserRepository,
    private eventBus: EventBus
  ) {}

  async execute(request: CreateUserRequest): Promise<Result<User>> {
    // 1. Validate input
    if (!request.username || !request.email) {
      return Result.fail('Username and email are required');
    }

    // 2. Check business rules
    const existingUser = await this.userRepository.findByEmail(new Email(request.email));

    if (existingUser) {
      return Result.fail('User with this email already exists');
    }

    // 3. Create domain entity
    const user = new User({
      username: request.username,
      email: new Email(request.email),
      role: request.role || UserRole.USER,
      status: UserStatus.ACTIVE,
    });

    // 4. Validate domain rules
    const validation = user.validate();
    if (!validation.valid) {
      return Result.fail(validation.errors.join(', '));
    }

    // 5. Save
    await this.userRepository.save(user);

    // 6. Publish events
    this.eventBus.publish({
      eventType: 'UserCreated',
      userId: user.id,
      email: user.email.toString(),
      timestamp: new Date().toISOString(),
    });

    // 7. Return result
    return Result.ok(user);
  }
}

// Request DTO
export interface CreateUserRequest {
  username: string;
  email: string;
  role?: UserRole;
}
```

### Result Pattern

```typescript
// Result wrapper for use case responses
export class Result<T> {
  constructor(
    public readonly success: boolean,
    public readonly data?: T,
    public readonly error?: string,
    public readonly message?: string
  ) {}

  static ok<T>(data: T, message?: string): Result<T> {
    return new Result(true, data, undefined, message);
  }

  static fail<T>(error: string): Result<T> {
    return new Result(false, undefined, error);
  }
}
```

---

## Value Object Pattern

### Purpose

Represent concepts from the problem domain that have no identity but are defined by their attributes.

### Characteristics

- Immutable
- Self-validating
- Can be compared by value

### Examples

#### Email Value Object

```typescript
export class Email {
  private readonly value: string;

  constructor(email: string) {
    if (!this.isValid(email)) {
      throw new Error('Invalid email format');
    }
    this.value = email.toLowerCase().trim();
  }

  private isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  toString(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  getDomain(): string {
    return this.value.split('@')[1];
  }
}
```

#### Points Value Object

```typescript
export class Points {
  private readonly value: number;

  constructor(points: number) {
    if (points < 0) {
      throw new Error('Points cannot be negative');
    }
    this.value = Math.floor(points);
  }

  getValue(): number {
    return this.value;
  }

  add(other: Points): Points {
    return new Points(this.value + other.value);
  }

  subtract(other: Points): Points {
    const result = this.value - other.value;
    if (result < 0) {
      throw new Error('Cannot have negative points');
    }
    return new Points(result);
  }

  multiply(factor: number): Points {
    return new Points(this.value * factor);
  }

  isGreaterThan(other: Points): boolean {
    return this.value > other.value;
  }

  equals(other: Points): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value.toString();
  }
}
```

#### DateRange Value Object

```typescript
export class DateRange {
  private readonly startDate: Date;
  private readonly endDate: Date;

  constructor(start: string, end: string) {
    this.startDate = new Date(start);
    this.endDate = new Date(end);

    if (this.startDate >= this.endDate) {
      throw new Error('Start date must be before end date');
    }
  }

  isActive(): boolean {
    const now = new Date();
    return now >= this.startDate && now <= this.endDate;
  }

  hasStarted(): boolean {
    return new Date() >= this.startDate;
  }

  hasEnded(): boolean {
    return new Date() > this.endDate;
  }

  getDurationInDays(): number {
    const diff = this.endDate.getTime() - this.startDate.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  contains(date: Date): boolean {
    return date >= this.startDate && date <= this.endDate;
  }
}
```

---

## Entity Pattern

### Purpose

Objects with a unique identity that persists over time.

### Characteristics

- Has unique identifier
- Has lifecycle
- Can change over time
- Identity-based equality

### Example: User Entity

```typescript
export enum UserRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user',
}

export enum UserStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

export class User {
  private readonly id: string;
  private username: string;
  private email: Email;
  private role: UserRole;
  private status: UserStatus;
  private points: Points;
  private completedChallenges: number;
  private readonly createdAt: string;
  private updatedAt: string;

  constructor(props: UserProps) {
    this.id = props.id || crypto.randomUUID();
    this.username = props.username;
    this.email = props.email;
    this.role = props.role;
    this.status = props.status;
    this.points = props.points || new Points(0);
    this.completedChallenges = props.completedChallenges || 0;
    this.createdAt = props.createdAt || new Date().toISOString();
    this.updatedAt = props.updatedAt || new Date().toISOString();
  }

  // Getters
  getId(): string {
    return this.id;
  }
  getUsername(): string {
    return this.username;
  }
  getEmail(): Email {
    return this.email;
  }
  getRole(): UserRole {
    return this.role;
  }
  getStatus(): UserStatus {
    return this.status;
  }
  getPoints(): Points {
    return this.points;
  }

  // Business methods
  activate(): void {
    this.status = UserStatus.ACTIVE;
    this.touch();
  }

  suspend(reason: string): void {
    this.status = UserStatus.SUSPENDED;
    this.touch();
    // Could publish domain event here
  }

  addPoints(points: Points): void {
    this.points = this.points.add(points);
    this.touch();
  }

  completeChallenge(): void {
    this.completedChallenges++;
    this.touch();
  }

  updateProfile(username: string, bio?: string): void {
    this.username = username;
    this.touch();
  }

  // Query methods
  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  isModerator(): boolean {
    return this.role === UserRole.MODERATOR;
  }

  isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  canParticipateInChallenges(): boolean {
    return this.isActive();
  }

  canPerformAdminActions(): boolean {
    return this.isAdmin() || this.isModerator();
  }

  hasEnoughPoints(required: Points): boolean {
    return this.points.isGreaterThan(required) || this.points.equals(required);
  }

  // Validation
  validate(): ValidationResult {
    const errors: string[] = [];

    if (!this.username || this.username.length < 3) {
      errors.push('Username must be at least 3 characters');
    }

    if (!this.email) {
      errors.push('Email is required');
    }

    if (!Object.values(UserRole).includes(this.role)) {
      errors.push('Invalid user role');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  // Utility
  private touch(): void {
    this.updatedAt = new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      email: this.email.toString(),
      role: this.role,
      status: this.status,
      points: this.points.getValue(),
      completedChallenges: this.completedChallenges,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  equals(other: User): boolean {
    return this.id === other.id;
  }
}

interface UserProps {
  id?: string;
  username: string;
  email: Email;
  role: UserRole;
  status: UserStatus;
  points?: Points;
  completedChallenges?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
}
```

---

## Domain Service Pattern

### Purpose

Business logic that doesn't naturally fit in a single entity or value object.

### When to Use

- Logic spans multiple entities
- Complex calculations
- External integrations (in domain terms)

### Example: Challenge Evaluation Service

```typescript
export class ChallengeEvaluationService {
  evaluateCompletion(user: User, challenge: Challenge, submission: Submission): EvaluationResult {
    // Check prerequisites
    if (!user.canParticipateInChallenges()) {
      throw new Error('User cannot participate in challenges');
    }

    if (!challenge.isActive()) {
      throw new Error('Challenge is not active');
    }

    // Calculate points with difficulty multiplier
    const basePoints = challenge.getPoints();
    const multiplier = challenge.getDifficulty().getPointsMultiplier();
    const pointsToAward = basePoints.multiply(multiplier);

    // Check for bonus conditions
    const bonusPoints = this.calculateBonus(user, challenge, submission);
    const totalPoints = pointsToAward.add(bonusPoints);

    return new EvaluationResult(totalPoints, true, 'Challenge completed successfully');
  }

  private calculateBonus(user: User, challenge: Challenge, submission: Submission): Points {
    let bonus = 0;

    // Early completion bonus
    if (submission.isSubmittedEarly()) {
      bonus += 50;
    }

    // First completion bonus
    if (challenge.getCompletionCount() === 0) {
      bonus += 100;
    }

    return new Points(bonus);
  }
}

export class EvaluationResult {
  constructor(
    public readonly pointsAwarded: Points,
    public readonly passed: boolean,
    public readonly feedback: string
  ) {}
}
```

---

## Event-Driven Pattern

### Purpose

Decouple components and enable reactive behavior.

### Event Bus Implementation

```typescript
type EventHandler = (event: DomainEvent) => void | Promise<void>;

export class EventBus {
  private handlers: Map<string, EventHandler[]> = new Map();

  subscribe(eventType: string, handler: EventHandler): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler);
  }

  async publish(event: DomainEvent): Promise<void> {
    const handlers = this.handlers.get(event.eventType) || [];
    const allHandlers = this.handlers.get('*') || [];

    for (const handler of [...handlers, ...allHandlers]) {
      try {
        await handler(event);
      } catch (error) {
        console.error(`Error handling event ${event.eventType}:`, error);
      }
    }
  }

  unsubscribe(eventType: string, handler: EventHandler): void {
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }
}

export interface DomainEvent {
  eventType: string;
  timestamp: string;
  [key: string]: any;
}
```

### Domain Events

```typescript
// Event definitions
export interface UserCreatedEvent extends DomainEvent {
  eventType: 'UserCreated';
  userId: string;
  email: string;
  role: UserRole;
}

export interface ChallengeCompletedEvent extends DomainEvent {
  eventType: 'ChallengeCompleted';
  userId: string;
  challengeId: string;
  pointsAwarded: number;
}

// Publishing events
export class CreateUserUseCase {
  async execute(request: CreateUserRequest): Promise<Result<User>> {
    const user = new User(/* ... */);
    await this.userRepository.save(user);

    // Publish event
    this.eventBus.publish({
      eventType: 'UserCreated',
      userId: user.getId(),
      email: user.getEmail().toString(),
      role: user.getRole(),
      timestamp: new Date().toISOString(),
    });

    return Result.ok(user);
  }
}

// Subscribing to events
eventBus.subscribe('UserCreated', async (event: UserCreatedEvent) => {
  console.log('New user created:', event.userId);
  // Send welcome email
  await emailService.sendWelcomeEmail(event.email);
});

eventBus.subscribe('ChallengeCompleted', async (event: ChallengeCompletedEvent) => {
  // Update leaderboard
  await leaderboardService.updateRankings();
});
```

---

## Facade Pattern

### Purpose

Provide a simplified interface to a complex subsystem.

### ApplicationService Facade

```typescript
export class ApplicationService {
  constructor(private container: Container) {}

  // User operations
  async getAllUsers(filters?: UserFilters): Promise<Result<User[]>> {
    const useCase = this.container.resolve('GetAllUsersUseCase');
    return useCase.execute(filters);
  }

  async createUser(data: CreateUserRequest): Promise<Result<User>> {
    const useCase = this.container.resolve('CreateUserUseCase');
    return useCase.execute(data);
  }

  async updateUser(id: string, updates: UpdateUserRequest): Promise<Result<User>> {
    const useCase = this.container.resolve('UpdateUserUseCase');
    return useCase.execute({ id, ...updates });
  }

  // Challenge operations
  async completeChallenge(userId: string, challengeId: string): Promise<Result<CompletionData>> {
    const useCase = this.container.resolve('CompleteChallengeUseCase');
    return useCase.execute({ userId, challengeId });
  }

  // ... more operations
}

// Singleton export
const applicationService = new ApplicationService(container);
export default applicationService;
```

---

## Dependency Injection

### Container Implementation

```typescript
export class Container {
  private services: Map<string, any> = new Map();
  private singletons: Map<string, any> = new Map();

  register(name: string, factory: () => any): void {
    this.services.set(name, factory);
  }

  registerSingleton(name: string, instance: any): void {
    this.singletons.set(name, instance);
  }

  resolve<T>(name: string): T {
    // Check singletons first
    if (this.singletons.has(name)) {
      return this.singletons.get(name);
    }

    // Create from factory
    const factory = this.services.get(name);
    if (!factory) {
      throw new Error(`Service ${name} not found in container`);
    }

    return factory();
  }
}

// Setup
const container = new Container();

// Register singletons
container.registerSingleton('ApiClient', new ApiClient());
container.registerSingleton('EventBus', new EventBus());

// Register repositories
container.register('UserRepository', () => new ApiUserRepository(container.resolve('ApiClient')));

// Register use cases
container.register(
  'CreateUserUseCase',
  () => new CreateUserUseCase(container.resolve('UserRepository'), container.resolve('EventBus'))
);

export default container;
```

---

## React Patterns

### Custom Hooks

```typescript
// Data fetching hook
export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await applicationService.getAllUsers();
      if (result.success) {
        setUsers(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return { users, loading, error, reload: loadUsers };
};
```

### Compound Components

```typescript
// Card compound component
export const Card = ({ children }: { children: React.ReactNode }) => {
  return <div className="card">{children}</div>;
};

Card.Header = ({ children }: { children: React.ReactNode }) => {
  return <div className="card-header">{children}</div>;
};

Card.Body = ({ children }: { children: React.ReactNode }) => {
  return <div className="card-body">{children}</div>;
};

Card.Footer = ({ children }: { children: React.ReactNode }) => {
  return <div className="card-footer">{children}</div>;
};

// Usage
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Actions</Card.Footer>
</Card>
```

### Render Props

```typescript
interface DataLoaderProps<T> {
  load: () => Promise<T>;
  children: (data: T, loading: boolean, error: string | null) => React.ReactNode;
}

export const DataLoader = <T,>({ load, children }: DataLoaderProps<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    load()
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [load]);

  return <>{children(data, loading, error)}</>;
};

// Usage
<DataLoader load={loadUsers}>
  {(users, loading, error) => (
    loading ? <Loading /> : <UserList users={users} />
  )}
</DataLoader>
```

---

## Summary

These patterns form the foundation of our architecture. Use them consistently to maintain code quality and team velocity.

For more examples, see:

- [DDD_BEFORE_AFTER.md](../DDD_BEFORE_AFTER.md)
- [DDD_IMPLEMENTATION_GUIDE.md](../DDD_IMPLEMENTATION_GUIDE.md)

---

**Version**: 1.0  
**Last Updated**: October 2025
