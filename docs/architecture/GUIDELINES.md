# ESDC Architecture Guidelines

**Status**: Mandatory  
**Enforcement Level**: Strict  
**Version**: 1.0

---

## Purpose

This document provides **strict guidelines** that all developers must follow when working on the ESDC Frontend. These guidelines ensure consistency, maintainability, and adherence to our Domain-Driven Design architecture.

---

## Table of Contents

1. [Layer Responsibilities](#layer-responsibilities)
2. [Dependency Rules](#dependency-rules)
3. [Coding Rules](#coding-rules)
4. [Component Guidelines](#component-guidelines)
5. [State Management](#state-management)
6. [Error Handling](#error-handling)
7. [Testing Requirements](#testing-requirements)
8. [Code Review Checklist](#code-review-checklist)

---

## Layer Responsibilities

### Domain Layer - MUST

✅ **MUST** contain all business logic  
✅ **MUST** have no external dependencies  
✅ **MUST** validate domain rules  
✅ **MUST** use value objects for domain concepts  
✅ **MUST** publish domain events for significant changes

### Domain Layer - MUST NOT

❌ **MUST NOT** depend on any other layer  
❌ **MUST NOT** import React or UI libraries  
❌ **MUST NOT** make API calls  
❌ **MUST NOT** access localStorage/sessionStorage  
❌ **MUST NOT** have framework-specific code

### Application Layer - MUST

✅ **MUST** orchestrate use cases  
✅ **MUST** coordinate domain objects  
✅ **MUST** use dependency injection  
✅ **MUST** handle application-level transactions  
✅ **MUST** return structured results

### Application Layer - MUST NOT

❌ **MUST NOT** contain business logic  
❌ **MUST NOT** import UI components  
❌ **MUST NOT** directly access infrastructure  
❌ **MUST NOT** have UI concerns

### Infrastructure Layer - MUST

✅ **MUST** implement repository interfaces  
✅ **MUST** handle all external I/O  
✅ **MUST** transform between domain and DTOs  
✅ **MUST** manage API communication  
✅ **MUST** handle network errors

### Infrastructure Layer - MUST NOT

❌ **MUST NOT** contain business logic  
❌ **MUST NOT** be accessed directly from UI  
❌ **MUST NOT** expose implementation details

### Presentation Layer - MUST

✅ **MUST** only use ApplicationService  
✅ **MUST** handle UI state only  
✅ **MUST** display data  
✅ **MUST** handle user interactions  
✅ **MUST** show loading/error states

### Presentation Layer - MUST NOT

❌ **MUST NOT** contain business logic  
❌ **MUST NOT** access repositories directly  
❌ **MUST NOT** access infrastructure directly  
❌ **MUST NOT** import domain services  
❌ **MUST NOT** make direct API calls

---

## Dependency Rules

### Rule 1: One-Way Dependencies

Dependencies must flow inward:

```
Presentation → Application → Domain ← Infrastructure
```

**Example - Correct**:

```typescript
// ✅ Component importing application service
import applicationService from '@/application/ApplicationService';
```

**Example - Violation**:

```typescript
// ❌ Domain importing infrastructure
import { apiClient } from '@/infrastructure/api';
```

### Rule 2: No Circular Dependencies

Never create circular dependencies between modules.

**Example - Violation**:

```typescript
// ❌ File A imports B, B imports A
// A.ts
import { B } from './B';

// B.ts
import { A } from './A';
```

### Rule 3: Use Path Aliases

Always use path aliases, never relative paths more than one level deep.

**Example - Correct**:

```typescript
// ✅ Using path alias
import { User } from '@/domain/entities/User';
import applicationService from '@/application/ApplicationService';
```

**Example - Violation**:

```typescript
// ❌ Deep relative path
import { User } from '../../../domain/entities/User';
```

---

## Coding Rules

### Rule 1: Single Responsibility

Each class/function should have one reason to change.

**Example - Violation**:

```typescript
// ❌ Too many responsibilities
class UserComponent {
  fetchUsers() {}
  validateUser() {}
  calculatePoints() {}
  sendEmail() {}
}
```

**Example - Correct**:

```typescript
// ✅ Single responsibility
class UserList {
  // Only responsible for displaying users
  render() {}
}
```

### Rule 2: Type Everything

All functions, variables, and parameters must have explicit types.

**Example - Violation**:

```typescript
// ❌ No types
const handleSubmit = (data) => {
  return data.username;
};
```

**Example - Correct**:

```typescript
// ✅ Explicit types
const handleSubmit = (data: UserFormData): string => {
  return data.username;
};
```

### Rule 3: No Magic Numbers/Strings

Use named constants for all magic values.

**Example - Violation**:

```typescript
// ❌ Magic numbers
if (user.points > 1000) {
  // What does 1000 mean?
}
```

**Example - Correct**:

```typescript
// ✅ Named constant
const EXPERT_THRESHOLD = 1000;
if (user.points > EXPERT_THRESHOLD) {
  // Clear meaning
}
```

### Rule 4: Meaningful Names

Use descriptive names that reveal intent.

**Example - Violation**:

```typescript
// ❌ Unclear names
const x = await f(id);
const arr = x.map((i) => i.n);
```

**Example - Correct**:

```typescript
// ✅ Clear names
const user = await getUserById(id);
const usernames = users.map((user) => user.username);
```

### Rule 5: Pure Functions Preferred

Favor pure functions without side effects.

**Example - Correct**:

```typescript
// ✅ Pure function
const calculateTotal = (items: Item[]): number => {
  return items.reduce((sum, item) => sum + item.price, 0);
};
```

---

## Component Guidelines

### Rule 1: Small Components

Components should be under 200 lines. Extract logic to hooks or services.

### Rule 2: Single Purpose

Each component should do one thing well.

**Example - Violation**:

```typescript
// ❌ Component doing too much
const Dashboard = () => {
  // Fetches users, challenges, projects
  // Renders complex UI
  // Handles form submission
  // 500+ lines
};
```

**Example - Correct**:

```typescript
// ✅ Focused components
const Dashboard = () => {
  return (
    <>
      <UserStats />
      <ChallengeList />
      <ProjectGrid />
    </>
  );
};
```

### Rule 3: Custom Hooks for Logic

Extract complex logic to custom hooks.

**Example - Correct**:

```typescript
// ✅ Hook for data fetching
const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const result = await applicationService.getAllUsers();
    setUsers(result.data);
    setLoading(false);
  };

  return { users, loading, reload: loadUsers };
};
```

### Rule 4: Props Interface

Always define a TypeScript interface for props.

**Example - Correct**:

```typescript
// ✅ Props interface
interface UserCardProps {
  user: User;
  onEdit: (userId: string) => void;
  showDetails?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit, showDetails = false }) => {
  // Component logic
};
```

### Rule 5: No Inline Styles

Use CSS classes or Tailwind, not inline styles.

**Example - Violation**:

```typescript
// ❌ Inline styles
<div style={{ color: 'red', fontSize: '16px' }}>Text</div>
```

**Example - Correct**:

```typescript
// ✅ CSS classes
<div className="text-red-500 text-base">Text</div>
```

---

## State Management

### Rule 1: Minimal Local State

Only store what's necessary in component state.

### Rule 2: Server State with TanStack Query

Use TanStack Query for server state, not useState.

**Example - Correct**:

```typescript
// ✅ TanStack Query for server state
const { data: users, isLoading } = useQuery({
  queryKey: ['users'],
  queryFn: () => applicationService.getAllUsers(),
});
```

### Rule 3: Global State in Context

Use React Context for shared UI state.

**Example - Correct**:

```typescript
// ✅ Context for theme
const { theme, toggleTheme } = useTheme();
```

### Rule 4: No Prop Drilling

Don't pass props through multiple levels. Use context or composition.

---

## Error Handling

### Rule 1: Always Handle Errors

Every async operation must handle errors.

**Example - Violation**:

```typescript
// ❌ No error handling
const loadUsers = async () => {
  const users = await applicationService.getAllUsers();
  setUsers(users.data);
};
```

**Example - Correct**:

```typescript
// ✅ Proper error handling
const loadUsers = async () => {
  try {
    const result = await applicationService.getAllUsers();
    if (result.success) {
      setUsers(result.data);
    } else {
      setError(result.error);
    }
  } catch (error) {
    setError('Failed to load users');
    console.error(error);
  }
};
```

### Rule 2: User-Friendly Messages

Show helpful error messages to users.

**Example - Correct**:

```typescript
// ✅ User-friendly error
if (!result.success) {
  toast.error(`Unable to create user: ${result.error}`);
}
```

### Rule 3: Log Errors

Always log errors for debugging.

```typescript
// ✅ Error logging
catch (error) {
  console.error('Error loading users:', error);
  // Optional: Send to error tracking service
}
```

---

## Testing Requirements

### Rule 1: Unit Tests for Domain

All domain entities and services MUST have unit tests.

**Required Coverage**: 80%+

```typescript
// ✅ Unit test
describe('User', () => {
  it('should activate user', () => {
    const user = new User({ status: UserStatus.PENDING });
    user.activate();
    expect(user.isActive()).toBe(true);
  });
});
```

### Rule 2: Integration Tests for Use Cases

Use cases should have integration tests.

```typescript
// ✅ Integration test
describe('CreateUserUseCase', () => {
  it('should create user with valid data', async () => {
    const useCase = new CreateUserUseCase(mockRepo);
    const result = await useCase.execute(validData);
    expect(result.success).toBe(true);
  });
});
```

### Rule 3: Component Tests

Components should test user interactions and rendering.

```typescript
// ✅ Component test
describe('UserList', () => {
  it('displays users', async () => {
    render(<UserList />);
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });
});
```

### Rule 4: Test Names

Use descriptive test names that explain what's being tested.

**Example - Correct**:

```typescript
// ✅ Descriptive test name
it('should throw error when email format is invalid', () => {
  expect(() => new Email('invalid')).toThrow();
});
```

---

## Code Review Checklist

Before submitting a PR, verify:

### Architecture

- [ ] No layer violations
- [ ] Dependencies flow correctly
- [ ] ApplicationService used from UI
- [ ] Business logic in domain layer
- [ ] No direct infrastructure access

### Code Quality

- [ ] All functions have types
- [ ] No magic numbers/strings
- [ ] Meaningful variable names
- [ ] Functions under 30 lines
- [ ] Components under 200 lines
- [ ] No commented-out code

### Testing

- [ ] Unit tests for domain logic
- [ ] Integration tests for use cases
- [ ] Component tests for UI
- [ ] All tests passing
- [ ] Coverage meets threshold

### Error Handling

- [ ] All async operations handle errors
- [ ] User-friendly error messages
- [ ] Errors logged appropriately

### Performance

- [ ] No unnecessary re-renders
- [ ] Lazy loading where appropriate
- [ ] Memoization for expensive operations
- [ ] Images optimized

### Accessibility

- [ ] Semantic HTML
- [ ] ARIA labels where needed
- [ ] Keyboard navigation works
- [ ] Good color contrast

### Documentation

- [ ] Complex logic explained
- [ ] JSDoc for public APIs
- [ ] README updated if needed

---

## Consequences of Violations

### Minor Violations

- PR comments requiring changes
- Required refactoring before merge

### Major Violations

- PR rejection
- Architecture review required
- Team discussion

### Examples of Major Violations

- Direct API calls from components
- Business logic in UI
- Layer violations
- No error handling
- Missing tests

---

## Getting Help

If you're unsure about:

- Architecture decisions → Check [ARCHITECTURE.md](../../ARCHITECTURE.md)
- How to implement something → Check [DDD guides](../DDD_IMPLEMENTATION_GUIDE.md)
- Specific patterns → Ask in team chat
- Code review feedback → Discuss with reviewer

---

**Remember**: These guidelines exist to maintain code quality and team velocity. Following them makes everyone's job easier!

---

**Version**: 1.0  
**Last Updated**: October 2025  
**Maintained By**: ESDC Development Team
