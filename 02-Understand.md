# **Phase U: Understand & Document**

## **Objective**
Define technical terms, document your understanding, and create clear specifications before writing code.

**Estimated Time:** 30 minutes

---

## **Step U.1: Define Technical Terms**

### **Activities**
- List unfamiliar technologies and concepts
- Get clear definitions for each term
- Understand how they relate to your project

### **AI Prompt Template**

```
I'm building a support ticket system with AI categorization using Next.js 14 (App Router), PostgreSQL with Prisma, and OpenAI API.

I need clear definitions for these terms/concepts in the context of my project:
1. Next.js App Router
2. API Routes in Next.js
3. Prisma ORM
4. Server Components vs Client Components
5. RESTful API
6. CRUD operations
7. PostgreSQL relations (one-to-many)
8. OpenAI API integration

For each term, explain:
- What it is (simple definition)
- Why it's relevant to my project
- A simple example in my context
```

### **Deliverable: Technical Glossary**

Create `TECHNICAL_GLOSSARY.md`:

```markdown
# Technical Glossary

## Next.js App Router
**Definition:** The modern routing system in Next.js 14+ that uses a file-based structure in the `app/` directory with support for layouts, loading states, and Server Components.

**Relevance:** We'll use App Router to create our ticket dashboard pages and API routes in a single framework.

**Example:** `/app/dashboard/page.tsx` creates a route at `/dashboard`

**Resources:**
- https://nextjs.org/docs/app
- https://nextjs.org/docs/app/building-your-application/routing

---

## API Routes in Next.js
**Definition:** Server-side endpoints created in Next.js that handle HTTP requests (GET, POST, PATCH, DELETE) without needing a separate backend framework.

**Relevance:** We'll create API routes to handle ticket creation, retrieval, and updates - all within our Next.js app.

**Example:** `/app/api/tickets/route.ts` creates an endpoint at `/api/tickets`

**Resources:**
- https://nextjs.org/docs/app/building-your-application/routing/route-handlers

---

## Prisma ORM
**Definition:** Object-Relational Mapping tool that lets you define your database schema in code and interact with the database using JavaScript/TypeScript instead of raw SQL.

**Relevance:** We'll use Prisma to define our ticket schema and perform database operations without writing SQL queries.

**Example:** 
```typescript
const ticket = await prisma.ticket.create({
  data: { title: "Login issue", status: "open" }
})
```

**Resources:**
- https://www.prisma.io/docs
- https://www.prisma.io/docs/getting-started

---

## Server Components vs Client Components
**Definition:** 
- **Server Components:** React components that render on the server, don't include JavaScript in the browser, and can directly access databases
- **Client Components:** Traditional React components that run in the browser, can use hooks and interactivity

**Relevance:** Our ticket list can be a Server Component (fetches data on server), while our ticket form must be a Client Component (needs user interaction).

**Example:**
```typescript
// Server Component (default in App Router)
async function TicketList() {
  const tickets = await prisma.ticket.findMany()
  return <div>{/* render tickets */}</div>
}

// Client Component (needs 'use client' directive)
'use client'
function TicketForm() {
  const [title, setTitle] = useState('')
  return <form>{/* interactive form */}</form>
}
```

**Resources:**
- https://nextjs.org/docs/app/building-your-application/rendering/server-components
- https://react.dev/reference/react/use-client

---

## RESTful API
**Definition:** Architectural style for APIs that uses standard HTTP methods (GET, POST, PATCH, DELETE) and follows predictable URL patterns.

**Relevance:** Our API routes will follow REST principles: GET /api/tickets (list), POST /api/tickets (create), PATCH /api/tickets/:id (update).

**Example:**
- GET /api/tickets → Returns all tickets
- POST /api/tickets → Creates a new ticket
- PATCH /api/tickets/123 → Updates ticket with ID 123

**Resources:**
- https://restfulapi.net/

---

## CRUD Operations
**Definition:** Create, Read, Update, Delete - the four basic operations for managing data in any application.

**Relevance:** We'll implement all four CRUD operations for tickets: Create (new ticket), Read (list/view), Update (change status), Delete (optional).

**Example:**
- **Create:** Submit ticket form
- **Read:** View ticket list
- **Update:** Change ticket status to "Resolved"
- **Delete:** Remove spam tickets

---

## PostgreSQL Relations (One-to-Many)
**Definition:** Database relationship where one record in Table A can relate to multiple records in Table B. Example: One ticket can have many comments.

**Relevance:** Our data model will use one-to-many: one ticket → many comments, one user → many tickets.

**Example:**
```prisma
model Ticket {
  id       String    @id @default(uuid())
  title    String
  comments Comment[] // one ticket has many comments
}

