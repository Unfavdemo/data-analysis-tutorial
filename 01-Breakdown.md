# 🎯 Customer Support Ticket System with AI Triage
## Complete BUILDD Framework Challenge

**Duration:** 2.5-3 hours  
**Target Audience:** Students with HTML/CSS/JavaScript foundations, minimal React/Next.js experience  
**Age Group:** 18-21  
**Competencies Covered:** TS.2 (Frontend), TS.3 (Backend), TS.4 (Database), TS.6 (AI Integration)

---

## 📋 Project Overview

### **Business Problem**
Support teams are overwhelmed with tickets that need categorization, prioritization, and routing to the right departments. Manual triage is slow, inconsistent, and prevents quick resolution of urgent issues.

### **Your Solution**
Build a Next.js full-stack application that:
- Allows customers to submit support tickets
- Uses AI to automatically categorize and prioritize tickets
- Provides a dashboard for support agents to manage tickets
- Updates ticket status in real-time

### **Tech Stack**
- **Frontend:** Next.js 14 (App Router), React, TailwindCSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL with Prisma ORM
- **AI:** OpenAI API (GPT-4)
- **Deployment:** Vercel (optional)

---

## 🎯 MVP Features (Must Have)

✅ **Ticket Creation**
- Form with title, description, contact email
- AI auto-categorizes (Technical, Billing, Account, General)
- AI suggests priority (Low, Medium, High, Urgent)

✅ **Ticket Management**
- View all tickets in a list
- Filter by status (Open, In Progress, Resolved, Closed)
- Update ticket status
- Add comments/replies to tickets

✅ **Dashboard**
- Display ticket counts by status
- Show recent tickets
- Basic search functionality

---

## 🚀 Stretch Features (If Time Permits)

🎯 File attachments for tickets  
🎯 Email notifications on status change  
🎯 Agent assignment system  
🎯 Ticket analytics (response time, resolution rate)  
🎯 Real-time updates with WebSocket

---

# 📚 BUILDD Framework Implementation

---

# **Phase B: BREAK DOWN the Problem**

## **Objective**
Decompose the support ticket system into technical components, identify requirements, and map the system architecture.

**Estimated Time:** 45 minutes

---

## **Step B.1: Understand the Business Context**

### **Activities**
- Read the business problem statement
- Identify the target audience and their pain points
- Define success criteria

### **AI Prompt Template**

```
I'm working on a business problem: Support teams are overwhelmed with tickets that need categorization, prioritization, and routing to the right departments. Manual triage is slow and prevents quick resolution.

Help me understand:
1. Who are the primary users/stakeholders?
2. What are the main pain points this solves?
3. What would success look like for this solution?
4. What are potential risks or constraints?
```

### **Deliverable: Business Context Document**

Create a markdown file `BUSINESS_CONTEXT.md`:

```markdown
# Business Context

## Problem Statement
Support teams manually categorize and prioritize tickets, leading to slow response times and inconsistent handling of urgent issues.

## Target Audience
- Primary users: Support agents who need to manage and resolve tickets efficiently
- Secondary stakeholders: Customers submitting tickets, managers tracking team performance

## Pain Points
1. Manual categorization is time-consuming and error-prone
2. Urgent tickets get lost in the queue
3. No consistent priority system
4. Difficult to track ticket status

## Success Criteria
- AI categorizes tickets with 80%+ accuracy
- Average ticket response time reduced by 40%
- Support agents can update 50+ tickets per day
- Customers can track their ticket status

## Constraints
- Budget: Free tier APIs (OpenAI, Database hosting)
- Timeline: 2.5 hours for MVP
- Technical: Must work on localhost, optional deployment
```

---

## **Step B.2: Identify Core Components**

### **Activities**
- Break the solution into logical services/layers
- Identify what components you need (Frontend, Backend, Database, etc.)
- Determine component responsibilities

### **AI Prompt Template**

```
For this application: A support ticket system where customers submit tickets, AI categorizes them, and agents manage them.

Help me identify:
1. What are the main components/services needed? (Frontend, Backend, Database, etc.)
2. What are the responsibilities of each component?
3. Which components need to communicate with each other?
4. Are there any external services we should consider? (Auth, Storage, Email, etc.)

Please provide this in a structured format.
```

### **Deliverable: Component Architecture Document**

Create `ARCHITECTURE.md`:

