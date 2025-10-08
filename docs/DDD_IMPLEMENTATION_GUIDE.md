# Domain-Driven Design Implementation Guide

## Overview
This project now follows Domain-Driven Design (DDD) principles with proper layered architecture.

## Architecture Layers

```
src/
├── domain/              # Domain Layer (Business Logic)
├── application/         # Application Layer (Use Cases)
├── infrastructure/      # Infrastructure Layer (Data Access)
└── presentation/        # Presentation Layer (UI - components, pages)
```

## How to Use

### 1. Basic Usage - Application Service (Recommended for UI)

The `ApplicationService` provides a simple facade for UI components:

```javascript
import applicationService from '@/application/ApplicationService';

// In your component
const MyComponent = () => {
  const handleCreateUser = async (userData) => {
    const result = await applicationService.createUser(userData);
    if (result.success) {
      console.log('User created:', result.data);
    } else {
      console.error('Error:', result.error);
    }
  };

  const loadUsers = async () => {
    const result = await applicationService.getAllUsers();
    return result.data;
  };

  // ... rest of component
};
```

### 2. Available Operations

#### User Operations
```javascript
// Create user
await applicationService.createUser(userData);

// Update user
await applicationService.updateUser(userId, updates);

// Delete user
await applicationService.deleteUser(userId);

// Get all users
await applicationService.getAllUsers(filters);

// Get user by ID
await applicationService.getUserById(userId);
```

#### Challenge Operations
```javascript
// Get all challenges
await applicationService.getAllChallenges(filters);

// Submit challenge
await applicationService.submitChallenge(userId, challengeId, submissionData);

// Complete challenge (awards points)
await applicationService.completeChallenge(userId, challengeId);

// Create challenge
await applicationService.createChallenge(challengeData);

// Delete challenge
await applicationService.deleteChallenge(challengeId);
```

#### Project Operations
```javascript
// Create project
await applicationService.createProject(userId, projectData);

// Get all projects
await applicationService.getAllProjects(filters);

// Get user's projects
await applicationService.getUserProjects(userId);

// Delete project
await applicationService.deleteProject(projectId);
```

#### Event Operations
```javascript
// Get all events
await applicationService.getAllEvents(filters);

// Get upcoming events
await applicationService.getUpcomingEvents();

// Create event
await applicationService.createEvent(eventData);

// Delete event
await applicationService.deleteEvent(eventId);
```

#### Leaderboard Operations
```javascript
// Get top users
await applicationService.getTopUsers(10);

// Get user rank
await applicationService.getUserRank(userId);
```

#### Admin Stats
```javascript
// Get admin statistics
await applicationService.getAdminStats();
```

### 3. Advanced Usage - Direct Repository Access

For more control, you can use repositories directly:

```javascript
import { userRepository } from '@/infrastructure';

const user = await userRepository.findById(userId);
const users = await userRepository.findAll({ role: 'admin' });
```

### 4. Using Domain Entities

Entities encapsulate business logic:

```javascript
import { User, UserRole, UserStatus } from '@/domain';
import { Email } from '@/domain';
import { Points } from '@/domain';

// Create a user with value objects
const user = new User({
  username: 'johndoe',
  email: new Email('john@example.com'),
  role: UserRole.USER,
  status: UserStatus.ACTIVE,
  points: new Points(100)
});

// Use business methods
user.activate();
user.addPoints(new Points(50));
user.completeChallenge();

// Query methods
if (user.isAdmin()) {
  // Do admin stuff
}

if (user.canParticipateInChallenges()) {
  // Allow challenge participation
}

// Validation
const validation = user.validate();
if (!validation.valid) {
  console.error('Validation errors:', validation.errors);
}
```

### 5. Domain Events

Subscribe to domain events for side effects:

```javascript
import { eventBus } from '@/domain';
import { UserCreatedEvent, ChallengeCompletedEvent } from '@/domain';

// Subscribe to user created event
eventBus.subscribe('UserCreated', async (event) => {
  console.log('New user created:', event.userId);
  // Send welcome email, etc.
});

// Subscribe to challenge completed event
eventBus.subscribe('ChallengeCompleted', async (event) => {
  console.log(`User ${event.userId} completed challenge ${event.challengeId}`);
  console.log(`Points awarded: ${event.points}`);
  // Update leaderboard, send notification, etc.
});
```

### 6. Value Objects

Use value objects for domain concepts:

