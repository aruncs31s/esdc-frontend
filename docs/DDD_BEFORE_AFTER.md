# Before & After: DDD Implementation Examples

## Example 1: Creating a User

### ❌ Before (Without DDD)
```javascript
// Component: AdminPanel.jsx
import { adminAPI } from '../services/api';

const AdminPanel = () => {
  const handleCreateUser = async (userData) => {
    try {
      // Direct API call with primitive values
      const response = await adminAPI.createUser({
        username: userData.username,
        email: userData.email, // Just a string
        role: userData.role,
        status: 'active',
        github_username: userData.githubUsername
      });
      
      alert('User created!');
      loadUsers(); // Reload data
    } catch (error) {
      alert('Failed to create user');
    }
  };
};
```

**Problems:**
- Business logic in UI component
- No validation before API call
- Primitive types (email is just a string)
- No domain events
- Direct API dependency

### ✅ After (With DDD)
```javascript
// Component: AdminPanel.jsx
import applicationService from '@/application/ApplicationService';

const AdminPanel = () => {
  const handleCreateUser = async (userData) => {
    // Use application service
    const result = await applicationService.createUser({
      username: userData.username,
      email: userData.email, // Converted to Email value object internally
      role: userData.role,
      status: 'active',
      githubUsername: userData.githubUsername
    });
    
    if (result.success) {
      alert(result.message); // 'User created successfully'
      loadUsers(); // Reload data
    } else {
      alert(`Error: ${result.error}`); // Detailed error message
    }
  };
};
```

**Benefits:**
- Clean separation of concerns
- Validation handled in domain layer
- Email value object validates format
- Domain events published automatically
- No direct API dependency
- Proper error handling

---

## Example 2: Completing a Challenge

### ❌ Before (Without DDD)
```javascript
// Component: ChallengesPage.jsx
import { userAPI, adminAPI } from '../services/api';

const ChallengesPage = () => {
  const handleCompleteChallenge = async (userId, challengeId) => {
    try {
      // Get challenge
      const challenge = await adminAPI.getChallenge(challengeId);
      
      // Get user
      const user = await adminAPI.getUser(userId);
      
      // Manual points calculation
      let points = challenge.points;
      if (challenge.difficulty === 'intermediate') points *= 1.5;
      if (challenge.difficulty === 'advanced') points *= 2;
      
      // Update user points manually
      user.points = user.points + points;
      user.completed_challenges = user.completed_challenges + 1;
      
      // Save user
      await adminAPI.updateUser(userId, user);
      
      // No events, no notification
      alert(`Challenge completed! You earned ${points} points`);
    } catch (error) {
      alert('Failed to complete challenge');
    }
  };
};
```

**Problems:**
- Business logic scattered in component
- Manual points calculation
- Multiple API calls
- No transaction handling
- No domain events
- Hardcoded multipliers

### ✅ After (With DDD)
```javascript
// Component: ChallengesPage.jsx
import applicationService from '@/application/ApplicationService';

const ChallengesPage = () => {
  const handleCompleteChallenge = async (userId, challengeId) => {
    const result = await applicationService.completeChallenge(
      userId, 
      challengeId
    );
    
    if (result.success) {
      alert(result.message); // "Challenge completed! You earned 150 points!"
      console.log('Points awarded:', result.data.pointsAwarded);
      console.log('Updated user:', result.data.user);
    } else {
      alert(`Error: ${result.error}`);
    }
  };
};
```

**Benefits:**
- Single method call
- Business logic in ChallengeEvaluationService
- Automatic points calculation with difficulty multiplier
- Domain events published (ChallengeCompleted, PointsAwarded)
- Leaderboard updated automatically via event handlers
- Proper error handling
- Clean and maintainable

---

## Example 3: User Validation

### ❌ Before (Without DDD)
```javascript
// Component: RegisterForm.jsx
const validateForm = (formData) => {
  // Validation in component
  if (formData.username.length < 3) {
    setError('Username must be at least 3 characters');
    return false;
  }
  
  // Email regex in component
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    setError('Invalid email format');
    return false;
  }
  
  // Role validation in component
  if (!['user', 'admin', 'moderator'].includes(formData.role)) {
    setError('Invalid role');
    return false;
  }
  
  return true;
};

const handleSubmit = async (formData) => {
  if (!validateForm(formData)) {
    return;
  }
  
  // Then call API...
};
```

