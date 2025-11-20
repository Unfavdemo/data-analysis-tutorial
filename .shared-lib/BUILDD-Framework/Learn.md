# Phase 4 = **LEARN Through Implementation**

# **Objective**

Build your application incrementally, testing as you go, and documenting your learning journey.

---

### **Step 4.1: Create Your MVP Wireframe**

**Activities:**

- Sketch basic layouts for key screens
- Identify minimum features for MVP
- Plan user flows

**AI Prompt Template:**

```
I'm designing the MVP for [YOUR APP].

Core features for MVP:
1. [Feature 1]
2. [Feature 2]
3. [Feature 3]

Help me:
1. Identify the minimum screens/pages needed
2. Describe what should be on each screen
3. Map the user flow between screens
4. Suggest a simple, clean layout structure

Keep it focused on MVP - what's absolutely necessary to prove the concept?
Reference: Review TS.2.2 (Create a wireframe) competency
Deliverable: Wireframe Document
markdown# MVP Wireframes

## Screen 1: [Name - e.g., "Login Page"]
**Purpose:** [What users do here]
**Elements:**
- [Element 1 - e.g., "Email input field"]
- [Element 2 - e.g., "Password input field"]
- [Element 3 - e.g., "Login button"]

**User Actions:**
- [Action 1] → [Result/Next screen]

**Sketch:**
[ASCII art or description]

```

┌─────────────────────┐

│ Logo │

│ │

│ Email: [ ] │

│ Password: [ ] │

│ [Login Button] │

│ │

│ Forgot password? │

└─────────────────────┘

```
## Screen 2: [Name]
[Repeat structure]

```

**Tool Options:**

- Hand sketches (photo upload)
- Figma (free tier)
- Excalidraw (free online)
- ASCII art (simple text)

---

### **Step 4.2: Set Up Project Board (Trello/GitHub Projects)**

**Activities:**

- Break features into tasks
- Organize tasks by priority
- Create a backlog

**AI Prompt Template:**

```
I'm setting up a project board for: [YOUR APP]

My MVP features are:
1. [Feature 1]
2. [Feature 2]
3. [Feature 3]

Help me:
1. Break each feature into specific tasks (user stories)
2. Estimate difficulty (small/medium/large)
3. Identify dependencies (what must be done first)
4. Organize into sprints/milestones

Format as a task list I can copy to Trello or GitHub Projects.
Deliverable: Project Board Structure
Columns:

📋 Backlog
📝 To Do
🔨 In Progress
✅ Done
🐛 Bugs

Example Tasks:
markdown## Feature: User Authentication

### Task 1: Set up database schema for users
- Type: Backend
- Difficulty: Small
- Dependencies: None
- Acceptance: Users table created with proper fields

### Task 2: Create user registration endpoint
- Type: Backend
- Difficulty: Medium
- Dependencies: Task 1
- Acceptance: POST /api/register accepts email/password, returns token

### Task 3: Build registration form component
- Type: Frontend
- Difficulty: Medium
- Dependencies: Task 2
- Acceptance: Form validates input, calls API, handles errors

```

**Reference:** "Day 7 and 8 Activities - CCC Deliverable" (Trello Board & Backlog)

---

### **Step 4.3: Implement Core Functionality First**

**Activities:**

- Start with backend/database (foundation)
- Then build frontend to consume APIs
- Test integration continuously

**Development Order (Recommended):**

**1. Database Layer**

```
Set up database → Define models → Create migrations → Test with sample data

```

**AI Prompt for Database Setup:**

```
I'm setting up the database for [YOUR APP].

My data models are:
[PASTE FROM PHASE 2 DATA MODELS]

Show me:
1. SQL scripts to create these tables
2. How to set up the database connection in [YOUR BACKEND]
3. How to run migrations
4. Sample data INSERT statements for testing

Use [PostgreSQL/MySQL/MongoDB] syntax.

```

**2. Backend API Layer**

```
Create routes → Implement controllers → Connect to database → Test with Postman

```

**AI Prompt for Backend Endpoints:**

```
I need to build a REST API endpoint for [ENTITY].

Requirements:
- GET /api/[entity] - list all
- GET /api/[entity]/:id - get one
- POST /api/[entity] - create new
- PUT /api/[entity]/:id - update
- DELETE /api/[entity]/:id - delete

Using: [Express/Fastify/etc.]
Database: [PostgreSQL/MongoDB/etc.]

Show me:
1. Route definitions
2. Controller functions with error handling
3. How to validate input
4. How to test each endpoint

```

**3. Frontend Layer**

```
Create components → Connect to API → Add styling → Implement state management

```

**AI Prompt for Frontend Components:**

```
I'm building a [COMPONENT NAME] component that needs to:
- [Requirement 1]
- [Requirement 2]

This component will:
- Fetch data from: [API endpoint]
- Display: [what data]
- Allow users to: [what actions]

Show me:
1. Component structure with hooks
2. API call implementation
3. Loading and error states
4. Basic styling approach

Use: [React/Vue/etc.] with [TailwindCSS/CSS/etc.]

```

---

### **Step 4.4: Test Each Component**

**Activities:**

- Write unit tests for critical functions
- Test API endpoints manually
- Verify UI functionality

**AI Prompt Template (Testing):**

```
I need to write tests for [COMPONENT/FUNCTION].

Here's my code:
```[language]
[PASTE CODE]
``` {data-source-line="226"}

Help me:
1. Identify what should be tested
2. Write unit tests using [Vitest/Jest/etc.]
3. Include edge cases and error scenarios
4. Show me how to run the tests

Explain what each test is checking.
Reference: Review "Unit Testing: Vitest" lesson (September 15, 2025)
Basic Test Structure:
javascript// Example: Testing a user registration function
describe('User Registration', () => {
  test('should create user with valid data', async () => {
    // Arrange: Set up test data
    const userData = { email: 'test@example.com', password: 'secure123' };

    // Act: Call the function
    const result = await registerUser(userData);

    // Assert: Check the result
    expect(result.success).toBe(true);
    expect(result.user.email).toBe('test@example.com');
  });

  test('should reject invalid email', async () => {
    const userData = { email: 'invalid', password: 'secure123' };
    await expect(registerUser(userData)).rejects.toThrow('Invalid email');
  });
});

```

---

### **Step 4.5: Iterate and Refactor**

**Activities:**

- Review your code for improvements
- Refactor repeated code into functions
- Optimize performance

**AI Prompt Template (Refactoring):**

```
I have this code that works but could be better:
```[language]
[PASTE CODE]
``` {data-source-line="272"}

Help me refactor this to:
1. Remove code duplication (DRY principle)
2. Improve readability
3. Make it more maintainable
4. Follow best practices for [FRAMEWORK/LANGUAGE]

Explain what you changed and why.

```