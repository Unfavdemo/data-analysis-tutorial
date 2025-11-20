# Phase 5 = **DEBUG & Document Solutions**

## **Objective**

Systematically troubleshoot issues, document your solutions, and prepare your project for review/deployment.

---

## **Step 5.1: Systematic Debugging**

### **Activities**

- Use browser/server console logs effectively
- Leverage AI for specific error messages
- Document bugs and fixes

### **The Debugging Process**

### **1. Reproduce the Bug**

- What were you doing when it happened?
- Can you make it happen again?
- Does it happen every time?

### **2. Read the Error Message**

- Where is the error occurring? (file, line number)
- What type of error? (syntax, runtime, logic)
- What is the error message telling you?

### **3. Check the Logs**

**Frontend (Browser):**

```jsx
// Add console logs strategically
console.log('Component rendered with props:', props);
console.log('API response:', response.data);
console.error('Error occurred:', error);

```

**Backend (Server):**

```jsx
// Use logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// Log errors with context
console.error('Database query failed:', error.message, { userId, query });

```

**AI Prompt Template (Debugging):**

```
I'm getting this error:

Error Message:
[PASTE COMPLETE ERROR MESSAGE]

Context:
- What I was trying to do: [DESCRIPTION]
- Which component/function: [NAME]
- When it happens: [SCENARIO]

Relevant code:
```[language]
[PASTE CODE WHERE ERROR OCCURS]
``` {data-source-line="68"}

Help me:
1. Explain what this error means
2. Identify the likely cause
3. Provide a step-by-step fix
4. Suggest how to prevent this in the future

```

### **Common Error Categories**

### **Syntax Errors**

```
I'm getting a syntax error: [ERROR MESSAGE]

In this code:
```[language]
[PASTE CODE]
``` {data-source-line="87"}

Point out:
1. What's wrong with the syntax
2. The correct syntax
3. Why it matters

```

### **API/Network Errors**

```
My API call is failing with: [STATUS CODE / ERROR]

Frontend code:
```javascript
[PASTE FETCH/AXIOS CODE]
``` {data-source-line="103"}

Backend code:
```javascript
[PASTE ENDPOINT CODE]
``` {data-source-line="108"}

Help me debug:
1. Is the request formatted correctly?
2. Is the endpoint receiving the request?
3. What's the response status and data?
4. How do I fix the issue?

```

### **State Management Errors**

```
My component isn't updating when [SCENARIO].

Component code:
```javascript
[PASTE COMPONENT]
``` {data-source-line="125"}

The state should change when: [EXPECTED BEHAVIOR]
But instead: [ACTUAL BEHAVIOR]

Help me understand:
1. Is state being updated correctly?
2. Are there any stale closures?
3. Should I use a different approach?

```

### **Reference**

Review "Troubleshooting Sample" document for systematic approach

---

## **Step 5.2: Document Your Code**

### **Activities**

- Add clear comments to complex logic
- Write meaningful commit messages
- Create inline documentation

### **Code Documentation Best Practices**

### **1. Function/Component Documentation**

```jsx
/**
 * Fetches user data from the API and updates local state
 *
 * @param {string} userId - The unique identifier for the user
 * @returns {Promise<User>} The user object with profile data
 * @throws {Error} If the API request fails or user not found
 *
 * Example usage:
 * const user = await fetchUserData('123');
 */
async function fetchUserData(userId) {
  // Implementation...
}

```

### **2. Complex Logic Comments**

```jsx
// Calculate the weighted score based on user preferences
// Formula: (base_score * 0.6) + (popularity * 0.3) + (recency * 0.1)
// This ensures recently popular items are prioritized but quality remains important
const weightedScore = (item.baseScore * 0.6) +
                      (item.popularity * 0.3) +
                      (item.recency * 0.1);

```

### **3. Configuration/Setup Comments**

```jsx
// Database connection configuration
// Uses connection pooling for better performance
// Max 20 connections, min 2 idle connections
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  // ... config
};

```

