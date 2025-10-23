# Architecture Documentation Index

**Welcome to the ESDC Frontend Architecture Documentation!**

This directory contains comprehensive architectural documentation that **must be followed** by all developers working on this project.

---

## 📖 Quick Start

**New to the project?** Read these in order:

1. **[ARCHITECTURE.md](../../ARCHITECTURE.md)** ⭐ **START HERE**
   - Complete architecture overview
   - DDD principles and concepts
   - Layer structure and responsibilities
   - Best practices and anti-patterns
   - **Estimated reading time**: 30 minutes

2. **[GUIDELINES.md](./GUIDELINES.md)** 📋 **MANDATORY**
   - Strict coding guidelines
   - Layer responsibilities (MUST/MUST NOT)
   - Code review checklist
   - Enforcement rules
   - **Estimated reading time**: 20 minutes

3. **[PATTERNS.md](./PATTERNS.md)** 🎯 **REFERENCE**
   - Design patterns with examples
   - Code templates
   - React patterns
   - Common implementations
   - **Estimated reading time**: 30 minutes (use as reference)

4. **[ADR.md](./ADR.md)** 📝 **CONTEXT**
   - Architecture Decision Records
   - Why we made certain choices
   - Trade-offs and consequences
   - **Estimated reading time**: 15 minutes

---

## 📚 Complete Documentation Structure

### Root Level

- **[ARCHITECTURE.md](../../ARCHITECTURE.md)**
  - Master architecture document
  - Core principles
  - Layer structure
  - Complete reference

### Architecture Directory (Here)

- **[GUIDELINES.md](./GUIDELINES.md)**
  - Strict rules and requirements
  - Do's and don'ts
  - Code review checklist

- **[PATTERNS.md](./PATTERNS.md)**
  - Design patterns
  - Code examples
  - Implementation templates

- **[ADR.md](./ADR.md)**
  - Architecture decisions
  - Historical context
  - Trade-off analysis

### DDD Documentation

- **[DDD_QUICK_REFERENCE.md](../DDD_QUICK_REFERENCE.md)**
  - Quick lookup for common operations
  - Code snippets
  - Common patterns

- **[DDD_IMPLEMENTATION_GUIDE.md](../DDD_IMPLEMENTATION_GUIDE.md)**
  - Detailed implementation guide
  - How to use each layer
  - Examples and best practices

- **[DDD_BEFORE_AFTER.md](../DDD_BEFORE_AFTER.md)**
  - Migration examples
  - Before/after comparisons
  - Real-world use cases

- **[DDD_README.md](../DDD_README.md)**
  - DDD implementation overview
  - Quick start guide
  - Feature list

---

## 🎯 By Role

### For New Developers

**Day 1**: Read these documents

1. [ARCHITECTURE.md](../../ARCHITECTURE.md) - Understand the architecture
2. [GUIDELINES.md](./GUIDELINES.md) - Learn the rules
3. [DDD_QUICK_REFERENCE.md](../DDD_QUICK_REFERENCE.md) - Get practical examples

**Day 2-5**: Practice with examples

- Read [PATTERNS.md](./PATTERNS.md)
- Study existing code
- Start with small tasks

**Week 2+**: Deep dive

- Read [ADR.md](./ADR.md) - Understand decisions
- Review [DDD_IMPLEMENTATION_GUIDE.md](../DDD_IMPLEMENTATION_GUIDE.md)
- Contribute to codebase

### For Experienced Developers

**Quick Reference**:

- [DDD_QUICK_REFERENCE.md](../DDD_QUICK_REFERENCE.md) - Daily operations
- [PATTERNS.md](./PATTERNS.md) - Design patterns

**Deep Dives**:

- [GUIDELINES.md](./GUIDELINES.md) - When reviewing code
- [ADR.md](./ADR.md) - When making architectural decisions

### For Architects/Tech Leads

**Review**:

- [ARCHITECTURE.md](../../ARCHITECTURE.md) - Overall architecture
- [ADR.md](./ADR.md) - Past decisions
- [GUIDELINES.md](./GUIDELINES.md) - Enforcement

**Update**:

- Add new ADRs for major decisions
- Update guidelines as needed
- Review and refresh documentation

---

## 🔍 By Topic

### Understanding DDD

