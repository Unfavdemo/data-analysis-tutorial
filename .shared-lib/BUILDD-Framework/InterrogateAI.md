# Phase 3 = **INTERROGATE AI Tools**

# **Objective**

Strategically use AI to generate code, solve problems, and learn best practices while maintaining understanding.

---

### **Step 3.1: Set Up Development Environment**

**Activities:**

- Create project structure
- Initialize tools (Git, package managers)
- Set up development dependencies

**AI Prompt Template:**

```
I'm starting a [TYPE] project using:
- Frontend: [technology]
- Backend: [technology]
- Database: [technology]

Help me:
1. Create a recommended folder structure
2. List all the dependencies I need to install
3. Provide the initialization commands
4. Create a basic .gitignore file
5. Suggest environment variables I'll need

Please provide step-by-step commands I can run.

```

**Deliverable:** Initialized Project Repository

```
project-root/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── server.js
│   └── package.json
├── .gitignore
├── README.md
└── docker-compose.yml

```

---

### **Step 3.2: Generate Boilerplate Code with Understanding**

**Activities:**

- Request AI to generate starter code
- Ask for explanations of generated code
- Modify and customize the code

**AI Prompt Template (Frontend Component):**

```
Create a React component for [SPECIFIC FEATURE] that:
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

Include:
1. Proper error handling
2. Loading states
3. Comments explaining key parts
4. TypeScript types (if using TS)

After generating the code, explain:
- What each major section does
- Why you made specific design choices
- What best practices are being followed

```

**AI Prompt Template (Backend API):**

```
Create a Node.js Express route for [SPECIFIC ENDPOINT] that:
- Method: [GET/POST/PUT/DELETE]
- Purpose: [what it does]
- Accepts: [input parameters]
- Returns: [response format]

Include:
1. Input validation
2. Error handling
3. Proper HTTP status codes
4. Comments explaining the logic

Then explain the security considerations for this endpoint.

```

**AI Prompt Template (Database):**

```
Create a database schema for [ENTITY] with these requirements:
[LIST REQUIREMENTS FROM YOUR DATA MODEL]

Provide:
1. SQL CREATE TABLE statement
2. Any indexes needed for performance
3. Foreign key constraints
4. Sample INSERT statements

Explain why you structured it this way.

```

**⚠️ Critical Rule:**

**Never use AI-generated code without understanding it!**

**Before using generated code, ask:**

```
Explain this code to me like I'm a beginner:
[PASTE CODE BLOCK]

Specifically explain:
1. What does each function/section do?
2. Why is it structured this way?
3. What could go wrong and how is it handled?
4. What would I need to change to customize it?

```

---

### **Step 3.3: Implement Features Iteratively**

**Activities:**

- Work on one feature at a time
- Use AI to solve specific problems
- Test each piece before moving on

**AI Prompt Template (Feature Implementation):**

```
I'm implementing [FEATURE NAME] which needs to:
[DESCRIBE WHAT THE FEATURE DOES]

I've already built: [WHAT YOU HAVE]
I'm stuck on: [SPECIFIC PROBLEM]

My current code:
```[language]
[PASTE RELEVANT CODE]
``` {data-source-line="149"}

Help me:
1. Identify what's wrong or missing
2. Suggest a solution with explanation
3. Show example code with comments

```

**AI Prompt Template (Integration):**

```
I need to connect my [COMPONENT A] to [COMPONENT B].

Component A: [BRIEF DESCRIPTION]
Component B: [BRIEF DESCRIPTION]

What I need:
- [Specific integration requirement]

Show me:
1. How to structure the connection
2. Code examples for both sides
3. Error handling for connection failures
4. How to test the integration

```

**Example Use Cases:**

**For API Integration:**

```
I'm building a React component that needs to fetch data from my backend API at /api/users.

Show me how to:
1. Make the API call using fetch or axios
2. Handle loading states
3. Display errors to users
4. Cache the results to avoid repeated calls

Include code with comments explaining each part.

```

**For Authentication:**

```
I need to implement JWT authentication for my app.

My setup:
- Frontend: React
- Backend: Node.js/Express
- Database: PostgreSQL

Show me step-by-step:
1. How to generate tokens on the backend
2. How to store tokens securely on the frontend
3. How to send tokens with requests
4. How to verify tokens on protected routes

Include security best practices.

```

---

### **Step 3.4: Learn Patterns and Best Practices**

**Activities:**

- Ask AI about common patterns
- Request code reviews
- Learn industry standards

**AI Prompt Template (Pattern Learning):**

```
I'm working with [TECHNOLOGY/FRAMEWORK].

Teach me about these common patterns:
1. [Pattern 1 - e.g., "Container/Presentational components in React"]
2. [Pattern 2 - e.g., "Repository pattern for database access"]

For each pattern:
- Explain what it is
- Show a simple example
- Explain when to use it
- Show how it applies to my project: [DESCRIBE PROJECT]

```

**AI Prompt Template (Code Review):**

```
Review this code I wrote for [PURPOSE]:
```[language]
[PASTE YOUR CODE]
``` {data-source-line="236"}

Please evaluate:
1. Is it following best practices?
2. Are there any security issues?
3. Can it be more efficient?
4. Is it readable and maintainable?
5. What would you improve?

Explain your suggestions in a way that helps me learn.

```

**AI Prompt Template (Error Understanding):**

```
I'm getting this error:
[PASTE ERROR MESSAGE]

My code:
```[language]
[PASTE RELEVANT CODE]
``` {data-source-line="256"}

Help me:
1. Understand what this error means in simple terms
2. Identify the likely cause
3. Provide a fix with explanation
4. Teach me how to avoid this in the future

```

---

### **✅ Phase 3 Checkpoint**

**Before moving to Phase 4, you should have:**

- [ ]  Development environment fully set up
- [ ]  Boilerplate code generated and understood
- [ ]  At least 1-2 features implemented and working
- [ ]  Notes on patterns and best practices learned

**Self-Assessment Questions:**

1. Can you explain the code AI generated for you?
2. Have you customized the generated code for your needs?
3. Can you troubleshoot issues with AI assistance?