```javascript
import { Email, Points, Difficulty, DateRange } from '@/domain';

// Email value object
const email = new Email('user@example.com');
console.log(email.value); // 'user@example.com'
console.log(email.toString()); // 'user@example.com'

// Points value object
const points = new Points(100);
const newPoints = points.add(new Points(50)); // 150
const lessPoints = points.subtract(new Points(30)); // 70

// Difficulty value object
const difficulty = Difficulty.intermediate();
console.log(difficulty.getPointsMultiplier()); // 1.5

// DateRange value object
const range = new DateRange('2025-01-01', '2025-12-31');
console.log(range.isActive()); // true/false
console.log(range.getDurationInDays()); // 365
```

## Migration Guide

### Updating Existing Components

**Before (Old Way):**
```javascript
import { adminAPI } from '../services/api';

const users = await adminAPI.getUsers();
await adminAPI.createUser(userData);
```

**After (New Way):**
```javascript
import applicationService from '@/application/ApplicationService';

const result = await applicationService.getAllUsers();
const users = result.data;

const createResult = await applicationService.createUser(userData);
if (createResult.success) {
  // Success
}
```

### Benefits of New Architecture

1. **Separation of Concerns**: Business logic is separated from UI and data access
2. **Testability**: Each layer can be tested independently
3. **Maintainability**: Changes in one layer don't affect others
4. **Type Safety**: Domain entities provide clear contracts
5. **Business Logic Encapsulation**: Business rules are in domain entities
6. **Scalability**: Easy to add new features without breaking existing code

## Examples

### Example 1: Creating a User with Validation

```javascript
import applicationService from '@/application/ApplicationService';

const createUser = async (formData) => {
  const result = await applicationService.createUser({
    username: formData.username,
    email: formData.email,
    role: formData.role,
    status: 'active',
    github_username: formData.githubUsername
  });

  if (result.success) {
    alert('User created successfully!');
    return result.data;
  } else {
    alert(`Error: ${result.error}`);
    return null;
  }
};
```

### Example 2: Completing a Challenge

```javascript
import applicationService from '@/application/ApplicationService';

const handleCompleteChallenge = async (userId, challengeId) => {
  const result = await applicationService.completeChallenge(userId, challengeId);
  
  if (result.success) {
    alert(result.message); // "Challenge completed! You earned X points!"
    console.log('Points awarded:', result.data.pointsAwarded);
    console.log('Updated user:', result.data.user);
  } else {
    alert(`Error: ${result.error}`);
  }
};
```

### Example 3: Getting Leaderboard

```javascript
import applicationService from '@/application/ApplicationService';

const Leaderboard = () => {
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    const loadLeaderboard = async () => {
      const leaders = await applicationService.getTopUsers(10);
      setTopUsers(leaders);
    };
    loadLeaderboard();
  }, []);

  return (
    <div>
      {topUsers.map((entry, index) => (
        <div key={entry.user.id}>
          <span>#{entry.rank}</span>
          <span>{entry.user.username}</span>
          <span>{entry.points} points</span>
        </div>
      ))}
    </div>
  );
};
```

## Testing

### Testing Use Cases
```javascript
import { CreateUserUseCase } from '@/application/use-cases/users/CreateUserUseCase';

// Mock repository
const mockRepository = {
  findByEmail: jest.fn(),
  findByUsername: jest.fn(),
  save: jest.fn()
};

// Test
const useCase = new CreateUserUseCase(mockRepository, mockRegistrationService);
const result = await useCase.execute(userData);

expect(result.success).toBe(true);
```

### Testing Entities
```javascript
import { User, UserRole, UserStatus } from '@/domain';

test('User can be activated', () => {
  const user = new User({
    username: 'test',
    email: 'test@example.com',
    status: UserStatus.PENDING
  });

  user.activate();
  
  expect(user.status).toBe(UserStatus.ACTIVE);
  expect(user.isActive()).toBe(true);
});
```

## Best Practices

1. **Always use ApplicationService from UI components** - Don't access repositories directly
2. **Use domain entities for business logic** - Don't put business logic in components
3. **Validate using entity methods** - Call `entity.validate()` before saving
4. **Subscribe to events for side effects** - Use event bus for cross-cutting concerns
5. **Use value objects for domain concepts** - Email, Points, etc.
6. **Keep components thin** - Just UI logic, delegate to application layer
7. **Test at each layer** - Unit test entities, integration test use cases

## Troubleshooting

### Issue: "Service not found in container"
**Solution**: Check that the service is registered in `Container.js`

### Issue: "Email validation error"
**Solution**: Ensure you're passing a valid email string or Email value object

### Issue: "Cannot read property of undefined"
**Solution**: Check that ApplicationService is properly imported and initialized

## Future Enhancements

- [ ] Add CQRS pattern for read/write separation
- [ ] Implement event sourcing for audit trail
- [ ] Add saga pattern for complex workflows
- [ ] Implement specification pattern for complex queries
- [ ] Add DTOs for API responses
