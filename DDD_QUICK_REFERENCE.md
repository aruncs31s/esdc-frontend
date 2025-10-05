# DDD Quick Reference Card

## 🚀 Quick Start

### Import ApplicationService
```javascript
import applicationService from '@/application/ApplicationService';
```

## 📋 Common Operations

### User Operations
```javascript
// Get all users
const result = await applicationService.getAllUsers();
const users = result.data;

// Create user
const result = await applicationService.createUser({
  username: 'johndoe',
  email: 'john@example.com',
  role: 'user',
  status: 'active'
});

// Update user
await applicationService.updateUser(userId, { bio: 'New bio' });

// Delete user
await applicationService.deleteUser(userId);

// Get user by ID
const user = await applicationService.getUserById(userId);
```

### Challenge Operations
```javascript
// Get all challenges
const challenges = await applicationService.getAllChallenges();

// Submit challenge
await applicationService.submitChallenge(userId, challengeId, {
  solution: 'My solution code',
  githubUrl: 'https://github.com/...'
});

// Complete challenge (awards points)
const result = await applicationService.completeChallenge(userId, challengeId);
console.log(`Earned ${result.data.pointsAwarded} points!`);

// Create challenge
await applicationService.createChallenge({
  title: 'LED Blink Challenge',
  description: 'Create a blinking LED',
  difficulty: 'beginner',
  points: 100
});
```

### Project Operations
```javascript
// Get all projects
const projects = await applicationService.getAllProjects();

// Get user's projects
const userProjects = await applicationService.getUserProjects(userId);

// Create project
await applicationService.createProject(userId, {
  title: 'My Project',
  description: 'Project description',
  githubUrl: 'https://github.com/...'
});

// Delete project
await applicationService.deleteProject(projectId);
```

### Event Operations
```javascript
// Get all events
const events = await applicationService.getAllEvents();

// Get upcoming events
const upcoming = await applicationService.getUpcomingEvents();

// Create event
await applicationService.createEvent({
  title: 'Workshop',
  description: 'Arduino workshop',
  startDate: '2025-01-15',
  endDate: '2025-01-16',
  maxParticipants: 50
});
```

### Leaderboard Operations
```javascript
// Get top 10 users
const leaders = await applicationService.getTopUsers(10);

// Get user's rank
const rankInfo = await applicationService.getUserRank(userId);
console.log(`Rank: ${rankInfo.rank}/${rankInfo.totalUsers}`);
```

### Admin Stats
```javascript
const stats = await applicationService.getAdminStats();
// Returns: { totalUsers, totalChallenges, totalProjects, activeUsers }
```

## 🎯 Domain Entities

### User Entity
```javascript
import { User, UserRole, UserStatus } from '@/domain';

const user = new User({ username: 'john', email: 'john@example.com' });

// Business methods
user.activate();
user.suspend('Violated terms');
user.addPoints(new Points(50));
user.completeChallenge();

// Query methods
user.isAdmin();
user.isActive();
user.canParticipateInChallenges();
user.canPerformAdminActions();

// Validation
const { valid, errors } = user.validate();
```

### Challenge Entity
```javascript
import { Challenge, ChallengeStatus } from '@/domain';

const challenge = new Challenge({
  title: 'LED Challenge',
  difficulty: 'beginner',
  points: 100
});

// Business methods
challenge.publish();
challenge.archive();
challenge.complete();

// Query methods
challenge.isActive();
challenge.isExpired();
challenge.canAcceptSubmission();
challenge.getAwardPoints(); // Returns Points with multiplier
```

### Project Entity
```javascript
import { Project, ProjectStatus } from '@/domain';

const project = new Project({
  title: 'My Project',
  userId: 1
});

// Business methods
project.start();
project.complete();
project.addLike();
project.incrementViews();

// Query methods
project.isCompleted();
project.canBeEditedBy(user);
```

### Event Entity
```javascript
import { Event, EventStatus } from '@/domain';

const event = new Event({
  title: 'Workshop',
  startDate: '2025-01-15',
  endDate: '2025-01-16'
});

// Business methods
event.publish();
event.start();
event.complete();
event.registerParticipant();

// Query methods
event.isActive();
event.isFull();
event.canAcceptRegistrations();
```

## 💎 Value Objects

### Email
```javascript
import { Email } from '@/domain';

const email = new Email('user@example.com');
console.log(email.value); // 'user@example.com'
console.log(email.toString()); // 'user@example.com'

// Validation is automatic
try {
  new Email('invalid-email'); // Throws error
} catch (e) {
  console.error(e.message);
}
```

### Points
```javascript
import { Points } from '@/domain';

const points = new Points(100);
const morePoints = points.add(new Points(50)); // 150
const lessPoints = points.subtract(new Points(30)); // 70
const doubled = points.multiply(2); // 200

// Comparison
points.isGreaterThan(new Points(50)); // true
points.equals(new Points(100)); // true
```