**AI Prompt Template (Documentation):**

```
Add clear comments to this code explaining what it does and why:
```[language]
[PASTE CODE]
``` {data-source-line="199"}

Include:
1. High-level overview of what this code accomplishes
2. Explanation of complex logic
3. Why certain approaches were chosen
4. Any assumptions or limitations

Make comments helpful for someone reading this in 6 months.

```

---

### **Step 5.3: Create Comprehensive README**

**Activities:**

- Document setup instructions
- Explain project structure
- List dependencies and why they're used

**AI Prompt Template (README):**

```
Create a comprehensive README for my project:

Project: [NAME]
Description: [BRIEF DESCRIPTION]
Tech Stack:
- Frontend: [TECHNOLOGIES]
- Backend: [TECHNOLOGIES]
- Database: [TECHNOLOGY]

Include sections for:
1. Project overview and features
2. Prerequisites (what needs to be installed)
3. Installation steps
4. How to run locally
5. Project structure explanation
6. API endpoints (if backend)
7. Environment variables needed
8. Common issues and solutions
9. Future improvements

Make it clear for someone cloning the project for the first time.
README Template:
markdown# [Project Name]

## 📋 Overview
[Brief description of what your project does and why it exists]

## ✨ Features
- [Feature 1]
- [Feature 2]
- [Feature 3]

## 🛠️ Tech Stack
- **Frontend:** [React, Vite, TailwindCSS]
- **Backend:** [Node.js, Express]
- **Database:** [PostgreSQL]
- **Authentication:** [JWT]
- **Deployment:** [Platform]

## 📦 Prerequisites
- Node.js (v18+)
- npm or yarn
- PostgreSQL (v14+)
- [Any other requirements]

## 🚀 Installation

### 1. Clone the repository
```bash
git clone [your-repo-url]
cd [project-folder]
``` {data-source-line="272"}

### 2. Install dependencies
```bash
# Frontend {#frontend  data-source-line="276"}
cd frontend
npm install

# Backend {#backend  data-source-line="280"}
cd ../backend
npm install
``` {data-source-line="283"}

### 3. Set up environment variables
Create `.env` files:

**Frontend (.env):**

```

VITE_API_URL=http://localhost:3000/api

```
**Backend (.env):**

```

DATABASE_URL=postgresql://user:password@localhost:5432/dbname

JWT_SECRET=your-secret-key

PORT=3000

```
### 4. Set up database
```bash
cd backend
npm run migrate
npm run seed
``` {data-source-line="305"}

### 5. Run the application
```bash
# Terminal 1: Backend {#terminal-1-backend  data-source-line="309"}
cd backend
npm run dev

# Terminal 2: Frontend {#terminal-2-frontend  data-source-line="313"}
cd frontend
npm run dev
``` {data-source-line="316"}

Open http://localhost:5173 in your browser.

## 📁 Project Structure

```

project-root/

├── frontend/

│ ├── src/

│ │ ├── components/ # Reusable UI components

│ │ ├── pages/ # Page-level components

│ │ ├── services/ # API calls and external services

│ │ ├── utils/ # Helper functions

│ │ └── App.jsx # Root component

│ └── package.json

├── backend/

│ ├── src/

│ │ ├── routes/ # API route definitions

│ │ ├── controllers/ # Request handlers

│ │ ├── models/ # Database models

│ │ ├── middleware/ # Custom middleware

│ │ └── server.js # Entry point

│ └── package.json