model Comment {
  id       String @id @default(uuid())
  text     String
  ticketId String
  ticket   Ticket @relation(fields: [ticketId], references: [id])
}
```

**Resources:**
- https://www.prisma.io/docs/concepts/components/prisma-schema/relations

---

## OpenAI API Integration
**Definition:** Connecting to OpenAI's API to send prompts and receive AI-generated responses, used for text analysis, categorization, and generation.

**Relevance:** We'll send ticket title and description to OpenAI and receive back the suggested category and priority level.

**Example:**
```typescript
const response = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [{
    role: "user",
    content: "Categorize this ticket: My password reset email isn't arriving"
  }]
})
```

**Resources:**
- https://platform.openai.com/docs/api-reference
- https://platform.openai.com/docs/guides/text-generation
```

---

## **Step U.2: Research Technology Stack**

### **Activities**
- Research recommended technologies for each component
- Understand trade-offs between options
- Document your technology choices

### **AI Prompt Template**

```
For my support ticket system, I need to choose technologies for:
- Frontend framework
- Backend framework
- Database
- AI integration

My constraints are:
- Team experience: Beginner with HTML/CSS/JS, minimal React knowledge
- Project timeline: 2.5 hours for MVP
- Scalability needs: Start small, 50-100 tickets initially

Please compare 2-3 options for each component and recommend the best fit, explaining why.
```

### **Deliverable: Technology Decision Document**

Create `TECH_STACK.md`:

```markdown
# Technology Stack Decisions

## Frontend
**Chosen:** Next.js 14 (App Router) + React + TailwindCSS

**Alternatives Considered:**
- Plain React with Vite: Requires separate backend
- Vue.js: Less common in job market

**Justification:**
- Next.js provides both frontend and backend in one framework
- App Router simplifies routing and data fetching
- TailwindCSS enables fast UI development
- Large community and extensive documentation
- Industry-standard for full-stack React apps

**Learning Resources:**
- https://nextjs.org/learn
- https://tailwindcss.com/docs

---

## Backend
**Chosen:** Next.js API Routes

**Alternatives Considered:**
- Express.js: Separate server, more complex setup
- Fastify: Less beginner-friendly

**Justification:**
- Built into Next.js - no additional setup
- Serverless-ready (works on Vercel)
- TypeScript support out of the box
- Simplified deployment

**Learning Resources:**
- https://nextjs.org/docs/app/building-your-application/routing/route-handlers

---

## Database
**Chosen:** PostgreSQL with Prisma ORM

**Alternatives Considered:**
- MongoDB: NoSQL might be overkill, less structure
- SQLite: Not suitable for production deployment

**Justification:**
- PostgreSQL is reliable, industry-standard
- Prisma simplifies database operations
- Strong typing with TypeScript
- Easy migrations and schema changes
- Free tier available (Supabase, Neon)

**Learning Resources:**
- https://www.prisma.io/docs/getting-started
- https://www.postgresql.org/docs/

---

## AI Integration
**Chosen:** OpenAI API (GPT-4)

**Alternatives Considered:**
- Anthropic Claude: Similar but less beginner docs
- Open-source models: Require hosting/setup

**Justification:**
- Best documentation for beginners
- Reliable categorization accuracy
- Free tier available ($5 credit)
- Simple REST API integration
- Industry standard for AI features

**Learning Resources:**
- https://platform.openai.com/docs/quickstart
- https://platform.openai.com/docs/guides/text-generation

---

## Development Tools
- **Version Control:** Git + GitHub
- **Package Manager:** npm
- **Code Editor:** VS Code
- **API Testing:** Thunder Client (VS Code extension) or Postman
- **Database Client:** Prisma Studio (built-in)
```

---

## **Step U.3: Document User Stories & Features**

### **Activities**
- Write user stories for main features
- Prioritize features (MVP vs. Nice-to-have)
- Define acceptance criteria

### **AI Prompt Template**

```
For my application: A support ticket system with AI categorization

Help me create user stories for these features:
1. Customer submits a support ticket
2. AI categorizes the ticket automatically
3. Support agent views all tickets
4. Support agent updates ticket status
5. Customer views their ticket status

For each feature, provide:
- User story format: "As a [user type], I want [action] so that [benefit]"
- Acceptance criteria (what must be true when it's done)
- Priority level (MVP, Important, Nice-to-have)
```

### **Deliverable: Feature Specification Document**

Create `FEATURES.md`:

```markdown
# Feature Specifications

## Feature 1: Submit Support Ticket
**User Story:** As a customer, I want to submit a support ticket with my issue so that I can get help from the support team.

**Priority:** MVP

**Acceptance Criteria:**
- [ ] Form includes fields: title (required), description (required), email (required)
- [ ] Form validates email format before submission
- [ ] Success message displays after submission
- [ ] Ticket is saved to database with a unique ID
- [ ] AI categorization happens automatically on submission

**Technical Notes:**
- Client Component (needs form interactivity)
- POST request to `/api/tickets`
- Form validation using HTML5 + custom logic

---

## Feature 2: AI Auto-Categorization
**User Story:** As a support system, I want to automatically categorize tickets so that they route to the correct department without manual work.

**Priority:** MVP

**Acceptance Criteria:**
- [ ] System sends ticket title and description to OpenAI
- [ ] AI returns category (Technical, Billing, Account, General)
- [ ] AI returns priority (Low, Medium, High, Urgent)
- [ ] Category and priority are saved with the ticket
- [ ] Process completes in under 5 seconds

**Technical Notes:**
- Happens in backend API route
- Error handling if OpenAI is unavailable (default to "General" category)
- Consider caching similar tickets to reduce API calls

---

## Feature 3: View All Tickets (Agent Dashboard)
**User Story:** As a support agent, I want to view all tickets in one place so that I can prioritize and manage my workload.

**Priority:** MVP

**Acceptance Criteria:**
- [ ] Dashboard displays all tickets in a table/card layout
- [ ] Each ticket shows: ID, title, status, priority, category, created date
- [ ] Tickets are sorted by created date (newest first)
- [ ] Status is color-coded (Open=blue, In Progress=yellow, Resolved=green, Closed=gray)
- [ ] Clicking a ticket opens detail view

**Technical Notes:**
- Server Component (can fetch data on server)
- GET request to `/api/tickets`
- Use TailwindCSS for status badges

---

## Feature 4: Update Ticket Status
**User Story:** As a support agent, I want to update a ticket's status so that customers know I'm working on their issue.

**Priority:** MVP

**Acceptance Criteria:**
- [ ] Status dropdown with options: Open, In Progress, Resolved, Closed
- [ ] Clicking a new status saves immediately
- [ ] Success message confirms the update
- [ ] Ticket list refreshes to show new status
- [ ] Status change is recorded in database

**Technical Notes:**
- Client Component (needs interactivity)
- PATCH request to `/api/tickets/:id`
- Optimistic UI update before server confirms

---

## Feature 5: View Ticket Status (Customer)
**User Story:** As a customer, I want to check my ticket status so that I know if my issue is being addressed.

**Priority:** Important (not MVP, but high value)

**Acceptance Criteria:**
- [ ] Customer can enter ticket ID or email to find their tickets
- [ ] Page displays ticket details and current status
- [ ] Page shows any comments from support agents
- [ ] No login required (public access by ticket ID)

**Technical Notes:**
- Server Component
- GET request to `/api/tickets/:id` or `/api/tickets?email=...`
- Consider adding basic access control (ticket ID + email verification)

---

## Feature 6: Add Comments/Replies (Stretch)
**User Story:** As a support agent, I want to add comments to tickets so that I can communicate with customers and keep notes.

**Priority:** Nice-to-have

**Acceptance Criteria:**
- [ ] Comment form appears on ticket detail page
- [ ] Comments display in chronological order
- [ ] Each comment shows author name and timestamp
- [ ] Comments are saved to database with ticket relationship

**Technical Notes:**
- Client Component for form
- POST request to `/api/tickets/:id/comments`
- One-to-many relationship: Ticket → Comments

---

## Feature 7: Search and Filter (Stretch)
**User Story:** As a support agent, I want to search and filter tickets so that I can quickly find specific issues.

**Priority:** Nice-to-have

**Acceptance Criteria:**
- [ ] Search bar filters by title and description
- [ ] Filter dropdowns for status, category, priority
- [ ] Results update in real-time as filters change
- [ ] "Clear filters" button resets to show all tickets

**Technical Notes:**
- Client Component with state management
- Could be client-side filtering (fast) or server-side (scalable)
- Consider URL query params for shareable filtered views
```

---

## **Step U.4: Define Data Models**

### **Activities**
- Identify all data entities
- Define relationships between entities
- Plan database schema

### **AI Prompt Template**

```
For my application: Support ticket system with AI categorization

I need to store information about: tickets, users (optional for MVP), comments (optional)

Help me:
1. Identify all the data entities I need
2. List the attributes for each entity
3. Define relationships between entities (one-to-one, one-to-many, many-to-many)
4. Suggest a database schema

Please provide this in a clear format with explanations.
```

### **Deliverable: Data Model Document**