**Problems:**
- Validation logic in UI component
- Duplicated across components
- No reusable validation
- Business rules in wrong layer

### ✅ After (With DDD)
```javascript
// Component: RegisterForm.jsx
import applicationService from '@/application/ApplicationService';

const handleSubmit = async (formData) => {
  // Validation happens automatically in domain layer
  const result = await applicationService.createUser(formData);
  
  if (result.success) {
    alert('User created successfully!');
  } else {
    // Get detailed validation errors
    alert(`Validation failed: ${result.error}`);
  }
};

// Domain Layer: User.js
export class User {
  validate() {
    const errors = [];
    
    if (!this.username || this.username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    }
    
    try {
      this.email.validate(); // Email value object validates itself
    } catch (error) {
      errors.push(error.message);
    }
    
    if (!Object.values(UserRole).includes(this.role)) {
      errors.push('Invalid user role');
    }
    
    return { valid: errors.length === 0, errors };
  }
}
```

**Benefits:**
- Validation in domain layer (where it belongs)
- Reusable across all use cases
- Email value object validates automatically
- Centralized business rules
- Easy to test
- No validation logic in UI

---

## Example 4: Filtering and Sorting Users

### ❌ Before (Without DDD)
```javascript
// Component: UsersPage.jsx
const [users, setUsers] = useState([]);
const [searchTerm, setSearchTerm] = useState('');
const [sortBy, setSortBy] = useState('name');

useEffect(() => {
  // Manual filtering and sorting in component
  let result = [...users];
  
  // Search filter
  if (searchTerm) {
    result = result.filter(user => 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  // Sort
  result.sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return (a.name || '').localeCompare(b.name || '');
      case 'points':
        return (b.points || 0) - (a.points || 0);
      case 'challenges':
        return (b.completedChallenges || 0) - (a.completedChallenges || 0);
      default:
        return 0;
    }
  });
  
  setFilteredUsers(result);
}, [searchTerm, sortBy, users]);
```

**Problems:**
- Business logic in component
- Manual filtering and sorting
- Repeated across components
- Hard to test

### ✅ After (With DDD)
```javascript
// Component: UsersPage.jsx
const [users, setUsers] = useState([]);

useEffect(() => {
  loadUsers();
}, []);

const loadUsers = async () => {
  // Repository handles filtering
  const result = await applicationService.getAllUsers({
    search: searchTerm,
    sortBy: sortBy
  });
  setUsers(result.data);
};

// Use domain entity methods
const filteredUsers = users.filter(user => {
  if (typeof user.getDisplayName === 'function') {
    return user.getDisplayName()
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  }
  return true;
});
```

**Benefits:**
- Filtering can be moved to repository or domain service
- Use domain entity methods
- Clean component
- Reusable logic

---

## Example 5: Points Calculation

### ❌ Before (Without DDD)
```javascript
// Component: scattered across multiple files
const calculatePoints = (basePoints, difficulty) => {
  let points = basePoints;
  if (difficulty === 'beginner') points *= 1;
  if (difficulty === 'intermediate') points *= 1.5;
  if (difficulty === 'advanced') points *= 2;
  if (difficulty === 'expert') points *= 3;
  return points;
};

// Usage
const points = calculatePoints(100, 'intermediate'); // 150
user.points = user.points + points; // Just a number
```

**Problems:**
- Business logic scattered
- No type safety
- Hardcoded multipliers
- Points are just numbers
- No validation