```markdown
# System Components

## Component 1: Frontend (User Interface)
**Type:** Client-side React/Next.js Application  
**Technology:** Next.js 14 (App Router), React, TailwindCSS  
**Responsibilities:**
- Display ticket creation form
- Render ticket list with filtering
- Show ticket details and status updates
- Provide agent dashboard

**Interfaces:**
- Receives from: Backend API (ticket data)
- Sends to: Backend API (form submissions, status updates)

## Component 2: Backend API (Business Logic)
**Type:** Server-side API  
**Technology:** Next.js API Routes  
**Responsibilities:**
- Handle ticket CRUD operations
- Process AI categorization requests
- Validate and sanitize input data
- Return formatted responses

**Interfaces:**
- Receives from: Frontend (HTTP requests)
- Sends to: Database (queries), OpenAI API (categorization)

## Component 3: Database (Data Persistence)
**Type:** Relational Database  
**Technology:** PostgreSQL with Prisma ORM  
**Responsibilities:**
- Store ticket information
- Store user/agent information
- Maintain ticket status history
- Store comments/replies

**Interfaces:**
- Receives from: Backend API (SQL queries via Prisma)
- Sends to: Backend API (query results)

## Component 4: AI Service (Categorization)
**Type:** External API  
**Technology:** OpenAI API (GPT-4)  
**Responsibilities:**
- Analyze ticket title and description
- Categorize ticket (Technical, Billing, Account, General)
- Suggest priority level (Low, Medium, High, Urgent)
- Return categorization with confidence scores

**Interfaces:**
- Receives from: Backend API (ticket text)
- Sends to: Backend API (category and priority)

## External Services
- **OpenAI API:** AI categorization and priority suggestion
- **Vercel (optional):** Deployment platform
```

---

## **Step B.3: Map Dependencies & Data Flow**

### **Activities**
- Create a dependency diagram
- Map how data flows through the system
- Identify critical paths

### **AI Prompt Template**

```
Based on these components: Frontend (Next.js), Backend API (Next.js API Routes), Database (PostgreSQL with Prisma), AI Service (OpenAI API)

Help me create:
1. A dependency map showing which components depend on others
2. The data flow for key user actions like: creating a ticket, viewing all tickets, updating ticket status
3. Critical paths that must work for the app to function

Please format this as a textual diagram I can visualize.
```

### **Deliverable: Architecture Diagram**

Create `DATA_FLOW.md`:

```markdown
# System Architecture & Data Flow

## Component Dependencies

```
User Browser
    ↓ (HTTP requests)
Frontend (Next.js Client Components)
    ↓ (API calls)
Backend API (Next.js API Routes)
    ↓ (queries)                    ↓ (API calls)
Database (PostgreSQL + Prisma)    OpenAI API
```

## Data Flow: Create Ticket

1. **User submits form** (title, description, email)
   - Frontend validates input
   - POST request to `/api/tickets`

2. **Backend receives request**
   - Validates data
   - Sends title + description to OpenAI API
   - Receives category and priority

3. **Database stores ticket**
   - INSERT new ticket with AI-generated metadata
   - Returns ticket ID

4. **Frontend updates**
   - Shows success message
   - Redirects to ticket detail page

## Data Flow: View Tickets

1. **User visits dashboard**
   - Frontend loads `/dashboard` page
   - GET request to `/api/tickets`

2. **Backend queries database**
   - SELECT all tickets (or filtered)
   - Returns JSON array

3. **Frontend renders list**
   - Maps through tickets
   - Displays in table/card format

## Data Flow: Update Ticket Status

1. **Agent clicks status dropdown**
   - Selects new status
   - PATCH request to `/api/tickets/:id`

2. **Backend updates database**
   - UPDATE ticket status
   - Returns updated ticket

3. **Frontend re-renders**
   - Shows new status
   - Updates counts

## Critical Paths (Must Work)

✅ **Path 1:** User → Form → Backend → OpenAI → Database → Success  
✅ **Path 2:** Agent → Dashboard → Backend → Database → Ticket List  
✅ **Path 3:** Agent → Status Update → Backend → Database → Confirmation
```

---

## **✅ Phase B Checkpoint**

### **Before moving to Phase U, you should have:**

- [ ] Business Context Document (`BUSINESS_CONTEXT.md`)
- [ ] Component Architecture Document (`ARCHITECTURE.md`)
- [ ] Data Flow Diagram (`DATA_FLOW.md`)
- [ ] Clear understanding of what you're building

### **Self-Assessment Questions**

1. Can you explain each component's purpose in one sentence?
2. Do you know what technologies you'll use for each layer?
3. Can you trace the data flow for creating a ticket?



