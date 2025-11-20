# **Phase I: INTERROGATE AI Tools**

## **Objective**
Strategically use AI to generate code, solve problems, and learn best practices while maintaining understanding.

**Estimated Time:** Ongoing throughout Phase L (integrated into implementation)

---

## **Step I.1: Set Up Development Environment**

### **Activities**
- Create project structure
- Initialize tools (Git, package managers)
- Set up development dependencies

### **AI Prompt Template**

```
I'm starting a Next.js 14 project using:
- Frontend: Next.js 14 (App Router), React, TailwindCSS
- Backend: Next.js API Routes
- Database: PostgreSQL with Prisma ORM

Help me:
1. Create a recommended folder structure
2. List all the dependencies I need to install
3. Provide the initialization commands
4. Create a basic .gitignore file
5. Suggest environment variables I'll need

Please provide step-by-step commands I can run.
```

### **Deliverable: Initialized Project Repository**

**Expected AI Response Will Guide You To:**

```bash
# 1. Create Next.js project with TypeScript and TailwindCSS
npx create-next-app@latest ticket-system --typescript --tailwind --app --no-src-dir

cd ticket-system

# 2. Install Prisma and database dependencies
npm install prisma @prisma/client
npm install -D prisma

# 3. Initialize Prisma
npx prisma init

# 4. Install OpenAI SDK
npm install openai

# 5. Install additional utilities
npm install zod  # For validation
npm install date-fns  # For date formatting
```

**Folder Structure:**
```
ticket-system/
├── app/
│   ├── api/
│   │   └── tickets/
│   │       └── route.ts
│   ├── dashboard/
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── TicketForm.tsx
│   ├── TicketList.tsx
│   └── TicketCard.tsx
├── lib/
│   ├── prisma.ts
│   └── openai.ts
├── prisma/
│   └── schema.prisma
├── .env
├── .env.example
├── .gitignore
├── package.json
└── tsconfig.json
```

**Environment Variables (`.env`):**
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ticketdb"

# OpenAI
OPENAI_API_KEY="sk-your-api-key-here"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Create `.env.example` for documentation:**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/ticketdb"
OPENAI_API_KEY="your-openai-api-key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## **Step I.2: Generate Boilerplate Code with Understanding**

### **AI Prompt Templates for Each Component**

**⚠️ CRITICAL RULE: Never use AI-generated code without understanding it!**

Before using any generated code, ask:

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

### **I.2.1: Database Setup**

**AI Prompt:**

```
Create a Prisma schema for a support ticket system with these requirements:
- Ticket model with: id (UUID), title (String), description (Text), email (String), status (Enum: OPEN/IN_PROGRESS/RESOLVED/CLOSED), priority (Enum: LOW/MEDIUM/HIGH/URGENT), category (Enum: TECHNICAL/BILLING/ACCOUNT/GENERAL), timestamps
- Use PostgreSQL
- Include proper indexes for performance

Provide:
1. Complete prisma/schema.prisma file
2. Commands to run migrations
3. Sample seed data

Explain why you structured it this way.
```

**After receiving the code, ask:**

```
Explain this Prisma schema to me:
[PASTE SCHEMA]

Why did you:
1. Use UUID instead of auto-increment ID?
2. Use @db.Text for description?
3. Choose these specific enums?
4. Add @updatedAt to updatedAt field?
```

---

### **I.2.2: API Route - Create Ticket**

**AI Prompt:**

```
Create a Next.js 14 API route for creating support tickets that:
- Method: POST
- Accepts: title, description, email
- Validates input (all fields required, email format)
- Calls OpenAI to categorize the ticket
- Saves to database using Prisma
- Returns: created ticket with AI-generated category and priority

Include:
1. Input validation with error messages
2. Error handling for OpenAI and database
3. Proper HTTP status codes
4. TypeScript types
5. Comments explaining key sections

File: app/api/tickets/route.ts
```

**After receiving the code, ask:**

```
Walk me through this API route step-by-step:
[PASTE CODE]

Explain:
1. Why use NextRequest and NextResponse?
2. How does error handling work with try-catch?
3. What happens if OpenAI API fails?
4. Why validate input before calling external services?
```

---

### **I.2.3: API Route - Get All Tickets**

**AI Prompt:**

```
Create a Next.js 14 API route for fetching all tickets that:
- Method: GET
- Returns: array of all tickets sorted by createdAt (newest first)
- Includes optional filtering by status (query param)
- Uses Prisma to query database

Include:
1. Error handling
2. Proper HTTP status codes
3. TypeScript types
4. Comments

File: app/api/tickets/route.ts (add GET handler to same file)
```

---

### **I.2.4: API Route - Update Ticket Status**

**AI Prompt:**