### ✅ After (With DDD)
```javascript
// Domain Layer: Difficulty.js (Value Object)
export class Difficulty {
  getPointsMultiplier() {
    switch (this._level) {
      case DifficultyLevel.BEGINNER: return 1;
      case DifficultyLevel.INTERMEDIATE: return 1.5;
      case DifficultyLevel.ADVANCED: return 2;
      case DifficultyLevel.EXPERT: return 3;
      default: return 1;
    }
  }
}

// Domain Layer: Points.js (Value Object)
export class Points {
  add(points) {
    if (!(points instanceof Points)) {
      throw new Error('Can only add Points instance');
    }
    return new Points(this._value + points.value);
  }
  
  multiply(factor) {
    return new Points(this._value * factor);
  }
}

// Domain Layer: Challenge.js (Entity)
export class Challenge {
  getAwardPoints() {
    const multiplier = this.difficulty.getPointsMultiplier();
    return this.points.multiply(multiplier);
  }
}

// Usage
const challenge = new Challenge({
  points: new Points(100),
  difficulty: new Difficulty('intermediate')
});

const awardPoints = challenge.getAwardPoints(); // Points(150)
user.addPoints(awardPoints); // Type-safe
```

**Benefits:**
- Business logic encapsulated in domain
- Type-safe (Points, Difficulty)
- Centralized multiplier logic
- Immutable value objects
- Cannot add invalid points
- Easy to test and maintain

---

## Example 6: Event Registration

### ❌ Before (Without DDD)
```javascript
// Component: EventsPage.jsx
const handleRegister = async (eventId, userId) => {
  try {
    const event = await eventsAPI.getEvent(eventId);
    
    // Manual validation
    if (event.registered_participants >= event.max_participants) {
      alert('Event is full');
      return;
    }
    
    const endDate = new Date(event.end_date);
    if (endDate < new Date()) {
      alert('Event has ended');
      return;
    }
    
    // Manually update
    event.registered_participants++;
    await eventsAPI.updateEvent(eventId, event);
    
    alert('Registered successfully!');
  } catch (error) {
    alert('Registration failed');
  }
};
```

**Problems:**
- Business rules in component
- Manual validation
- No domain events
- Error-prone

### ✅ After (With DDD)
```javascript
// Component: EventsPage.jsx
const handleRegister = async (eventId, userId) => {
  const event = await applicationService.getEventById(eventId);
  
  try {
    // Domain entity handles validation
    event.registerParticipant();
    await applicationService.saveEvent(event);
    
    alert('Registered successfully!');
  } catch (error) {
    alert(error.message); // 'Event is full' or 'Event has ended'
  }
};

// Domain Layer: Event.js (Entity)
export class Event {
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
  
  canAcceptRegistrations() {
    return this.status === EventStatus.PUBLISHED && 
           !this.dateRange.hasEnded() &&
           !this.isFull();
  }
  
  isFull() {
    if (!this.maxParticipants) return false;
    return this.registeredParticipants >= this.maxParticipants;
  }
}
```

**Benefits:**
- Business rules in domain entity
- Self-validating
- Clear error messages
- Easy to test
- Domain events can trigger notifications

---

## Summary: Key Improvements

| Aspect | Before | After |
|--------|--------|-------|
| **Validation** | In components | In domain entities |
| **Business Logic** | Scattered | Encapsulated |
| **Data Types** | Primitives | Value Objects |
| **API Calls** | Direct | Through repositories |
| **Error Handling** | Basic try-catch | Structured results |
| **Events** | None | Domain events |
| **Testing** | Hard (UI tests) | Easy (unit tests) |
| **Maintainability** | Low | High |
| **Type Safety** | None | Value objects |
| **Reusability** | Low | High |

---

## Migration Checklist

- [ ] Replace `import { adminAPI } from '../services/api'` with `import applicationService from '@/application/ApplicationService'`
- [ ] Replace direct API calls with application service methods
- [ ] Move validation logic to domain entities
- [ ] Use value objects (Email, Points, etc.) instead of primitives
- [ ] Remove business logic from components
- [ ] Use domain entity methods (user.isAdmin(), challenge.isActive())
- [ ] Handle results properly (`if (result.success)`)
- [ ] Subscribe to domain events for side effects
- [ ] Test each layer independently

---

**Need Help?** Check [DDD_QUICK_REFERENCE.md](./DDD_QUICK_REFERENCE.md) for more examples!
