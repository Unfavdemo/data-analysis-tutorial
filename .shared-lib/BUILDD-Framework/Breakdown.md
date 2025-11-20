# Phase 1 = **BREAK DOWN the Problem**

## **🎯 Overview: The BUILDD Framework**

This guide helps you transform any business problem into a working technology solution using AI as your development partner. Each phase includes specific activities, AI prompts, and deliverables.

---

# **Phase 1: BREAK DOWN the Problem**

## **Objective**

Decompose the business problem into technical components, identify requirements, and map the system architecture.

---

## **Step 1.1: Understand the Business Context**

### **Activities**

- Read the business case/problem statement carefully
- Identify the target audience and their pain points
- Define success criteria

### **AI Prompt Template**

```
I'm working on a business problem: [DESCRIBE PROBLEM]

Help me understand:
1. Who are the primary users/stakeholders?
2. What are the main pain points this solves?
3. What would success look like for this solution?
4. What are potential risks or constraints?

```

### **Deliverable: Business Context Document**

```markdown
# Business Context## Problem Statement
[One paragraph describing the problem]

## Target Audience- Primary users: [who they are]
- Secondary stakeholders: [who else is affected]

## Pain Points1. [Current problem 1]
2. [Current problem 2]

## Success Criteria- [Measurable outcome 1]
- [Measurable outcome 2]

## Constraints- Budget: [if applicable]
- Timeline: [if applicable]
- Technical: [any limitations]

```

---

## **Step 1.2: Identify Core Components**

### **Activities**

- Break the solution into logical services/layers
- Identify what components you need (Frontend, Backend, Database, etc.)
- Determine component responsibilities

### **AI Prompt Template**

```
For this application: [DESCRIBE YOUR APP]

Help me identify:
1. What are the main components/services needed? (Frontend, Backend, Database, etc.)
2. What are the responsibilities of each component?
3. Which components need to communicate with each other?
4. Are there any external services we should consider? (Auth, Storage, Email, etc.)

Please provide this in a structured format.

```

### **Example Reference**

Use the ProjectForge case study structure:

- Frontend (User Interface)
- Backend API (Business Logic)
- Database (Data Persistence)
- Cache (Performance)
- Authentication (Security)
- File Storage (Media Management)

### **Deliverable: Component Architecture Document**

```markdown
# System Components## Component 1: [Name]**Type:** Frontend/Backend/Database/Service
**Technology:** [Suggested tech stack]
**Responsibilities:**- [What it does 1]
- [What it does 2]

**Interfaces:**- Receives from: [component name]
- Sends to: [component name]

## Component 2: [Name]
[Repeat structure]

## External Services- [Service name]: [purpose]

```

---

## **Step 1.3: Map Dependencies & Data Flow**

### **Activities**

- Create a dependency diagram
- Map how data flows through the system
- Identify critical paths

### **AI Prompt Template**

```
Based on these components: [LIST YOUR COMPONENTS]

Help me create:
1. A dependency map showing which components depend on others
2. The data flow for key user actions like: [LIST KEY ACTIONS]
3. Critical paths that must work for the app to function

Please format this as a textual diagram I can visualize.

```

### **Deliverable: Architecture Diagram (Text or Visual)**

```
User Browser
    ↓
Frontend (React)
    ↓ (API calls)
Backend API (Node.js)
    ↓ (queries)
Database (PostgreSQL)
    ↑ (cached data)
Cache (Redis)

```

### **Reference Materials**

- Review: "Requirement Gathering Sample - NixOS" for architecture decomposition
- Example: Online photo gallery exercise (Document 2)

---

## **✅ Phase 1 Checkpoint**

### **Before moving to Phase 2, you should have:**

- [ ]  Business Context Document
- [ ]  Component Architecture Document
- [ ]  Dependency/Data Flow Diagram
- [ ]  Clear understanding of what you're building

### **Self-Assessment Questions**

1. Can you explain each component's purpose in one sentence?
2. Do you know what technologies you'll use for each layer?
3. Can you describe how data flows through the system?
4. Do you have a clear picture of the overall architecture?