└── [README.md](http://readme.md/)

```
## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user

[Continue with other endpoints...]

## 🧪 Testing
```bash
# Frontend tests {#frontend-tests  data-source-line="356"}
cd frontend
npm run test

# Backend tests {#backend-tests  data-source-line="360"}
cd backend
npm run test
``` {data-source-line="363"}

## 🐛 Common Issues

### Issue 1: Database connection fails
**Solution:** Check that PostgreSQL is running and credentials in `.env` are correct.

### Issue 2: Port already in use
**Solution:** Change the PORT in `.env` or stop the process using that port.

## 🚧 Future Improvements
- [ ] Add email verification
- [ ] Implement real-time notifications
- [ ] Add file upload functionality
- [ ] Improve error handling

## 👥 Contributing
[If applicable]

## 📄 License
[Your license]

## 📧 Contact
[Your contact information]

```

---

### **Step 5.4: Create Evidence/Portfolio Documentation**

**Activities:**

- Document your learning journey
- Capture screenshots/demos
- Write reflections on challenges overcome

**AI Prompt Template (Portfolio Documentation):**

```
Help me create portfolio documentation for my project: [PROJECT NAME]

Project details:
- Purpose: [WHAT IT DOES]
- Technologies: [LIST]
- Duration: [TIME SPENT]
- Role: [IF TEAM PROJECT]

Help me write:
1. A compelling project summary (2-3 paragraphs)
2. Key technical challenges and how I solved them
3. What I learned from this project
4. Metrics/achievements (if any)

Format it professionally for a portfolio or job application.
Portfolio Documentation Template:
markdown# [Project Name]

## Project Summary
[2-3 paragraphs describing what you built and why it matters]

## My Role & Responsibilities
- [Responsibility 1]
- [Responsibility 2]

## Technologies Used
- [Technology]: [How you used it]
- [Technology]: [How you used it]

## Key Features Implemented
### Feature 1: [Name]
[Screenshot or GIF]
**Implementation:** [Brief technical description]
**Challenge:** [What was difficult]
**Solution:** [How you solved it]

### Feature 2: [Name]
[Repeat structure]

## Technical Challenges & Solutions

### Challenge 1: [Title]
**Problem:** [Describe the issue you faced]
**Approach:** [How you investigated/researched]
**Solution:** [What you implemented]
**Learning:** [What you gained from this]

### Challenge 2: [Title]
[Repeat structure]

## Code Highlights
```[language]
// Example of interesting/complex code you wrote
[PASTE CODE WITH COMMENTS]
``` {data-source-line="454"}
**Why this matters:** [Explain why this code is noteworthy]

## Outcomes & Metrics
- [Measurable result 1 - e.g., "Reduced load time by 40%"]
- [Measurable result 2 - e.g., "Successfully deployed to 50+ users"]

## What I Learned
- [Key learning 1]
- [Key learning 2]
- [Key learning 3]

## Future Enhancements
- [Planned improvement 1]
- [Planned improvement 2]

## Links
- **Live Demo:** [URL if deployed]
- **GitHub Repository:** [URL]
- **Video Demo:** [URL if created]

```

---

### **Step 5.5: Prepare for Code Review/Presentation**

**Activities:**

- Clean up code (remove console.logs, unused code)
- Test all features one final time
- Prepare to explain your decisions

**AI Prompt Template (Presentation Prep):**

```
I'm presenting my project: [PROJECT NAME] to [AUDIENCE: instructor/peers/employer]

Help me prepare:
1. A 5-minute presentation outline covering key points
2. Anticipated questions and how to answer them
3. How to demo the most impressive features
4. How to explain technical decisions simply

Project details:
[BRIEF DESCRIPTION OF YOUR APP AND TECH CHOICES]
Presentation Outline Template:
markdown# Project Presentation: [Name]

## 1. Introduction (30 seconds)
- What problem does this solve?
- Who is it for?

## 2. Demo (2-3 minutes)
- Feature 1 demo
- Feature 2 demo
- Highlight best technical implementation

## 3. Technical Architecture (1 minute)
- High-level architecture diagram
- Key technology choices and why

## 4. Challenges & Solutions (1 minute)
- Most interesting technical challenge
- How you solved it

## 5. Learnings & Next Steps (30 seconds)
- Key takeaway from the project
- Future enhancements

## Anticipated Questions:
**Q: Why did you choose [technology]?**
A: [Your reasoning]

**Q: How did you handle [specific challenge]?**
A: [Your approach]

**Q: What would you do differently?**
A: [Honest reflection]

```

---

### **✅ Phase 5 Final Checkpoint**

**Before submitting/presenting, you should have:**

- [ ]  All bugs fixed or documented
- [ ]  Code properly commented
- [ ]  Comprehensive README created
- [ ]  Portfolio documentation prepared
- [ ]  Presentation outline ready
- [ ]  Final testing completed

**Self-Assessment Questions:**

1. Can someone clone your repo and run it following your README?
2. Have you documented the "why" behind your key decisions?
3. Can you explain any part of your code if asked?
4. Are you proud of what you built?

---

# **📚 Quick Reference: AI Prompt Library**

## **Understanding & Research**

### **Learn a New Concept**

```
Explain [CONCEPT] to me in simple terms.
Then show me a practical example in the context of [YOUR PROJECT].
Finally, explain when and why I would use this.

```

### **Compare Options**

```
I need to choose between [OPTION A] and [OPTION B] for [PURPOSE].

Compare them on:
- Ease of use
- Performance
- Learning curve
- Community support
- Best for my use case: [DESCRIBE PROJECT]

Recommend one with justification.

```

---

## **Planning & Design**

### **Architecture Design**

```
I'm building [DESCRIPTION OF APP].

Help me design the architecture:
1. What components/services do I need?
2. How should they communicate?
3. What data needs to be stored?
4. Any external services I should consider?

Provide a text-based architecture diagram.

```

### **User Story Creation**

```
Turn this feature idea into proper user stories: [FEATURE DESCRIPTION]

Format each as:
- As a [user type]
- I want [action]
- So that [benefit]

Include acceptance criteria for each.

```

---

## **Implementation**

### **Generate Boilerplate**

```
Create [COMPONENT/FILE TYPE] for [PURPOSE] that includes:
- [Requirement 1]
- [Requirement 2]
- Comments explaining key parts
- Error handling
- Best practices for [TECHNOLOGY]

Then explain what each section does.

```

### **Solve Specific Problem**

```
I'm trying to [WHAT YOU WANT TO DO].

Current code:
```[language]
[YOUR CODE]
``` {data-source-line="629"}

The issue is: [DESCRIBE PROBLEM]

Help me:
1. Identify what's wrong
2. Provide a working solution
3. Explain why your solution works

```

---

## **Debugging**

### **Error Analysis**

```
Error: [FULL ERROR MESSAGE]

Context:
- File: [FILENAME]
- Function: [FUNCTION NAME]
- What I was doing: [ACTION]

Relevant code:
```[language]
[CODE SNIPPET]
``` {data-source-line="655"}

Explain:
1. What this error means
2. What likely caused it
3. How to fix it
4. How to prevent it

```

### **Logic Bug**

```
Expected behavior: [WHAT SHOULD HAPPEN]
Actual behavior: [WHAT HAPPENS INSTEAD]

Code:
```[language]
[YOUR CODE]
``` {data-source-line="672"}

Help me trace through the logic and find where it goes wrong.

```

---

## **Optimization & Review**

### **Code Review**

```
Review this code for:
- Best practices
- Security issues
- Performance problems
- Readability
```[language]
[YOUR CODE]
``` {data-source-line="690"}

Suggest improvements with explanations.

```

### **Refactoring**

```
This code works but needs improvement:
```[language]
[YOUR CODE]
``` {data-source-line="700"}

Refactor it to:
- Remove duplication
- Improve clarity
- Follow [FRAMEWORK] conventions
- Maintain the same functionality

Explain each change you make.

```

---

## **Documentation**

### **Add Comments**

```
Add clear, helpful comments to this code:
```[language]
[YOUR CODE]
``` {data-source-line="720"}

Explain:
- What each section does
- Why certain approaches were chosen
- Any gotchas or important notes

```

### **Create README**

```