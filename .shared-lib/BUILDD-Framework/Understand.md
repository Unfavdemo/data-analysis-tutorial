# Phase 2 = Understand & Document

## **Objective**

Define technical terms, document your understanding, and create clear specifications before writing code.

---

### **Step 2.1: Define Technical Terms**

**Activities:**

- List unfamiliar technologies and concepts
- Get clear definitions for each term
- Understand how they relate to your project

**AI Prompt Template:**

```
I'm building [YOUR APP] using [TECHNOLOGIES].

I need clear definitions for these terms/concepts in the context of my project:
1. [Term 1 - e.g., "REST API"]
2. [Term 2 - e.g., "JWT authentication"]
3. [Term 3 - e.g., "Database normalization"]

For each term, explain:
- What it is (simple definition)
- Why it's relevant to my project
- A simple example in my context

```

### **Deliverable: Technical Glossary**

```markdown
## [Term 1]**Definition:** [Clear, simple explanation]
**Relevance:** [Why this matters for your project]
**Example:** [How you'll use it]
**Resources:**- [Link to documentation]
- [Tutorial reference]

## [Term 2]
[Repeat structure]

```

---

### **Step 2.2: Research Technology Stack**

**Activities:**

- Research recommended technologies for each component
- Understand trade-offs between options
- Document your technology choices

**AI Prompt Template:**

```
For my [TYPE OF APPLICATION], I need to choose technologies for:
- Frontend framework
- Backend framework
- Database
- [Other components]

My constraints are:
- Team experience: [your skill level]
- Project timeline: [timeframe]
- Scalability needs: [small/medium/large]

Please compare 2-3 options for each component and recommend the best fit, explaining why.

```

### **Reference Materials**

- Review prerequisite resources for each TS domain
- Research documentation:
    - Frontend: React.dev, Vite.dev
    - Backend: Node.js docs, Fastify/Express
    - Database: PostgreSQL docs

### **Deliverable: Technology Decision Document**

```markdown
## Frontend**Chosen:** React + Vite
**Alternatives Considered:** Vue, Svelte
**Justification:** [Why you chose this]
**Learning Resources:**- [Link 1]
- [Link 2]

## Backend**Chosen:** Node.js + Express
[Repeat structure]

## Database**Chosen:** PostgreSQL
[Repeat structure]

```

---

### **Step 2.3: Document User Stories & Features**

**Activities:**

- Write user stories for main features
- Prioritize features (MVP vs. Nice-to-have)
- Define acceptance criteria

**AI Prompt Template:**

```
For my application: [DESCRIBE APP]

Help me create user stories for these features:
1. [Feature 1]
2. [Feature 2]
3. [Feature 3]

For each feature, provide:
- User story format: "As a [user type], I want [action] so that [benefit]"
- Acceptance criteria (what must be true when it's done)
- Priority level (MVP, Important, Nice-to-have)

```

### **Deliverable: Feature Specification Document**

```markdown
## Feature 1: [Name]**User Story:** As a [user], I want [action] so that [benefit]

**Priority:** MVP / Important / Nice-to-have

**Acceptance Criteria:**- [ ] [Specific testable requirement 1]
- [ ] [Specific testable requirement 2]
- [ ] [Specific testable requirement 3]

**Technical Notes:**- [What components are involved]
- [Any special considerations]

## Feature 2: [Name]
[Repeat structure]

```

---

### **Step 2.4: Define Data Models**

**Activities:**

- Identify all data entities
- Define relationships between entities
- Plan database schema

**AI Prompt Template:**

```
For my application: [DESCRIBE APP]

I need to store information about: [LIST MAIN ENTITIES]

Help me:
1. Identify all the data entities I need
2. List the attributes for each entity
3. Define relationships between entities (one-to-one, one-to-many, many-to-many)
4. Suggest a database schema

Please provide this in a clear format with explanations.

```

### **Reference**

Review TS.4.1 (Create a data structure) competency

### **Deliverable: Data Model Document**

```markdown
## Entity 1: User**Attributes:**- id (Primary Key, UUID)
- email (String, Unique, Required)
- password (String, Hashed, Required)
- createdAt (Timestamp)

**Relationships:**- Has many: Projects
- Has many: Tasks (through Projects)

## Entity 2: Project**Attributes:**- id (Primary Key, UUID)
- name (String, Required)
- description (Text)
- userId (Foreign Key → User)
- createdAt (Timestamp)

**Relationships:**- Belongs to: User
- Has many: Tasks

## Schema Diagram
```

User (1) ──→ (Many) Project (1) ──→ (Many) Task

```

```

---

### **✅ Phase 2 Checkpoint**

**Before moving to Phase 3, you should have:**

- [ ]  Technical Glossary with key terms defined
- [ ]  Technology Stack documented with justifications
- [ ]  Feature Specifications with user stories
- [ ]  Data Model with entities and relationships

**Self-Assessment Questions:**

1. Can you explain your technology choices to someone else?
2. Do you understand the key concepts you'll be working with?
3. Can you describe your database schema without looking at the document?
4. Do you know which features are MVP vs stretch goals?