Create `DATA_MODEL.md`:

```markdown
# Data Model & Schema

## Entity 1: Ticket
**Purpose:** Stores all support ticket information

**Attributes:**
- `id` (String, UUID, Primary Key) - Unique identifier
- `title` (String, Required) - Brief description of issue
- `description` (Text, Required) - Detailed explanation
- `email` (String, Required) - Customer contact email
- `status` (Enum, Default: "OPEN") - Current ticket state
  - Options: OPEN, IN_PROGRESS, RESOLVED, CLOSED
- `priority` (Enum, Default: "MEDIUM") - Urgency level (AI-suggested)
  - Options: LOW, MEDIUM, HIGH, URGENT
- `category` (Enum, Default: "GENERAL") - Issue type (AI-suggested)
  - Options: TECHNICAL, BILLING, ACCOUNT, GENERAL
- `createdAt` (DateTime, Auto-generated) - When ticket was created
- `updatedAt` (DateTime, Auto-updated) - Last modification time

**Relationships:**
- Has many: Comments (one-to-many) [OPTIONAL FOR MVP]

---

## Entity 2: Comment [OPTIONAL - Stretch Feature]
**Purpose:** Stores replies and notes on tickets

**Attributes:**
- `id` (String, UUID, Primary Key) - Unique identifier
- `text` (Text, Required) - Comment content
- `author` (String, Required) - Name of person commenting
- `ticketId` (String, Foreign Key) - References Ticket.id
- `createdAt` (DateTime, Auto-generated) - When comment was added

**Relationships:**
- Belongs to: Ticket (many-to-one)

---

## Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Ticket {
  id          String   @id @default(uuid())
  title       String
  description String   @db.Text
  email       String
  status      Status   @default(OPEN)
  priority    Priority @default(MEDIUM)
  category    Category @default(GENERAL)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Optional: one-to-many relationship with comments
  comments    Comment[]
}

enum Status {
  OPEN
  IN_PROGRESS
  RESOLVED
  CLOSED
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum Category {
  TECHNICAL
  BILLING
  ACCOUNT
  GENERAL
}

// Optional for MVP
model Comment {
  id        String   @id @default(uuid())
  text      String   @db.Text
  author    String
  ticketId  String
  ticket    Ticket   @relation(fields: [ticketId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
}
```

---

## Schema Diagram

```
┌─────────────────────────────────────┐
│            Ticket                    │
├─────────────────────────────────────┤
│ id: UUID (PK)                       │
│ title: String                       │
│ description: Text                   │
│ email: String                       │
│ status: Enum (OPEN, IN_PROGRESS...) │
│ priority: Enum (LOW, MEDIUM...)     │
│ category: Enum (TECHNICAL...)       │
│ createdAt: DateTime                 │
│ updatedAt: DateTime                 │
└─────────────────────────────────────┘
             │
             │ 1:Many (optional)
             ▼
┌─────────────────────────────────────┐
│           Comment                    │
├─────────────────────────────────────┤
│ id: UUID (PK)                       │
│ text: Text                          │
│ author: String                      │
│ ticketId: UUID (FK)                 │
│ createdAt: DateTime                 │
└─────────────────────────────────────┘
```

---

## Sample Data (for testing)

```sql
-- Sample tickets
INSERT INTO "Ticket" (id, title, description, email, status, priority, category) VALUES
('123e4567-e89b-12d3-a456-426614174000', 'Cannot login to account', 'I keep getting error "Invalid credentials" even though my password is correct', 'john@example.com', 'OPEN', 'HIGH', 'TECHNICAL'),
('123e4567-e89b-12d3-a456-426614174001', 'Billing charge incorrect', 'I was charged twice this month', 'jane@example.com', 'IN_PROGRESS', 'URGENT', 'BILLING'),
('123e4567-e89b-12d3-a456-426614174002', 'How do I change my email?', 'Need to update my contact email', 'bob@example.com', 'RESOLVED', 'LOW', 'ACCOUNT');
```

---

## **✅ Phase U Checkpoint**

### **Before moving to Phase I, you should have:**

- [ ] Technical Glossary with 8+ key terms defined (`TECHNICAL_GLOSSARY.md`)
- [ ] Technology Stack documented with justifications (`TECH_STACK.md`)
- [ ] Feature Specifications with user stories (`FEATURES.md`)
- [ ] Data Model with entities and Prisma schema (`DATA_MODEL.md`)

### **Self-Assessment Questions**

1. Can you explain your technology choices to someone else?
2. Do you understand the key concepts you'll be working with?
3. Can you describe your database schema without looking at the document?
4. Do you know which features are MVP vs stretch goals?