### Difficulty
```javascript
import { Difficulty, DifficultyLevel } from '@/domain';

const difficulty = Difficulty.beginner();
// or
const difficulty = new Difficulty('intermediate');

difficulty.getPointsMultiplier(); // 1.5 for intermediate
difficulty.getDisplayName(); // 'Intermediate'
difficulty.isAdvanced(); // false
```

### DateRange
```javascript
import { DateRange } from '@/domain';

const range = new DateRange('2025-01-01', '2025-12-31');

range.isActive(); // true/false
range.hasStarted(); // true/false
range.hasEnded(); // true/false
range.getDurationInDays(); // 365
```

## 🎪 Domain Events

### Subscribe to Events
```javascript
import { eventBus } from '@/domain';

eventBus.subscribe('UserCreated', async (event) => {
  console.log('New user:', event.userId, event.email);
});

eventBus.subscribe('ChallengeCompleted', async (event) => {
  console.log(`User ${event.userId} earned ${event.points} points!`);
});

eventBus.subscribe('PointsAwarded', async (event) => {
  console.log(`Points awarded: ${event.points} - ${event.reason}`);
});
```

### Available Events
- `UserCreated`
- `UserActivated`
- `UserSuspended`
- `ChallengeCompleted`
- `ChallengePublished`
- `ProjectCreated`
- `ProjectCompleted`
- `EventPublished`
- `EventRegistration`
- `PointsAwarded`

## 🔧 Error Handling

### Standard Pattern
```javascript
const result = await applicationService.createUser(userData);

if (result.success) {
  // Success
  console.log('Created:', result.data);
  alert(result.message);
} else {
  // Error
  console.error('Error:', result.error);
  alert(`Failed: ${result.error}`);
}
```

### Try-Catch Pattern
```javascript
try {
  const user = await applicationService.getUserById(userId);
  console.log(user);
} catch (error) {
  console.error('Failed to get user:', error);
}
```

## 📦 Import Patterns

### From Application Layer
```javascript
import applicationService from '@/application/ApplicationService';
import container from '@/application/Container';
```

### From Domain Layer
```javascript
import { User, UserRole, UserStatus } from '@/domain';
import { Challenge, ChallengeStatus } from '@/domain';
import { Project, ProjectStatus } from '@/domain';
import { Event, EventStatus } from '@/domain';
import { Email, Points, Difficulty, DateRange } from '@/domain';
import { eventBus } from '@/domain';
```

### From Infrastructure Layer
```javascript
import { userRepository, challengeRepository } from '@/infrastructure';
import apiClient from '@/infrastructure/api/ApiClient';
```

## 🎨 Component Example

```javascript
import { useState, useEffect } from 'react';
import applicationService from '@/application/ApplicationService';

const MyComponent = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const result = await applicationService.getAllUsers();
      setUsers(result.data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData) => {
    const result = await applicationService.createUser(userData);
    if (result.success) {
      alert('User created successfully!');
      loadUsers(); // Reload
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {users.map(user => (
            <li key={user.id}>{user.username}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

## 📝 Testing Examples

### Test Use Case
```javascript
import { CreateUserUseCase } from '@/application';

test('should create user', async () => {
  const mockRepo = { save: jest.fn(), findByEmail: jest.fn() };
  const useCase = new CreateUserUseCase(mockRepo, mockService);
  
  const result = await useCase.execute({ username: 'test' });
  
  expect(result.success).toBe(true);
  expect(mockRepo.save).toHaveBeenCalled();
});
```

### Test Entity
```javascript
import { User, UserStatus } from '@/domain';

test('user can be activated', () => {
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

## 🔍 Debugging Tips

### Log Entity State
```javascript
const user = await applicationService.getUserById(userId);
console.log('User:', user.toJSON());
console.log('Is Admin:', user.isAdmin());
console.log('Can Participate:', user.canParticipateInChallenges());
```

### Log Application Result
```javascript
const result = await applicationService.createUser(userData);
console.log('Success:', result.success);
console.log('Data:', result.data);
console.log('Error:', result.error);
console.log('Message:', result.message);
```

### Monitor Events
```javascript
eventBus.subscribe('*', (event) => {
  console.log('Event:', event.eventType, event);
});
```

## 📖 Documentation Links

- **Full Guide**: `DDD_IMPLEMENTATION_GUIDE.md`
- **Summary**: `DDD_IMPLEMENTATION_SUMMARY.md`
- **Analysis**: `DDD_ANALYSIS.md`
- **Example Component**: `src/pages/AdminPanel-DDD.jsx`

---

**Remember**: Always use `applicationService` from UI components. Never access repositories directly from UI!