```
Create a Next.js 14 API route for updating ticket status that:
- Method: PATCH
- Accepts: status (OPEN, IN_PROGRESS, RESOLVED, CLOSED)
- URL: /api/tickets/[id]
- Validates status is a valid enum value
- Updates ticket in database
- Returns: updated ticket

Include:
1. Validation for status enum
2. Error handling if ticket not found
3. Proper HTTP status codes
4. TypeScript types

File: app/api/tickets/[id]/route.ts
```

---

### **I.2.5: Frontend - Ticket Form Component**

**AI Prompt:**

```
Create a React component for submitting support tickets that:
- Fields: title (text input), description (textarea), email (email input)
- Client-side validation (all required, email format)
- Loading state during submission
- Success/error messages
- Clears form after successful submission
- Uses TailwindCSS for styling
- Calls POST /api/tickets

Include:
1. useState for form fields and UI state
2. Form submission handler with error handling
3. Accessibility (labels, aria attributes)
4. Comments explaining key parts

Use TypeScript and 'use client' directive.
File: components/TicketForm.tsx
```

**After receiving the code, ask:**

```
Explain this form component:
[PASTE CODE]

Why:
1. Use 'use client' at the top?
2. Use e.preventDefault() in onSubmit?
3. Use separate state variables for loading and error?
4. Clear the form after submission?
```

---

### **I.2.6: Frontend - Ticket List Component**

**AI Prompt:**

```
Create a React Server Component for displaying tickets that:
- Fetches tickets from /api/tickets on the server
- Displays in a responsive card/table layout
- Shows: ticket ID (truncated), title, status (with color badge), priority, category, created date
- Each ticket is clickable to view details
- Uses TailwindCSS for styling

Include:
1. Server-side data fetching (async component)
2. Error handling if fetch fails
3. Empty state if no tickets
4. Status color coding (Open=blue, In Progress=yellow, Resolved=green, Closed=gray)
5. Responsive design (mobile-friendly)

File: components/TicketList.tsx
```

---

### **I.2.7: OpenAI Integration Helper**

**AI Prompt:**

```
Create a utility function for categorizing support tickets using OpenAI that:
- Accepts: ticket title and description
- Sends to OpenAI GPT-4 with a specific prompt
- Extracts category (TECHNICAL, BILLING, ACCOUNT, GENERAL)
- Extracts priority (LOW, MEDIUM, HIGH, URGENT)
- Returns: { category, priority }
- Includes error handling and fallback to defaults

Use a system prompt that instructs the AI to:
- Analyze the ticket content
- Return JSON format: { "category": "...", "priority": "..." }
- Consider urgency keywords (urgent, asap, critical, broken)

Include:
1. OpenAI client initialization
2. Structured prompt engineering
3. JSON parsing from AI response
4. Error handling with sensible defaults
5. TypeScript types

File: lib/openai.ts
```

**After receiving the code, ask:**

```
Explain this OpenAI integration:
[PASTE CODE]

Why:
1. Use a system prompt vs user prompt?
2. Request JSON format from GPT?
3. Parse the response instead of using it directly?
4. Have default fallback values?
```

---

## **Step I.3: Learn Patterns and Best Practices**

### **AI Prompt Template (Pattern Learning)**

```
I'm working with Next.js 14 (App Router) and Prisma.

Teach me about these common patterns:
1. Server Components vs Client Components - when to use each
2. API route error handling best practices
3. Database connection management in serverless (Prisma singleton)
4. Form validation patterns (client-side vs server-side)

For each pattern:
- Explain what it is
- Show a simple example
- Explain when to use it
- Show how it applies to my support ticket system
```

---

### **AI Prompt Template (Code Review)**

```
Review this code I wrote for creating a ticket:

[PASTE YOUR CODE]


Please evaluate:
1. Is it following Next.js 14 best practices?
2. Are there any security issues? (SQL injection, XSS, etc.)
3. Can it be more efficient?
4. Is it readable and maintainable?
5. Is error handling comprehensive?
6. Are TypeScript types used properly?

Explain your suggestions in a way that helps me learn.
```

---

### **AI Prompt Template (Error Understanding)**

```
I'm getting this error:
[PASTE ERROR MESSAGE]

My code:
[PASTE RELEVANT CODE]

Help me:
1. Understand what this error means in simple terms
2. Identify the likely cause
3. Provide a fix with explanation
4. Teach me how to avoid this in the future
```

---

## **✅ Phase I Checkpoint**

### **Before moving fully into Phase L, you should have:**

- [ ] Development environment set up (Next.js, Prisma, dependencies)
- [ ] Boilerplate code generated for key components
- [ ] Understanding of each code section (can explain it)
- [ ] AI prompts documented for future reference

### **Self-Assessment Questions**

1. Can you explain the generated code in your own words?
2. Have you asked "why" for any code patterns you don't understand?
3. Do you know where to find help if you encounter errors?