1. Start: [ARCHITECTURE.md - DDD Section](../../ARCHITECTURE.md#domain-driven-design-ddd)
2. Deep dive: [DDD_IMPLEMENTATION_GUIDE.md](../DDD_IMPLEMENTATION_GUIDE.md)
3. Examples: [DDD_BEFORE_AFTER.md](../DDD_BEFORE_AFTER.md)

### Layer Architecture

1. Overview: [ARCHITECTURE.md - Layer Structure](../../ARCHITECTURE.md#layer-structure)
2. Rules: [GUIDELINES.md - Layer Responsibilities](./GUIDELINES.md#layer-responsibilities)
3. Examples: [PATTERNS.md](./PATTERNS.md)

### Design Patterns

1. Catalog: [PATTERNS.md](./PATTERNS.md)
2. Usage: [DDD_QUICK_REFERENCE.md](../DDD_QUICK_REFERENCE.md)
3. Anti-patterns: [ARCHITECTURE.md - Anti-Patterns](../../ARCHITECTURE.md#anti-patterns-to-avoid)

### Testing

1. Strategy: [ARCHITECTURE.md - Testing Strategy](../../ARCHITECTURE.md#testing-strategy)
2. Requirements: [GUIDELINES.md - Testing Requirements](./GUIDELINES.md#testing-requirements)
3. Examples: [PATTERNS.md - Testing](./PATTERNS.md)

### Code Quality

1. Standards: [ARCHITECTURE.md - Coding Standards](../../ARCHITECTURE.md#coding-standards)
2. Guidelines: [GUIDELINES.md - Coding Rules](./GUIDELINES.md#coding-rules)
3. Review: [GUIDELINES.md - Code Review Checklist](./GUIDELINES.md#code-review-checklist)

---

## 📋 Common Tasks

### "I need to add a new feature"

1. Read: [ARCHITECTURE.md - DDD Building Blocks](../../ARCHITECTURE.md#ddd-building-blocks)
2. Check: [GUIDELINES.md - Layer Responsibilities](./GUIDELINES.md#layer-responsibilities)
3. Reference: [PATTERNS.md](./PATTERNS.md)
4. Example: [DDD_BEFORE_AFTER.md](../DDD_BEFORE_AFTER.md)

### "I'm not sure where code should go"

1. Check: [ARCHITECTURE.md - Layer Structure](../../ARCHITECTURE.md#layer-structure)
2. Rules: [GUIDELINES.md - Layer Responsibilities](./GUIDELINES.md#layer-responsibilities)
3. Ask: Is it business logic? → Domain layer
4. Ask: Is it a use case? → Application layer
5. Ask: Is it UI? → Presentation layer
6. Ask: Is it external I/O? → Infrastructure layer

### "I need to fetch data"

**Quick answer**: Use `ApplicationService`

```typescript
import applicationService from '@/application/ApplicationService';
const result = await applicationService.getAllUsers();
```

Reference: [DDD_QUICK_REFERENCE.md](../DDD_QUICK_REFERENCE.md)

### "My PR was rejected for architecture violation"

1. Read the PR comments carefully
2. Check: [GUIDELINES.md](./GUIDELINES.md)
3. Review: [ARCHITECTURE.md - Anti-Patterns](../../ARCHITECTURE.md#anti-patterns-to-avoid)
4. Ask: Your reviewer or team lead

### "I want to understand a design decision"

1. Check: [ADR.md](./ADR.md)
2. Look for relevant ADR
3. Understand context and consequences
4. Still unclear? Ask in team chat

---

## 🚀 Quick Reference

### Import Patterns

```typescript
// ✅ Correct - Use ApplicationService from UI
import applicationService from '@/application/ApplicationService';

// ✅ Correct - Use domain types for annotations
import { User, UserRole } from '@/domain';

// ❌ Wrong - Never import infrastructure from UI
import { userRepository } from '@/infrastructure';

// ❌ Wrong - Never import domain services from UI
import { ChallengeEvaluationService } from '@/domain/services';
```

### Common Operations

```typescript
// Get all users
const result = await applicationService.getAllUsers();

// Create user
const result = await applicationService.createUser(userData);

// Complete challenge
const result = await applicationService.completeChallenge(userId, challengeId);
```

### Error Handling

```typescript
const result = await applicationService.someOperation();

if (result.success) {
  // Handle success
  console.log('Success:', result.data);
} else {
  // Handle error
  console.error('Error:', result.error);
}
```

---

## ⚠️ Important Rules

### MUST Follow

1. ✅ Use ApplicationService from UI components
2. ✅ Put business logic in domain layer
3. ✅ Use value objects for domain concepts
4. ✅ Handle all errors properly
5. ✅ Write tests for domain logic
6. ✅ Follow layer dependencies

### MUST NOT Do

1. ❌ Access repositories directly from UI
2. ❌ Put business logic in components
3. ❌ Skip error handling
4. ❌ Use primitives for domain concepts
5. ❌ Violate layer boundaries
6. ❌ Skip tests

---

## 📞 Getting Help

### Questions?

- **Architecture questions**: Ask team lead or check ADR.md
- **How to implement**: Check PATTERNS.md or DDD guides
- **Code review feedback**: Discuss with reviewer
- **General questions**: Team chat

### Contributing to Documentation

Found an error? Have a suggestion?

1. Open an issue or PR
2. Discuss with team
3. Update relevant documents
4. Update this index if needed

---

## 📊 Documentation Health

### Last Major Update

- **Date**: October 2025
- **Version**: 1.0
- **Status**: ✅ Current

### Review Schedule

- **Quarterly**: Review all documents for accuracy
- **After major changes**: Update affected documents
- **When onboarding**: Verify clarity for new developers

### Maintenance

**Owners**: Development Team  
**Primary Maintainer**: Tech Lead  
**Review Frequency**: Quarterly

---

## 📈 Adoption Progress

### Phase 1: Documentation ✅

- [x] Create ARCHITECTURE.md
- [x] Create GUIDELINES.md
- [x] Create PATTERNS.md
- [x] Create ADR.md
- [x] Create this index

### Phase 2: Training 🔄

- [ ] Team training session
- [ ] Code review training
- [ ] Pair programming sessions
- [ ] Documentation review

### Phase 3: Enforcement 📋

- [ ] Add to PR template
- [ ] Update code review guidelines
- [ ] Add automated checks
- [ ] Regular architecture reviews

---

## 📝 Feedback

This documentation is maintained by the team, for the team. Your feedback is valuable!

**Good documentation should be**:

- ✅ Easy to find
- ✅ Easy to understand
- ✅ Accurate and up-to-date
- ✅ Practical with examples
- ✅ Enforced consistently

If this documentation doesn't meet these standards, let us know!

---

## 🎓 Learning Path

### Week 1: Foundations

- Read ARCHITECTURE.md
- Read GUIDELINES.md
- Practice with small tasks

### Week 2: Deep Dive

- Read PATTERNS.md
- Study existing code
- Implement features

### Week 3: Mastery

- Read ADR.md
- Review PRs
- Mentor others

### Month 2+: Expert

- Contribute to architecture
- Propose ADRs
- Update documentation

---

**Last Updated**: October 2025  
**Version**: 1.0  
**Status**: ✅ Active

**Questions?** Check the docs or ask the team!
