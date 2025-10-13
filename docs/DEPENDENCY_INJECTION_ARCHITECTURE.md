# Dependency Injection & Current Architecture

## 📋 Table of Contents
1. [Overview](#overview)
2. [Architecture Layers](#architecture-layers)
3. [Dependency Injection Container](#dependency-injection-container)
4. [Application Service (Facade Pattern)](#application-service-facade-pattern)
5. [Dependency Flow](#dependency-flow)
6. [Usage Examples](#usage-examples)
7. [Best Practices](#best-practices)
8. [Testing Strategy](#testing-strategy)

---

## 🎯 Overview

The application follows **Domain-Driven Design (DDD)** principles with a **Dependency Injection (DI)** pattern implemented through a custom container. This ensures:

- ✅ **Loose Coupling**: Components depend on interfaces, not implementations
- ✅ **Testability**: Easy to mock dependencies for unit testing
- ✅ **Maintainability**: Single place to manage all dependencies
- ✅ **Flexibility**: Easy to swap implementations
- ✅ **Single Responsibility**: Each layer has clear boundaries

---

## 🏗️ Architecture Layers

```
┌────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│              (React Components & Pages)                     │
│                                                             │
│   - components/                                             │
│   - pages/                                                  │
│   - hooks/                                                  │
└─────────────────────┬──────────────────────────────────────┘
                      │
                      │ Uses
                      ↓
┌────────────────────────────────────────────────────────────┐
│                   Application Layer                         │
│                  (Use Cases & Facade)                       │
│                                                             │
│   ApplicationService (Facade)                               │
│   ├── createUser()                                          │
│   ├── getAllUsers()                                         │
│   ├── createProject()                                       │
│   └── askChatbot()                                          │
│                                                             │
│   Container (Dependency Injection)                          │
│   ├── Repositories                                          │
│   ├── Domain Services                                       │
│   └── Use Cases                                             │
└─────────────────────┬──────────────────────────────────────┘
                      │
          ┌───────────┴───────────┐
          │                       │
          ↓                       ↓
┌──────────────────────┐  ┌──────────────────────┐
│   Domain Layer       │  │ Infrastructure Layer │
│                      │  │                      │
│ Entities:            │  │ Repositories:        │
│ ├── User             │←─┤ ├── UserRepository   │
│ ├── Challenge        │  │ ├── ProjectRepo      │
│ ├── Project          │  │ └── EventRepo        │
│ └── Event            │  │                      │
│                      │  │ API Client:          │
│ Value Objects:       │  │ └── ApiClient        │
│ ├── Email            │  │   (Axios wrapper)    │
│ ├── Points           │  │                      │
│ └── Difficulty       │  └──────────────────────┘
│                      │
│ Domain Services:     │
│ ├── UserRegistration │
│ ├── ChallengeEval    │
│ └── Leaderboard      │
│                      │
│ Domain Events:       │
│ ├── EventBus         │
│ └── DomainEvents     │
└──────────────────────┘
```

---

## 🔧 Dependency Injection Container

### Location
`src/application/Container.ts`

### Purpose
The Container is the **heart of dependency injection** in the application. It:
- Manages the lifecycle of all dependencies
- Ensures singleton instances
- Wires up dependencies between layers
- Provides a central registry of services

### Implementation

```typescript
class Container {
  private services: Map<string, any>;
  private initialized: boolean;

  constructor() {
    this.services = new Map();
    this.initialized = false;
  }

  initialize() {
    // 1. Register Repositories (Infrastructure Layer)
    this.services.set('userRepository', userRepository);
    this.services.set('projectRepository', projectRepository);
    this.services.set('eventRepository', eventRepository);
    this.services.set('chatbotRepository', chatbotRepository);

    // 2. Register Domain Services (Domain Layer)
    const userRegistrationService = new UserRegistrationService(userRepository);
    const leaderboardService = new LeaderboardService(userRepository);
    const chatbotService = new ChatbotService(chatbotRepository);

    this.services.set('userRegistrationService', userRegistrationService);
    this.services.set('leaderboardService', leaderboardService);
    this.services.set('chatbotService', chatbotService);

    // 3. Register Use Cases (Application Layer)
    this.services.set('createUserUseCase', 
      new CreateUserUseCase(userRepository));
    this.services.set('updateUserUseCase', 
      new UpdateUserUseCase(userRepository));
    this.services.set('getAllUsersUseCase', 
      new GetAllUsersUseCase(userRepository));
    this.services.set('createProjectUseCase', 
      new CreateProjectUseCase(projectRepository, userRepository));
    this.services.set('askChatbotUseCase', 
      new AskChatbotUseCase(chatbotService));

    this.initialized = true;
  }

  get(serviceName: string) {
    if (!this.initialized) {
      this.initialize();
    }
    if (!this.services.has(serviceName)) {
      throw new Error(`Service '${serviceName}' not found in container`);
    }
    return this.services.get(serviceName);
  }
}

// Singleton instance
const container = new Container();
container.initialize();
export default container;
```

### Registered Services

| Service Name | Type | Dependencies | Purpose |
|--------------|------|--------------|---------|
| `userRepository` | Repository | ApiClient | User data access |
| `projectRepository` | Repository | ApiClient | Project data access |
| `eventRepository` | Repository | ApiClient | Event data access |
| `chatbotRepository` | Repository | ApiClient | Chatbot data access |
| `userRegistrationService` | Domain Service | UserRepository | User registration logic |
| `leaderboardService` | Domain Service | UserRepository | Leaderboard & ranking |
| `chatbotService` | Domain Service | ChatbotRepository | AI chatbot logic |
| `createUserUseCase` | Use Case | UserRepository | Create user workflow |
| `updateUserUseCase` | Use Case | UserRepository | Update user workflow |
| `deleteUserUseCase` | Use Case | UserRepository | Delete user workflow |
| `getAllUsersUseCase` | Use Case | UserRepository | Get users workflow |
| `createProjectUseCase` | Use Case | Project & User Repos | Create project workflow |
| `askChatbotUseCase` | Use Case | ChatbotService | Ask chatbot workflow |

---

## 🎭 Application Service (Facade Pattern)

### Location
`src/application/ApplicationService.ts`

### Purpose
The ApplicationService acts as a **Facade** that:
- Provides a simplified API for UI components
- Hides the complexity of use cases and domain services
- Handles cross-cutting concerns (error handling, logging)
- Maintains backward compatibility during refactoring

### Implementation

```typescript
class ApplicationService {
  private container: typeof container;

  constructor() {
    this.container = container;
  }

  // User Operations
  async createUser(userData: any): Promise<any> {
    const useCase = this.container.get('createUserUseCase');
    return await useCase.execute(userData);
  }

  async getAllUsers(filters: any = {}): Promise<any> {
    const useCase = this.container.get('getAllUsersUseCase');
    return await useCase.execute(filters);
  }

  // Project Operations
  async createProject(userId: string, projectData: any): Promise<any> {
    const useCase = this.container.get('createProjectUseCase');
    return await useCase.execute({ userId, ...projectData });
  }

  // Chatbot Operations
  async askChatbot(message: string, userId?: string): Promise<any> {
    const useCase = this.container.get('askChatbotUseCase');
    return await useCase.execute(message, userId);
  }

  // ... more methods
}

const applicationService = new ApplicationService();
export default applicationService;
```

### Benefits of the Facade

1. **Simplicity**: Single import for UI components
   ```typescript
   import applicationService from '@/application/ApplicationService';
   ```

2. **Consistency**: All operations return standardized responses
   ```typescript
   {
     success: boolean,
     data?: any,
     error?: string,
     message?: string
   }
   ```

3. **Flexibility**: Can switch between use cases and direct repository access
4. **Migration Path**: Easy to update old code gradually

---

## 🔄 Dependency Flow

### Example: Creating a User

```
┌──────────────────┐
│ React Component  │
│ (AdminPanel.tsx) │
└────────┬─────────┘
         │
         │ 1. Call applicationService.createUser(userData)
         ↓
┌────────────────────────┐
│  ApplicationService    │
│  (Facade)              │
└────────┬───────────────┘
         │
         │ 2. Get 'createUserUseCase' from container
         ↓
┌────────────────────────┐
│  Container             │
│  (DI Container)        │
└────────┬───────────────┘
         │
         │ 3. Return CreateUserUseCase with injected dependencies
         ↓
┌─────────────────────────┐
│  CreateUserUseCase      │
│  (Application Layer)    │
└────────┬────────────────┘
         │
         │ 4. Call userRegistrationService.register()
         ↓
┌──────────────────────────┐
│ UserRegistrationService  │
│ (Domain Service)         │
└────────┬─────────────────┘
         │
         │ 5. Validate & save via repository
         ↓
┌──────────────────────────┐
│  UserRepository          │
│  (Infrastructure)        │
└────────┬─────────────────┘
         │
         │ 6. Make HTTP call via ApiClient
         ↓
┌──────────────────────────┐
│  ApiClient               │
│  (HTTP Client)           │
└────────┬─────────────────┘
         │
         │ 7. POST /api/admin/users
         ↓
┌──────────────────────────┐
│  Backend API             │
└──────────────────────────┘
```

### Dependency Injection in Action

**CreateUserUseCase Constructor:**
```typescript
export class CreateUserUseCase {
  private userRegistrationService: any;

  constructor(userRegistrationService: any) {
    this.userRegistrationService = userRegistrationService;
  }

  async execute(command: any): Promise<any> {
    const user = await this.userRegistrationService.register(command);
    return { success: true, data: user };
  }
}
```

**Container Wiring:**
```typescript
// Container injects UserRepository into UserRegistrationService
const userRegistrationService = new UserRegistrationService(userRepository);

// Container injects UserRegistrationService into CreateUserUseCase
this.services.set('createUserUseCase', 
  new CreateUserUseCase(userRegistrationService));
```

---

## 💡 Usage Examples

### Example 1: Simple User Creation (UI Component)

```typescript
import applicationService from '@/application/ApplicationService';

const CreateUserForm = () => {
  const handleSubmit = async (formData) => {
    // Simple, clean API
    const result = await applicationService.createUser({
      username: formData.username,
      email: formData.email,
      role: 'user'
    });

    if (result.success) {
      toast.success('User created successfully!');
      console.log('New user:', result.data);
    } else {
      toast.error(result.error);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
};
```

### Example 2: Direct Use Case Access (Advanced)

```typescript
import container from '@/application/Container';

// Get specific use case for more control
const createUserUseCase = container.get('createUserUseCase');

const result = await createUserUseCase.execute({
  username: 'johndoe',
  email: 'john@example.com',
  role: 'admin'
});
```

### Example 3: Direct Repository Access

```typescript
import container from '@/application/Container';

// Get repository for custom queries
const userRepository = container.get('userRepository');

// Custom query not available in ApplicationService
const admins = await userRepository.findAll({ role: 'admin' });
const activeUsers = admins.filter(user => user.isActive());
```

### Example 4: Domain Service Usage

```typescript
import container from '@/application/Container';

// Get domain service for complex business logic
const leaderboardService = container.get('leaderboardService');

const topUsers = await leaderboardService.getTopUsers(10);
const userRank = await leaderboardService.getUserRank('user-123');
```

### Example 5: Chatbot Integration

```typescript
import applicationService from '@/application/ApplicationService';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);

  const handleSend = async (message: string) => {
    const result = await applicationService.askChatbot(message, userId);
    
    setMessages([
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: result.response }
    ]);
  };

  return <ChatInterface onSend={handleSend} />;
};
```

---

## ✅ Best Practices

### 1. Always Use ApplicationService in UI Components

❌ **Don't:**
```typescript
import userRepository from '@/infrastructure/repositories/UserRepository';

// Direct repository access in UI
const users = await userRepository.findAll();
```

✅ **Do:**
```typescript
import applicationService from '@/application/ApplicationService';

// Use facade
const result = await applicationService.getAllUsers();
const users = result.data;
```

### 2. Add New Dependencies to Container

When adding new features:

```typescript
// 1. Create repository
export class NotificationRepository { ... }

// 2. Create use case
export class SendNotificationUseCase { ... }

// 3. Register in Container
initialize() {
  this.services.set('notificationRepository', notificationRepository);
  this.services.set('sendNotificationUseCase', 
    new SendNotificationUseCase(notificationRepository));
}

// 4. Add to ApplicationService
async sendNotification(data: any) {
  const useCase = this.container.get('sendNotificationUseCase');
  return await useCase.execute(data);
}
```

### 3. Keep Business Logic in Domain Layer

❌ **Don't:**
```typescript
// Business logic in UI component
const calculateUserRank = (users: User[], targetUser: User) => {
  const sorted = users.sort((a, b) => b.points - a.points);
  return sorted.findIndex(u => u.id === targetUser.id) + 1;
};
```

✅ **Do:**
```typescript
// Business logic in domain service
class LeaderboardService {
  async getUserRank(userId: string): Promise<number> {
    // Complex ranking logic here
  }
}

// Use in UI
const rank = await applicationService.getUserRank(userId);
```

### 4. Use Domain Events for Side Effects

```typescript
// In domain service
const savedUser = await this.userRepository.save(user);

// Publish event
const event = new UserCreatedEvent(
  savedUser.id, 
  savedUser.email, 
  savedUser.username
);
await eventBus.publish(event);

// Event handlers can react
eventBus.subscribe('UserCreated', async (event) => {
  await sendWelcomeEmail(event.email);
  await createDefaultSettings(event.userId);
  await notifyAdmins(event);
});
```

### 5. Return Standardized Responses

```typescript
// All use cases return consistent format
{
  success: boolean,
  data?: any,
  error?: string,
  message?: string
}
```

---

## 🧪 Testing Strategy

### Unit Testing with Dependency Injection

The DI container makes testing extremely easy by allowing mock dependencies.

#### Testing a Use Case

```typescript
import { CreateUserUseCase } from '@/application/use-cases/users/CreateUserUseCase';

describe('CreateUserUseCase', () => {
  it('should create user successfully', async () => {
    // Mock repository
    const mockRepository = {
      save: jest.fn().mockResolvedValue({
        id: '123',
        username: 'johndoe',
        email: 'john@example.com'
      }),
      findByEmail: jest.fn().mockResolvedValue(null),
      findByUsername: jest.fn().mockResolvedValue(null)
    };

    // Mock domain service
    const mockRegistrationService = {
      register: jest.fn().mockResolvedValue({
        id: '123',
        username: 'johndoe'
      })
    };

    // Inject mocks
    const useCase = new CreateUserUseCase(mockRegistrationService);

    // Execute
    const result = await useCase.execute({
      username: 'johndoe',
      email: 'john@example.com'
    });

    // Assert
    expect(result.success).toBe(true);
    expect(mockRegistrationService.register).toHaveBeenCalledWith({
      username: 'johndoe',
      email: 'john@example.com'
    });
  });
});
```

#### Testing a Domain Service

```typescript
import { UserRegistrationService } from '@/domain/services/UserRegistrationService';

describe('UserRegistrationService', () => {
  it('should prevent duplicate email registration', async () => {
    // Mock repository
    const mockRepository = {
      findByEmail: jest.fn().mockResolvedValue({
        id: '456',
        email: 'existing@example.com'
      })
    };

    // Inject mock
    const service = new UserRegistrationService(mockRepository);

    // Execute and expect error
    await expect(
      service.register({
        username: 'newuser',
        email: 'existing@example.com'
      })
    ).rejects.toThrow('Email already registered');
  });
});
```

#### Integration Testing

```typescript
import applicationService from '@/application/ApplicationService';
import container from '@/application/Container';

describe('User Creation Integration', () => {
  beforeAll(() => {
    // Initialize container with test configuration
    container.initialize();
  });

  it('should create user end-to-end', async () => {
    const result = await applicationService.createUser({
      username: 'testuser',
      email: 'test@example.com',
      role: 'user'
    });

    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty('id');
    expect(result.data.username).toBe('testuser');
  });
});
```

---

## 🔍 Troubleshooting

### Issue: "Service not found in container"

**Cause:** Service not registered in Container

**Solution:**
```typescript
// Check Container.ts
this.services.set('yourServiceName', yourServiceInstance);
```

### Issue: Circular dependencies

**Cause:** Service A depends on Service B, and B depends on A

**Solution:** Use dependency inversion or event-driven approach
```typescript
// Instead of direct dependency
eventBus.publish(new UserCreatedEvent(userId));

// Event handler reacts
eventBus.subscribe('UserCreated', async (event) => {
  // Handle side effect
});
```

### Issue: Testing fails with "Cannot read property of undefined"

**Cause:** Mock not properly injected

**Solution:**
```typescript
// Ensure all required methods are mocked
const mockRepository = {
  findById: jest.fn().mockResolvedValue(null),
  findAll: jest.fn().mockResolvedValue([]),
  save: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue(true)
};
```

---

## 📊 Dependency Graph

```
Container (Singleton)
│
├── Repositories
│   ├── UserRepository → ApiClient
│   ├── ProjectRepository → ApiClient
│   ├── EventRepository → ApiClient
│   └── ChatbotRepository → ApiClient
│
├── Domain Services
│   ├── UserRegistrationService → UserRepository
│   ├── LeaderboardService → UserRepository
│   └── ChatbotService → ChatbotRepository
│
└── Use Cases
    ├── CreateUserUseCase → UserRegistrationService
    ├── UpdateUserUseCase → UserRepository
    ├── DeleteUserUseCase → UserRepository
    ├── GetAllUsersUseCase → UserRepository
    ├── CreateProjectUseCase → ProjectRepository + UserRepository
    └── AskChatbotUseCase → ChatbotService

ApplicationService (Facade)
└── Container → All Services
```

---

## 📚 Related Documentation

- [DDD Implementation Summary](./DDD_IMPLEMENTATION_SUMMARY.md)
- [DDD Implementation Guide](./DDD_IMPLEMENTATION_GUIDE.md)
- [Architecture Visual Guide](./ARCHITECTURE_VISUAL_GUIDE.md)
- [Backend Integration](./BACKEND_INTEGRATION.md)

---

## 🎉 Conclusion

The Dependency Injection architecture provides:

✅ **Loose Coupling**: Components depend on abstractions, not concrete implementations  
✅ **High Testability**: Easy to mock dependencies for unit tests  
✅ **Maintainability**: Single place (Container) to manage all dependencies  
✅ **Flexibility**: Easy to swap implementations without changing consumers  
✅ **Scalability**: New features follow established patterns  

The ApplicationService facade provides a simple, consistent API for UI components while maintaining clean architecture principles underneath.
