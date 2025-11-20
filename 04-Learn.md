# **Phase L: LEARN Through Implementation**

## **Objective**
Build your application incrementally, testing as you go, and documenting your learning journey.

**Estimated Time:** 120 minutes (2 hours)

---

## **Micro-Milestone Overview**

| # | Milestone | Duration | What You'll Build | Competency |
|---|-----------|----------|-------------------|------------|
| **L.1** | Database Setup | 20 min | Prisma schema + migrations | TS.4.1 |
| **L.2** | OpenAI Integration | 20 min | AI categorization function | TS.6.3 |
| **L.3** | Create Ticket API | 25 min | POST /api/tickets endpoint | TS.3.1, TS.3.2 |
| **L.4** | Get Tickets API | 15 min | GET /api/tickets endpoint | TS.3.2, TS.4.2 |
| **L.5** | Ticket Form UI | 20 min | Submission form component | TS.2.3 |
| **L.6** | Ticket List UI | 20 min | Dashboard with ticket list | TS.2.3 |
| **L.7** | Update Status | 20 min | PATCH endpoint + UI | TS.3.2, TS.4.2 |
| **L.8** | Testing & Polish | 20 min | End-to-end testing + styling | TS.2.4 |

**Total: 160 minutes** (includes buffer time)

---

## **Micro-Milestone L.1: Database Setup (20 min)**

### **Objective**
Set up PostgreSQL database with Prisma, create the ticket schema, run migrations, and seed with sample data.

### **What You'll Build**
- Prisma schema with Ticket model
- Database migration
- Seed script with 5 sample tickets
- Database connection utility

### **Step-by-Step Instructions**

**Step 1: Set up PostgreSQL database**

You have two options:

**Option A: Local PostgreSQL** (if installed)
```bash
# Create database
createdb ticketdb

# Your DATABASE_URL in .env:
DATABASE_URL="postgresql://yourusername:yourpassword@localhost:5432/ticketdb"
```

**Option B: Cloud PostgreSQL** (recommended for beginners)

Use a free cloud database:
- **Neon** (https://neon.tech) - Free tier, no credit card
- **Supabase** (https://supabase.com) - Free tier, includes dashboard

After signup, copy your DATABASE_URL to `.env`

---

**Step 2: Create Prisma Schema**

Open `prisma/schema.prisma` and update it:

```prisma
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

  @@index([status])
  @@index([createdAt])
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
```

**Why these choices?**
- `@id @default(uuid())` - Unique IDs that don't expose sequence
- `@db.Text` - For long descriptions
- `@default()` - Sensible defaults for required fields
- `@@index` - Fast queries for common filters
- `@updatedAt` - Automatic timestamp updates

---

**Step 3: Run Prisma Migration**

```bash
# Generate Prisma Client and create database tables
npx prisma migrate dev --name init

# This will:
# 1. Create a migration file in prisma/migrations/
# 2. Apply the migration to your database
# 3. Generate the Prisma Client for TypeScript
```

You should see output like:
```
✔ Generated Prisma Client
```

---

**Step 4: Create Prisma Client Singleton**

Create `lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

// Prevent multiple Prisma instances in development (Next.js hot reload)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query', 'error', 'warn'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

**Why this pattern?**
- Next.js hot reload can create multiple database connections
- Singleton ensures one connection across app
- Logging helps debug queries in development

---

**Step 5: Create Seed Script**

Create `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.ticket.deleteMany()

  // Create sample tickets
  const tickets = await prisma.ticket.createMany({
    data: [
      {
        title: 'Cannot login to my account',
        description: 'I keep getting "Invalid credentials" error even though I\'m sure my password is correct. Tried resetting it twice.',
        email: 'john@example.com',
        status: 'OPEN',
        priority: 'HIGH',
        category: 'TECHNICAL',
      },
      {
        title: 'Duplicate billing charge',
        description: 'I was charged $49.99 twice this month on my credit card. Please refund one charge.',
        email: 'jane@example.com',
        status: 'IN_PROGRESS',
        priority: 'URGENT',
        category: 'BILLING',
      },
      {
        title: 'How do I change my email address?',
        description: 'I want to update my account email from my old work email to my personal one.',
        email: 'bob@example.com',
        status: 'RESOLVED',
        priority: 'LOW',
        category: 'ACCOUNT',
      },
      {
        title: 'Feature request: Dark mode',
        description: 'Would love to see a dark mode option in the settings. My eyes hurt using light mode at night.',
        email: 'alice@example.com',
        status: 'OPEN',
        priority: 'LOW',
        category: 'GENERAL',
      },
      {
        title: 'App crashes when uploading files',
        description: 'Every time I try to upload a PDF larger than 5MB, the app crashes immediately.',
        email: 'charlie@example.com',
        status: 'OPEN',
        priority: 'URGENT',
        category: 'TECHNICAL',
      },
    ],
  })

  console.log(`✅ Seeded ${tickets.count} tickets`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('Error seeding database:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
```

Add seed command to `package.json`:

```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

Install ts-node:
```bash
npm install -D ts-node
```

Run seed:
```bash
npx prisma db seed
```

---

**Step 6: Test Database Connection**

```bash
# Open Prisma Studio (visual database browser)
npx prisma studio
```

This opens `http://localhost:5555` where you can:
- View all 5 seeded tickets
- Edit data manually
- Verify schema is correct

---

### **✅ Checkpoint: Database Setup Complete**

**You should now have:**
- [ ] PostgreSQL database created (local or cloud)
- [ ] Prisma schema defined with Ticket model
- [ ] Migrations run successfully
- [ ] 5 sample tickets in database
- [ ] Prisma Studio showing your data

**Test Your Understanding:**
1. What does `@default(uuid())` do?
2. Why do we use a Prisma Client singleton?
3. What are the 4 status options for a ticket?

**Common Issues:**

**Error: "Can't reach database server"**
- Check DATABASE_URL in `.env` is correct
- Make sure PostgreSQL is running (local) or accessible (cloud)
- Verify firewall isn't blocking connection

**Error: "P1001: Can't connect to database"**
- Database name might be wrong in connection string
- Username/password incorrect

**Use this AI prompt if stuck:**
```
I'm getting this Prisma error:
[PASTE ERROR]

My setup:
- DATABASE_URL: [PASTE URL WITH PASSWORD HIDDEN]
- Command I ran: [PASTE COMMAND]

Help me:
1. What does this error mean?
2. How do I fix it?
3. How can I verify my database connection?
```

---

## **Micro-Milestone L.2: OpenAI Integration (20 min)**

### **Objective**
Create a utility function that uses OpenAI API to analyze ticket content and return category + priority suggestions.

### **What You'll Build**
- OpenAI client configuration
- AI categorization function
- Type definitions for AI responses
- Error handling with fallback values

### **Step-by-Step Instructions**

**Step 1: Get OpenAI API Key**

1. Go to https://platform.openai.com/signup
2. Create account (free $5 credit for new users)
3. Navigate to API Keys section
4. Create new secret key
5. Copy key to `.env`:

```env
OPENAI_API_KEY="sk-proj-xxxxxxxxxxxxxxxxxxxxx"
```

⚠️ **Never commit API keys to Git!** Verify `.env` is in `.gitignore`

---

**Step 2: Install OpenAI SDK**

```bash
npm install openai
```

---

**Step 3: Create OpenAI Utility**

Create `lib/openai.ts`:

```typescript
import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Type definitions for our expected response
export type TicketCategory = 'TECHNICAL' | 'BILLING' | 'ACCOUNT' | 'GENERAL'
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export interface CategorizationResult {
  category: TicketCategory
  priority: TicketPriority
  reasoning?: string
}

/**
 * Analyzes ticket content and suggests category and priority using AI
 * 
 * @param title - Ticket title
 * @param description - Ticket description
 * @returns Category and priority suggestion
 */
export async function categorizeTicket(
  title: string,
  description: string
): Promise<CategorizationResult> {
  try {
    const prompt = `Analyze this support ticket and categorize it.

Ticket Title: ${title}
Ticket Description: ${description}

Instructions:
1. Determine the category:
   - TECHNICAL: Issues with software, bugs, errors, login problems, crashes
   - BILLING: Payment issues, charges, refunds, invoices
   - ACCOUNT: Profile updates, settings, email changes, password resets
   - GENERAL: Questions, feedback, feature requests, other

2. Determine the priority:
   - URGENT: Service is completely down, security issues, payment failures
   - HIGH: Major functionality broken, urgent business need
   - MEDIUM: Feature not working as expected, moderate impact
   - LOW: Questions, minor issues, feature requests

3. Consider urgency keywords: urgent, asap, critical, broken, not working, help

Respond ONLY with valid JSON in this exact format:
{
  "category": "TECHNICAL",
  "priority": "HIGH",
  "reasoning": "Brief explanation"
}`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Cost-effective model, good for classification
      messages: [
        {
          role: 'system',
          content: 'You are a support ticket classification system. Analyze tickets and respond only with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3, // Lower temperature = more consistent
      max_tokens: 150,
    })

    // Extract the response
    const content = response.choices[0]?.message?.content

    if (!content) {
      throw new Error('No response from OpenAI')
    }

    // Parse JSON response
    const result = JSON.parse(content) as CategorizationResult

    // Validate response has required fields
    if (!result.category || !result.priority) {
      throw new Error('Invalid response format from OpenAI')
    }

    console.log('✅ AI Categorization:', result)

    return result

  } catch (error) {
    // Log error for debugging
    console.error('❌ OpenAI categorization failed:', error)

    // Return sensible defaults if AI fails
    return {
      category: 'GENERAL',
      priority: 'MEDIUM',
      reasoning: 'AI categorization unavailable, using defaults',
    }
  }
}

/**
 * Test function to verify OpenAI integration
 */
export async function testCategorization() {
  const result = await categorizeTicket(
    'Cannot login to my account',
    'I keep getting error "Invalid credentials" even though my password is correct'
  )
  
  console.log('Test result:', result)
  return result
}
```

**Why these choices?**
- `gpt-4o-mini` - Fast, cost-effective for classification tasks
- `temperature: 0.3` - More consistent, less creative (good for structured tasks)
- JSON response format - Easy to parse, type-safe
- Error handling with defaults - System works even if AI fails
- Detailed prompt - Clear instructions improve accuracy

---

**Step 4: Test OpenAI Integration**

Create a test file `scripts/test-openai.ts`:

```typescript
import { testCategorization } from '../lib/openai'

async function main() {
  console.log('🧪 Testing OpenAI integration...\n')
  
  const result = await testCategorization()
  
  console.log('\n✅ Test complete!')
  console.log('Category:', result.category)
  console.log('Priority:', result.priority)
  console.log('Reasoning:', result.reasoning)
}

main()
```

Run the test:
```bash
npx tsx scripts/test-openai.ts
```

**Expected output:**
```
🧪 Testing OpenAI integration...

✅ AI Categorization: {
  category: 'TECHNICAL',
  priority: 'HIGH',
  reasoning: 'Login issue affecting user access'
}

✅ Test complete!
Category: TECHNICAL
Priority: HIGH
Reasoning: Login issue affecting user access
```

---

**Step 5: Understand the AI Response**

The AI analyzes:
1. **Keywords**: "cannot login", "error", "invalid credentials"
2. **Context**: Account access issue = TECHNICAL
3. **Urgency**: Login blocked = HIGH priority (not URGENT because not site-wide)

Try testing with different ticket content to see how AI responds!

---

### **AI Prompt for Understanding**

If you want to understand the OpenAI code better:

```
Explain this OpenAI integration code to me:
[PASTE lib/openai.ts CODE]

Specifically explain:
1. Why use temperature: 0.3 instead of higher values?
2. What does the system message do vs user message?
3. Why parse JSON instead of just using the text response?
4. Why return default values instead of throwing an error?
5. What happens if OpenAI returns invalid JSON?
```

---

### **✅ Checkpoint: OpenAI Integration Complete**

**You should now have:**
- [ ] OpenAI API key configured in `.env`
- [ ] `lib/openai.ts` utility created
- [ ] Test script successfully runs
- [ ] AI correctly categorizes sample ticket

**Test Your Understanding:**
1. What model are we using and why?
2. What happens if the OpenAI API is down?
3. What are the 4 possible categories?

**Common Issues:**

**Error: "Incorrect API key"**
- Verify key is correct in `.env`
- Make sure it starts with `sk-`
- Check you didn't include extra spaces

**Error: "Rate limit exceeded"**
- Free tier has limits (3 requests/minute, 200/day)
- Wait a minute and try again
- Consider upgrading if needed for production

**Error: "JSON parse error"**
- AI sometimes returns text outside JSON
- Our error handling catches this and returns defaults
- Can improve prompt to be more strict about JSON-only

**Use this AI prompt if stuck:**
```
I'm getting this error with OpenAI:
[PASTE ERROR]

My code:
[PASTE RELEVANT CODE]

Help me:
1. What does this error mean?
2. How do I fix it?
3. How can I test if my API key works?
```

---

## **Micro-Milestone L.3: Create Ticket API (25 min)**

### **Objective**
Build a POST endpoint that accepts ticket data, validates it, uses AI to categorize, saves to database, and returns the created ticket.

### **What You'll Build**
- API route at `/api/tickets` (POST method)
- Input validation with Zod
- Integration with OpenAI categorization
- Database insertion with Prisma
- Error handling and proper HTTP responses

### **Step-by-Step Instructions**

**Step 1: Install Validation Library**

```bash
npm install zod
```

Zod provides TypeScript-first schema validation.

---

**Step 2: Create API Route File**

Create `app/api/tickets/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { categorizeTicket } from '@/lib/openai'

// Input validation schema
const createTicketSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  email: z.string().email('Invalid email format'),
})

/**
 * POST /api/tickets
 * Creates a new support ticket with AI categorization
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Parse request body
    const body = await request.json()
    
    // 2. Validate input
    const validationResult = createTicketSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationResult.error.errors 
        },
        { status: 400 }
      )
    }
    
    const { title, description, email } = validationResult.data
    
    // 3. Use AI to categorize ticket
    console.log('🤖 Categorizing ticket with AI...')
    const { category, priority, reasoning } = await categorizeTicket(title, description)
    
    console.log(`✅ AI suggested: ${category} / ${priority}`)
    if (reasoning) {
      console.log(`   Reasoning: ${reasoning}`)
    }
    
    // 4. Save ticket to database
    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        email,
        category,
        priority,
        status: 'OPEN', // All new tickets start as OPEN
      },
    })
    
    console.log(`✅ Ticket created: ${ticket.id}`)
    
    // 5. Return success response
    return NextResponse.json(
      {
        success: true,
        ticket,
        aiReasoning: reasoning,
      },
      { status: 201 }
    )
    
  } catch (error) {
    console.error('❌ Error creating ticket:', error)
    
    // Handle specific error types
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    
    // Generic error response
    return NextResponse.json(
      { error: 'Failed to create ticket', message: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

**Why these choices?**
- **Zod validation**: Catches bad input before processing
- **safeParse()**: Doesn't throw errors, returns validation result
- **AI before database**: Get categorization first, save once
- **Console logs**: Help debug during development
- **201 status**: Correct HTTP status for "Created"
- **Error handling**: Different responses for validation vs server errors

---

**Step 3: Test API with Thunder Client / Postman**

**Install Thunder Client** (VS Code extension):
1. Open VS Code Extensions
2. Search "Thunder Client"
3. Install

**Create a test request:**

1. Open Thunder Client
2. Create New Request
3. Set method: **POST**
4. URL: `http://localhost:3000/api/tickets`
5. Go to Body tab → JSON
6. Paste this test data:

```json
{
  "title": "Password reset email not arriving",
  "description": "I requested a password reset 30 minutes ago but haven't received the email yet. I've checked my spam folder and it's not there either. This is urgent as I need to access my account for an important meeting.",
  "email": "test@example.com"
}
```

7. Click **Send**

**Expected response (201 Created):**
```json
{
  "success": true,
  "ticket": {
    "id": "uuid-here",
    "title": "Password reset email not arriving",
    "description": "I requested a password reset...",
    "email": "test@example.com",
    "status": "OPEN",
    "priority": "HIGH",
    "category": "TECHNICAL",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "aiReasoning": "Password reset issue preventing account access"
}
```

---

**Step 4: Test Validation Errors**

Try submitting **invalid data** to verify validation works:

**Test 1: Missing required field**
```json
{
  "title": "Short",
  "email": "test@example.com"
}
```

**Expected response (400 Bad Request):**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "code": "too_small",
      "minimum": 5,
      "path": ["title"],
      "message": "Title must be at least 5 characters"
    },
    {
      "code": "invalid_type",
      "path": ["description"],
      "message": "Required"
    }
  ]
}
```

**Test 2: Invalid email**
```json
{
  "title": "Valid title here that is long enough",
  "description": "This is a valid description with enough characters to pass validation",
  "email": "not-an-email"
}
```

**Expected response (400 Bad Request):**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "validation": "email",
      "code": "invalid_string",
      "message": "Invalid email format",
      "path": ["email"]
    }
  ]
}
```

---

**Step 5: Verify in Database**

After successful POST, check Prisma Studio:

```bash
npx prisma studio
```

Navigate to the `Ticket` model and verify:
- New ticket appears
- AI-generated `category` and `priority` are correct
- `status` is "OPEN"
- Timestamps are populated

---

### **AI Prompt for Understanding**

```
Explain this Next.js API route to me:
[PASTE app/api/tickets/route.ts CODE]

Specifically explain:
1. Why use safeParse() instead of parse()?
2. What's the difference between 400, 201, and 500 status codes?
3. Why validate input before calling OpenAI?
4. What happens if the database is down?
5. Why return aiReasoning in the response?
```

---

### **✅ Checkpoint: Create Ticket API Complete**

**You should now have:**
- [ ] POST `/api/tickets` endpoint created
- [ ] Zod validation working for all fields
- [ ] AI categorization integrated
- [ ] Tickets saving to database
- [ ] Tested with valid and invalid data

**Test Your Understanding:**
1. What HTTP status code is returned for validation errors?
2. What happens if OpenAI API is down but database works?
3. Why use Zod instead of manual if/else validation?

**Common Issues:**

**Error: "Cannot find module '@/lib/prisma'"**
- Check `tsconfig.json` has paths configured:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

**Error: "Request body is undefined"**
- Make sure Content-Type header is `application/json`
- Verify JSON is valid (no trailing commas, quotes correct)

**Error: "Prisma Client not initialized"**
- Run `npx prisma generate` to regenerate client
- Restart your dev server

**Use this AI prompt if stuck:**
```
I'm getting this error in my Next.js API route:
[PASTE ERROR]

My code:
[PASTE route.ts]

My request (from Thunder Client):
Method: POST
URL: http://localhost:3000/api/tickets
Body: [PASTE JSON]

Help me debug this!
```

---

## **Micro-Milestone L.4: Get Tickets API (15 min)**

### **Objective**
Build a GET endpoint that retrieves all tickets from the database, sorted by creation date, with optional status filtering.

### **What You'll Build**
- API route at `/api/tickets` (GET method)
- Query parameter support for filtering by status
- Sorting logic (newest first)
- Proper error handling

### **Step-by-Step Instructions**

**Step 1: Add GET Handler to Existing Route File**

Open `app/api/tickets/route.ts` and add the GET function **after** the POST function:

```typescript
/**
 * GET /api/tickets
 * Retrieves all tickets, optionally filtered by status
 * Query params: ?status=OPEN (optional)
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Extract query parameters
    const { searchParams } = new URL(request.url)
    const statusFilter = searchParams.get('status')
    
    // 2. Build query based on filters
    const whereClause: any = {}
    
    if (statusFilter) {
      // Validate status is a valid enum value
      const validStatuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']
      
      if (!validStatuses.includes(statusFilter)) {
        return NextResponse.json(
          { error: 'Invalid status filter', validStatuses },
          { status: 400 }
        )
      }
      
      whereClause.status = statusFilter
    }
    
    // 3. Fetch tickets from database
    const tickets = await prisma.ticket.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc', // Newest first
      },
    })
    
    console.log(`✅ Retrieved ${tickets.length} tickets`)
    
    // 4. Return success response
    return NextResponse.json({
      success: true,
      count: tickets.length,
      tickets,
    })
    
  } catch (error) {
    console.error('❌ Error fetching tickets:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    )
  }
}
```

**Why these choices?**
- **searchParams**: Cleanly extracts query parameters from URL
- **Conditional filtering**: Only adds `where` clause if filter provided
- **Status validation**: Prevents SQL injection and invalid values
- **orderBy**: Newest tickets appear first (better UX)
- **Return count**: Helps frontend show "10 tickets" message

---

**Step 2: Test GET All Tickets**

**Thunder Client / Postman:**

1. Create New Request
2. Method: **GET**
3. URL: `http://localhost:3000/api/tickets`
4. Click **Send**

**Expected response (200 OK):**
```json
{
  "success": true,
  "count": 6,
  "tickets": [
    {
      "id": "newest-ticket-id",
      "title": "Password reset email not arriving",
      "description": "I requested a password reset...",
      "email": "test@example.com",
      "status": "OPEN",
      "priority": "HIGH",
      "category": "TECHNICAL",
      "createdAt": "2024-01-15T10:35:00.000Z",
      "updatedAt": "2024-01-15T10:35:00.000Z"
    },
    {
      "id": "second-newest-id",
      "title": "App crashes when uploading files",
      // ... more tickets
    }
    // ... (tickets sorted newest to oldest)
  ]
}
```

---

**Step 3: Test Filtering by Status**

**Test filtering for OPEN tickets:**

URL: `http://localhost:3000/api/tickets?status=OPEN`

**Expected response:**
```json
{
  "success": true,
  "count": 3,
  "tickets": [
    // Only tickets with status="OPEN"
  ]
}
```

**Test filtering for IN_PROGRESS tickets:**

URL: `http://localhost:3000/api/tickets?status=IN_PROGRESS`

**Test invalid status:**

URL: `http://localhost:3000/api/tickets?status=INVALID`

**Expected response (400 Bad Request):**
```json
{
  "error": "Invalid status filter",
  "validStatuses": ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]
}
```

---

**Step 4: Test in Browser**

You can also test GET requests directly in your browser:

1. Start your dev server: `npm run dev`
2. Open browser to: `http://localhost:3000/api/tickets`
3. You should see the JSON response

Try with filters:
- `http://localhost:3000/api/tickets?status=OPEN`
- `http://localhost:3000/api/tickets?status=RESOLVED`

---

**Step 5: Add TypeScript Types for Better Type Safety**

Create `types/ticket.ts`:

```typescript
export interface Ticket {
  id: string
  title: string
  description: string
  email: string
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  category: 'TECHNICAL' | 'BILLING' | 'ACCOUNT' | 'GENERAL'
  createdAt: Date
  updatedAt: Date
}

export interface GetTicketsResponse {
  success: boolean
  count: number
  tickets: Ticket[]
}
```

Now you can use these types in your frontend!

---

### **AI Prompt for Understanding**

```
Explain this GET endpoint code to me:
[PASTE GET function from route.ts]

Specifically explain:
1. How do query parameters work in Next.js API routes?
2. Why use searchParams.get() instead of req.query?
3. What does orderBy: { createdAt: 'desc' } do?
4. Why validate the status filter?
5. Could we add pagination to this endpoint?
```

---

### **✅ Checkpoint: Get Tickets API Complete**

**You should now have:**
- [ ] GET `/api/tickets` endpoint working
- [ ] Returns all tickets sorted newest first
- [ ] Status filtering works (`?status=OPEN`)
- [ ] Invalid status returns 400 error
- [ ] Tested in Thunder Client and browser

**Test Your Understanding:**
1. How would you add a limit parameter (e.g., `?limit=10`)?
2. What SQL query does Prisma generate for `findMany()`?
3. Why sort by `createdAt desc` instead of `asc`?

**Common Issues:**

**Error: "Cannot read property 'get' of undefined"**
- Make sure you're passing `request: NextRequest` parameter
- Verify you're using `new URL(request.url)`

**Error: "Tickets array is empty but I have data"**
- Check your DATABASE_URL is pointing to correct database
- Run `npx prisma studio` to verify data exists
- Check no `where` clause is filtering everything out

**Use this AI prompt if stuck:**
```
My GET /api/tickets endpoint isn't working:
[PASTE ERROR OR UNEXPECTED BEHAVIOR]

My code:
[PASTE GET function]

What I'm seeing vs what I expect:
Expected: [DESCRIBE]
Actual: [DESCRIBE]

Help me fix this!
```

---

## **Micro-Milestone L.5: Ticket Form UI (20 min)**

### **Objective**
Build a React component that allows users to submit new support tickets with proper validation, loading states, and success/error messages.

### **What You'll Build**
- Client Component form with controlled inputs
- Form validation before submission
- POST request to `/api/tickets` endpoint
- Loading spinner during submission
- Success and error message handling
- Form reset after successful submission

### **Step-by-Step Instructions**

**Step 1: Create TicketForm Component**

Create `components/TicketForm.tsx`:

```typescript
'use client'

import { useState, FormEvent } from 'react'

interface FormData {
  title: string
  description: string
  email: string
}

interface FormErrors {
  title?: string
  description?: string
  email?: string
}

export default function TicketForm() {
  // Form state
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    email: '',
  })

  // UI state
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  /**
   * Validates form data before submission
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters'
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters'
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Handles form submission
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault() // Prevent page refresh

    // Clear previous status
    setSubmitStatus(null)

    // Validate form
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Submit to API
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create ticket')
      }

      // Success!
      setSubmitStatus({
        type: 'success',
        message: `Ticket created successfully! AI categorized it as ${data.ticket.category} with ${data.ticket.priority} priority.`,
      })

      // Reset form
      setFormData({
        title: '',
        description: '',
        email: '',
      })
      setErrors({})

    } catch (error) {
      console.error('Error submitting ticket:', error)
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to create ticket. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Handles input changes
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Submit a Support Ticket
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Field */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Brief description of your issue"
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={6}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Please provide details about your issue..."
            disabled={isSubmitting}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            {formData.description.length} / 20 minimum characters
          </p>
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Your Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="your.email@example.com"
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
          ) : (
            'Submit Ticket'
          )}
        </button>

        {/* Status Messages */}
        {submitStatus && (
          <div
            className={`p-4 rounded-lg ${
              submitStatus.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            <p className="font-medium">
              {submitStatus.type === 'success' ? '✅ Success!' : '❌ Error'}
            </p>
            <p className="mt-1 text-sm">{submitStatus.message}</p>
          </div>
        )}
      </form>
    </div>
  )
}
```

**Why these choices?**
- **'use client'**: Form needs interactivity (state, events)
- **Controlled inputs**: Form state in React (not DOM)
- **validateForm()**: Client-side validation before API call
- **Loading state**: Prevents double-submission
- **Error display**: Shows inline errors for each field
- **Success message**: Includes AI categorization feedback
- **Form reset**: Clears after success for next submission

---

**Step 2: Create a Page to Display the Form**

Create `app/submit/page.tsx`:

```typescript
import TicketForm from '@/components/TicketForm'

export default function SubmitTicketPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Need Help?
          </h1>
          <p className="text-lg text-gray-600">
            Submit a support ticket and our team will get back to you soon.
          </p>
        </div>

        <TicketForm />

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Your ticket will be automatically categorized and prioritized using AI.
          </p>
        </div>
      </div>
    </div>
  )
}
```

---

**Step 3: Test the Form**

1. Start your dev server (if not running):
```bash
npm run dev
```

2. Open browser to: `http://localhost:3000/submit`

3. **Test validation** (submit empty form):
   - Should show error messages for all fields
   - No API call should be made

4. **Test email validation** (enter "notanemail"):
   - Should show "Invalid email format"

5. **Test character minimums**:
   - Title < 5 chars: Error message
   - Description < 20 chars: Error message

6. **Test successful submission**:
   - Fill in valid data:
     - Title: "My app keeps crashing on startup"
     - Description: "Every time I try to open the application, it crashes immediately with no error message. I've tried restarting my computer and reinstalling but the problem persists."
     - Email: "user@example.com"
   - Click Submit
   - Should see loading spinner
   - Should see success message with AI categorization
   - Form should clear

7. **Check database**:
   - Open Prisma Studio: `npx prisma studio`
   - Verify new ticket was created
   - Check AI-generated category and priority

---

**Step 4: Test Error Handling**

To test error states, temporarily break the API:

1. Stop your dev server
2. Try submitting the form
3. Should see error message about connection failure

Or test with invalid endpoint:

```typescript
// In TicketForm.tsx, temporarily change:
const response = await fetch('/api/tickets-wrong', { // Wrong URL
```

Should see error message displayed to user.

---

### **AI Prompt for Understanding**

```
Explain this React form component to me:
[PASTE TicketForm.tsx CODE]

Specifically explain:
1. Why use 'use client' at the top?
2. What's the difference between formData state and errors state?
3. Why call e.preventDefault() in handleSubmit?
4. How does the loading spinner work?
5. Why clear errors when user starts typing?
```

---

### **✅ Checkpoint: Ticket Form UI Complete**

**You should now have:**
- [ ] TicketForm component created and working
- [ ] Form validation working (client-side)
- [ ] Loading state shows during submission
- [ ] Success message displays after submission
- [ ] Error messages display inline for each field
- [ ] Form clears after successful submission
- [ ] Page accessible at `/submit`

**Test Your Understanding:**
1. Why validate on both client and server?
2. What happens if JavaScript is disabled in the browser?
3. How would you add a file upload field?

**Common Issues:**

**Error: "'use client' not recognized"**
- Make sure you're using Next.js 14+ with App Router
- Verify the directive is on the very first line

**Error: "Cannot read property 'preventDefault' of undefined"**
- Check your handleSubmit function signature: `(e: FormEvent<HTMLFormElement>)`
- Make sure you're calling `e.preventDefault()` at the start

**Form doesn't clear after submission**
- Check you're calling `setFormData()` with empty values in success block
- Verify `setFormData()` is after the success message, not in finally block

**Styling looks broken**
- Make sure TailwindCSS is configured in your Next.js project
- Check `tailwind.config.js` includes `./components/**/*.tsx`

**Use this AI prompt if stuck:**
```
My ticket form isn't working correctly:
Issue: [DESCRIBE PROBLEM]

Component code:
[PASTE TicketForm.tsx]

What I'm seeing:
- Expected: [DESCRIBE]
- Actual: [DESCRIBE]

Help me fix this!
```

---

## **Micro-Milestone L.6: Ticket List UI (20 min)**

### **Objective**
Build a dashboard page that displays all tickets in a responsive layout with status badges, filtering capabilities, and links to view/edit individual tickets.

### **What You'll Build**
- Server Component that fetches tickets
- Card-based layout for tickets
- Color-coded status badges
- Priority and category indicators
- Filter buttons for status
- Responsive design (mobile-friendly)

### **Step-by-Step Instructions**

**Step 1: Create TicketCard Component**

Create `components/TicketCard.tsx`:

```typescript
import Link from 'next/link'
import { format } from 'date-fns'

interface Ticket {
  id: string
  title: string
  description: string
  email: string
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  category: 'TECHNICAL' | 'BILLING' | 'ACCOUNT' | 'GENERAL'
  createdAt: string
  updatedAt: string
}

interface TicketCardProps {
  ticket: Ticket
}

export default function TicketCard({ ticket }: TicketCardProps) {
  // Status badge colors
  const statusColors = {
    OPEN: 'bg-blue-100 text-blue-800',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
    RESOLVED: 'bg-green-100 text-green-800',
    CLOSED: 'bg-gray-100 text-gray-800',
  }

  // Priority badge colors
  const priorityColors = {
    LOW: 'bg-gray-100 text-gray-700',
    MEDIUM: 'bg-blue-100 text-blue-700',
    HIGH: 'bg-orange-100 text-orange-700',
    URGENT: 'bg-red-100 text-red-700',
  }

  // Category icons (emoji for simplicity)
  const categoryIcons = {
    TECHNICAL: '🔧',
    BILLING: '💳',
    ACCOUNT: '👤',
    GENERAL: '📝',
  }

  return (
    <Link
      href={`/tickets/${ticket.id}`}
      className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border border-gray-200"
    >
      {/* Header: Status and Priority */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[ticket.status]}`}
        >
          {ticket.status.replace('_', ' ')}
        </span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityColors[ticket.priority]}`}
        >
          {ticket.priority}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
        {ticket.title}
      </h3>

      {/* Description Preview */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {ticket.description}
      </p>

      {/* Footer: Category and Date */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <span>{categoryIcons[ticket.category]}</span>
          <span>{ticket.category}</span>
        </span>
        <span>
          {format(new Date(ticket.createdAt), 'MMM d, yyyy')}
        </span>
      </div>

      {/* Ticket ID (truncated) */}
      <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-400">
        #{ticket.id.slice(0, 8)}
      </div>
    </Link>
  )
}
```

**Why these choices?**
- **Link component**: Next.js optimized navigation (prefetch)
- **Color coding**: Visual status indication at a glance
- **line-clamp**: Truncates long text (TailwindCSS utility)
- **date-fns format**: Human-readable dates
- **Hover effects**: Shows card is clickable
- **Responsive padding**: Works on mobile and desktop

---

**Step 2: Create Filter Buttons Component**

Create `components/StatusFilter.tsx`:

```typescript
'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const statuses = [
  { value: 'all', label: 'All Tickets' },
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'CLOSED', label: 'Closed' },
]

export default function StatusFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentStatus = searchParams.get('status') || 'all'

  const handleFilterChange = (status: string) => {
    if (status === 'all') {
      router.push('/dashboard')
    } else {
      router.push(`/dashboard?status=${status}`)
    }
  }

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {statuses.map((status) => (
        <button
          key={status.value}
          onClick={() => handleFilterChange(status.value)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentStatus === status.value
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {status.label}
        </button>
      ))}
    </div>
  )
}
```

**Why these choices?**
- **'use client'**: Needs interactivity (button clicks)
- **useSearchParams**: Reads URL query parameters
- **useRouter**: Programmatic navigation
- **URL-based filtering**: Shareable filtered views
- **Active state styling**: Shows current filter

---

**Step 3: Create Dashboard Page (Server Component)**

Create `app/dashboard/page.tsx`:

```typescript
import { Suspense } from 'react'
import Link from 'next/link'
import TicketCard from '@/components/TicketCard'
import StatusFilter from '@/components/StatusFilter'

interface Ticket {
  id: string
  title: string
  description: string
  email: string
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  category: 'TECHNICAL' | 'BILLING' | 'ACCOUNT' | 'GENERAL'
  createdAt: string
  updatedAt: string
}

interface PageProps {
  searchParams: { status?: string }
}

/**
 * Fetches tickets from API
 */
async function getTickets(status?: string): Promise<Ticket[]> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const url = status 
    ? `${baseUrl}/api/tickets?status=${status}`
    : `${baseUrl}/api/tickets`

  try {
    const response = await fetch(url, {
      cache: 'no-store', // Always fetch fresh data
    })

    if (!response.ok) {
      throw new Error('Failed to fetch tickets')
    }

    const data = await response.json()
    return data.tickets || []
  } catch (error) {
    console.error('Error fetching tickets:', error)
    return []
  }
}

/**
 * Loading skeleton for tickets
 */
function TicketSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
      </div>
      <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded mb-1 w-full"></div>
      <div className="h-4 bg-gray-200 rounded mb-4 w-5/6"></div>
      <div className="flex items-center justify-between">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  )
}

/**
 * Tickets List Component
 */
async function TicketsList({ status }: { status?: string }) {
  const tickets = await getTickets(status)

  if (tickets.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <div className="text-6xl mb-4">📭</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No tickets found
        </h3>
        <p className="text-gray-600 mb-6">
          {status 
            ? `There are no ${status.toLowerCase().replace('_', ' ')} tickets.`
            : 'Get started by submitting your first support ticket.'
          }
        </p>
        <Link
          href="/submit"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Submit a Ticket
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  )
}

/**
 * Dashboard Page (Server Component)
 */
export default async function DashboardPage({ searchParams }: PageProps) {
  const status = searchParams.status

  // Count summary (you can fetch this separately for better performance)
  const allTickets = await getTickets()
  const openCount = allTickets.filter(t => t.status === 'OPEN').length
  const inProgressCount = allTickets.filter(t => t.status === 'IN_PROGRESS').length
  const resolvedCount = allTickets.filter(t => t.status === 'RESOLVED').length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Support Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage and track all support tickets
              </p>
            </div>
            <Link
              href="/submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              + New Ticket
            </Link>
          </div>

          {/* Statistics */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-900">{allTickets.length}</div>
              <div className="text-sm text-blue-700">Total Tickets</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-900">{openCount}</div>
              <div className="text-sm text-yellow-700">Open</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-900">{inProgressCount}</div>
              <div className="text-sm text-orange-700">In Progress</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-900">{resolvedCount}</div>
              <div className="text-sm text-green-700">Resolved</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <StatusFilter />

        {/* Tickets List with Suspense */}
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <TicketSkeleton />
              <TicketSkeleton />
              <TicketSkeleton />
              <TicketSkeleton />
              <TicketSkeleton />
              <TicketSkeleton />
            </div>
          }
        >
          <TicketsList status={status} />
        </Suspense>
      </div>
    </div>
  )
}
```

**Why these choices?**
- **Server Component**: Fetches data on server (better SEO, faster initial load)
- **Suspense**: Shows skeleton while loading
- **searchParams**: Automatically receives URL query params
- **cache: 'no-store'**: Always fetch fresh data (no stale tickets)
- **Statistics cards**: Quick overview of ticket counts
- **Empty state**: Helpful message when no tickets exist
- **Responsive grid**: Adapts to screen size (1/2/3 columns)

---

**Step 4: Install date-fns for Date Formatting**

```bash
npm install date-fns
```

---

**Step 5: Test the Dashboard**

1. Make sure dev server is running:
```bash
npm run dev
```

2. Navigate to: `http://localhost:3000/dashboard`

**You should see:**
- Header with "Support Dashboard" title
- Statistics cards showing ticket counts
- Filter buttons (All, Open, In Progress, Resolved, Closed)
- Grid of ticket cards (3 columns on desktop, 2 on tablet, 1 on mobile)
- Each card showing:
  - Status badge (colored)
  - Priority badge (colored)
  - Title
  - Description preview
  - Category with icon
  - Creation date
  - Ticket ID (truncated)

3. **Test filtering:**
   - Click "Open" button → URL changes to `/dashboard?status=OPEN`
   - Should show only open tickets
   - Click "All Tickets" → URL changes to `/dashboard`
   - Shows all tickets again

4. **Test responsive design:**
   - Resize browser window
   - Cards should reflow: 3 → 2 → 1 column

5. **Test empty state:**
   - Temporarily filter by a status with no tickets
   - Should see "No tickets found" message with submit button

6. **Test navigation:**
   - Click on a ticket card
   - Should navigate to `/tickets/[id]` (we'll build this next)

---

**Step 6: Add Navigation to Homepage**

Update `app/page.tsx` to link to dashboard:

```typescript
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="text-center text-white px-4">
        <h1 className="text-5xl font-bold mb-4">
          Support Ticket System
        </h1>
        <p className="text-xl mb-8 opacity-90">
          AI-powered ticket categorization and management
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link
            href="/submit"
            className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Submit Ticket
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-4 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors border-2 border-white"
          >
            View Dashboard
          </Link>
        </div>

        <div className="mt-12 text-sm opacity-75">
          <p>✨ Powered by OpenAI GPT-4</p>
        </div>
      </div>
    </div>
  )
}
```

---

### **AI Prompt for Understanding**

```
Explain this Next.js dashboard page to me:
[PASTE app/dashboard/page.tsx CODE]

Specifically explain:
1. Why is the page an async function?
2. What's the difference between Server Component and Client Component here?
3. How does Suspense work with the loading skeleton?
4. Why use searchParams instead of useSearchParams?
5. What happens when I click a filter button?
```

---

### **✅ Checkpoint: Ticket List UI Complete**

**You should now have:**
- [ ] Dashboard page at `/dashboard` showing all tickets
- [ ] Ticket cards with color-coded status and priority
- [ ] Filter buttons working (All, Open, In Progress, etc.)
- [ ] Statistics cards showing ticket counts
- [ ] Empty state message when no tickets
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Loading skeleton during data fetch
- [ ] Homepage with navigation links

**Test Your Understanding:**
1. Why fetch tickets on the server instead of client?
2. How does Next.js know to refetch when filter changes?
3. What's the purpose of the Suspense boundary?

**Common Issues:**

**Error: "fetch failed" or "ECONNREFUSED"**
- Make sure your API route is running
- Check NEXT_PUBLIC_APP_URL in `.env`
- Try hardcoding `http://localhost:3000` in getTickets()

**Cards not displaying in grid**
- Check TailwindCSS classes: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Verify Tailwind is configured to scan components directory

**Filter buttons don't work**
- Check StatusFilter is a Client Component ('use client')
- Verify useRouter and useSearchParams are imported from 'next/navigation'

**Dates showing as "Invalid Date"**
- Ensure tickets have valid createdAt timestamps
- Check date-fns is installed: `npm install date-fns`

**Styling looks broken**
- Clear Next.js cache: `rm -rf .next`
- Restart dev server: `npm run dev`

**Use this AI prompt if stuck:**
```
My dashboard isn't working correctly:
Issue: [DESCRIBE PROBLEM]

Dashboard code:
[PASTE app/dashboard/page.tsx]

What I'm seeing:
- Expected: [DESCRIBE]
- Actual: [DESCRIBE]

Console errors (if any): [PASTE]

Help me debug this!
```

---

## **Micro-Milestone L.7: Update Status Feature (20 min)**

### **Objective**
Build functionality to update ticket status, including a PATCH API endpoint and a status dropdown component in the UI.

### **What You'll Build**
- PATCH endpoint at `/api/tickets/[id]` 
- Status dropdown component with optimistic updates
- Ticket detail page to view and update individual tickets

### **Step-by-Step Instructions**

**Step 1: Create Update Status API Route**

Create `app/api/tickets/[id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// Validation schema for status update
const updateStatusSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'], {
    errorMap: () => ({ message: 'Invalid status. Must be OPEN, IN_PROGRESS, RESOLVED, or CLOSED' })
  }),
})

/**
 * PATCH /api/tickets/[id]
 * Updates a ticket's status
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // 1. Parse request body
    const body = await request.json()

    // 2. Validate input
    const validationResult = updateStatusSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.errors,
        },
        { status: 400 }
      )
    }

    const { status } = validationResult.data

    // 3. Check if ticket exists
    const existingTicket = await prisma.ticket.findUnique({
      where: { id },
    })

    if (!existingTicket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      )
    }

    // 4. Update ticket status
    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: { status },
    })

    console.log(`✅ Ticket ${id} status updated: ${existingTicket.status} → ${status}`)

    // 5. Return updated ticket
    return NextResponse.json({
      success: true,
      ticket: updatedTicket,
      previousStatus: existingTicket.status,
    })

  } catch (error) {
    console.error('❌ Error updating ticket:', error)

    return NextResponse.json(
      { error: 'Failed to update ticket' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/tickets/[id]
 * Retrieves a single ticket by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const ticket = await prisma.ticket.findUnique({
      where: { id },
    })

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      ticket,
    })

  } catch (error) {
    console.error('❌ Error fetching ticket:', error)

    return NextResponse.json(
      { error: 'Failed to fetch ticket' },
      { status: 500 }
    )
  }
}
```

**Why these choices?**
- **Dynamic route [id]**: Matches any ticket ID in URL
- **Zod enum validation**: Ensures only valid statuses
- **404 check**: Returns proper error if ticket doesn't exist
- **Log status change**: Helpful for debugging
- **GET handler**: Bonus - fetch single ticket for detail page
- **previousStatus**: Helps client show "changed from X to Y"

---

**Step 2: Test Update Status API**

**Thunder Client / Postman:**

1. Create New Request
2. Method: **PATCH**
3. URL: `http://localhost:3000/api/tickets/[ticket-id-here]`
   - Replace `[ticket-id-here]` with an actual ticket ID from your database
   - Find IDs in Prisma Studio or from GET /api/tickets response

4. Body (JSON):
```json
{
  "status": "IN_PROGRESS"
}
```

5. Click **Send**

**Expected response (200 OK):**
```json
{
  "success": true,
  "ticket": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Cannot login to account",
    "description": "...",
    "email": "john@example.com",
    "status": "IN_PROGRESS",
    "priority": "HIGH",
    "category": "TECHNICAL",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:45:00.000Z"
  },
  "previousStatus": "OPEN"
}
```

**Test error cases:**

**Invalid status:**
```json
{
  "status": "INVALID_STATUS"
}
```

Expected: 400 error with validation message

**Non-existent ticket ID:**
URL: `http://localhost:3000/api/tickets/00000000-0000-0000-0000-000000000000`

Expected: 404 error "Ticket not found"

---

**Step 3: Create Status Dropdown Component**

Create `components/StatusDropdown.tsx`:

```typescript
'use client'

import { useState } from 'react'

type Status = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'

interface StatusDropdownProps {
  ticketId: string
  currentStatus: Status
  onStatusChange?: (newStatus: Status) => void
}

export default function StatusDropdown({
  ticketId,
  currentStatus,
  onStatusChange,
}: StatusDropdownProps) {
  const [status, setStatus] = useState<Status>(currentStatus)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const statuses: { value: Status; label: string; color: string }[] = [
    { value: 'OPEN', label: 'Open', color: 'bg-blue-600' },
    { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-yellow-600' },
    { value: 'RESOLVED', label: 'Resolved', color: 'bg-green-600' },
    { value: 'CLOSED', label: 'Closed', color: 'bg-gray-600' },
  ]

  const handleStatusChange = async (newStatus: Status) => {
    if (newStatus === status) return // No change

    setIsUpdating(true)
    setError(null)

    // Optimistic update
    const previousStatus = status
    setStatus(newStatus)

    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      const data = await response.json()
      console.log('✅ Status updated:', data)

      // Notify parent component
      if (onStatusChange) {
        onStatusChange(newStatus)
      }

    } catch (err) {
      console.error('Error updating status:', err)
      
      // Revert optimistic update
      setStatus(previousStatus)
      setError('Failed to update status. Please try again.')

    } finally {
      setIsUpdating(false)
    }
  }

  const currentStatusData = statuses.find(s => s.value === status)

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Ticket Status
      </label>

      <select
        value={status}
        onChange={(e) => handleStatusChange(e.target.value as Status)}
        disabled={isUpdating}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          isUpdating ? 'opacity-50 cursor-wait' : 'cursor-pointer'
        } ${currentStatusData?.color} text-white font-semibold`}
      >
        {statuses.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      {isUpdating && (
        <div className="absolute right-3 top-10 pointer-events-none">
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
```

**Why these choices?**
- **'use client'**: Needs interactivity
- **Optimistic update**: UI updates immediately, feels faster
- **Revert on error**: Rollback if API fails
- **Loading spinner**: Visual feedback during update
- **Color-coded dropdown**: Shows status visually
- **onStatusChange callback**: Parent can refresh data

---

**Step 4: Create Ticket Detail Page**

Create `app/tickets/[id]/page.tsx`:

```typescript
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import StatusDropdown from '@/components/StatusDropdown'

interface Ticket {
  id: string
  title: string
  description: string
  email: string
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  category: 'TECHNICAL' | 'BILLING' | 'ACCOUNT' | 'GENERAL'
  createdAt: string
  updatedAt: string
}

interface PageProps {
  params: { id: string }
}

/**
 * Fetches a single ticket by ID
 */
async function getTicket(id: string): Promise<Ticket | null> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  try {
    const response = await fetch(`${baseUrl}/api/tickets/${id}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.ticket
  } catch (error) {
    console.error('Error fetching ticket:', error)
    return null
  }
}

/**
 * Ticket Detail Page
 */
export default async function TicketDetailPage({ params }: PageProps) {
  const ticket = await getTicket(params.id)

  if (!ticket) {
    notFound() // Shows 404 page
  }

  const priorityColors = {
    LOW: 'bg-gray-100 text-gray-700',
    MEDIUM: 'bg-blue-100 text-blue-700',
    HIGH: 'bg-orange-100 text-orange-700',
    URGENT: 'bg-red-100 text-red-700',
  }

  const categoryIcons = {
    TECHNICAL: '🔧',
    BILLING: '💳',
    ACCOUNT: '👤',
    GENERAL: '📝',
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-md">
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {ticket.title}
                </h1>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span>Ticket #{ticket.id.slice(0, 8)}</span>
                  <span>•</span>
                  <span>Created {format(new Date(ticket.createdAt), 'MMM d, yyyy \'at\' h:mm a')}</span>
                </div>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${priorityColors[ticket.priority]}`}
              >
                {ticket.priority} Priority
              </span>
            </div>

            {/* Category */}
            <div className="flex items-center gap-2 text-gray-700">
              <span className="text-2xl">{categoryIcons[ticket.category]}</span>
              <span className="font-medium">{ticket.category}</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Description
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {ticket.description}
              </p>
            </div>

            {/* Contact Email */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Contact Information
              </h2>
              <div className="flex items-center gap-2 text-gray-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${ticket.email}`} className="text-blue-600 hover:underline">
                  {ticket.email}
                </a>
              </div>
            </div>

            {/* Status Update */}
            <div className="pt-6 border-t border-gray-200">
              <StatusDropdown
                ticketId={ticket.id}
                currentStatus={ticket.status}
              />
            </div>

            {/* Last Updated */}
            <div className="text-sm text-gray-500">
              Last updated: {format(new Date(ticket.updatedAt), 'MMM d, yyyy \'at\' h:mm a')}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

**Why these choices?**
- **Server Component**: Fetches ticket data on server
- **notFound()**: Shows 404 if ticket doesn't exist
- **No revalidation**: Uses cache: 'no-store' for fresh data
- **Formatted dates**: Human-readable timestamps
- **Email link**: Clickable mailto: link
- **Back button**: Easy navigation to dashboard

---

**Step 5: Create 404 Not Found Page**

Create `app/tickets/[id]/not-found.tsx`:

```typescript
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Ticket Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          The ticket you're looking for doesn't exist or has been deleted.
        </p>
        <Link
          href="/dashboard"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
```

---

**Step 6: Test Status Update Feature**

1. Navigate to dashboard: `http://localhost:3000/dashboard`

2. Click on any ticket card

3. Should navigate to: `http://localhost:3000/tickets/[ticket-id]`

4. **Test status dropdown:**
   - Current status should be pre-selected
   - Dropdown should be color-coded
   - Change status to "In Progress"
   - Should see loading spinner briefly
   - Status should update immediately (optimistic)
   - Check console for success log

5. **Verify in database:**
   - Open Prisma Studio: `npx prisma studio`
   - Find the ticket you updated
   - Status should be changed
   - `updatedAt` timestamp should be recent

6. **Test error handling:**
   - Stop your dev server
   - Try changing status
   - Should see error message
   - Status should revert to original

7. **Test 404 page:**
   - Navigate to: `http://localhost:3000/tickets/invalid-id`
   - Should show "Ticket Not Found" page

---

### **AI Prompt for Understanding**

```
Explain this status update system to me:
[PASTE StatusDropdown.tsx AND route.ts]

Specifically explain:
1. What is optimistic update and why use it?
2. How does the PATCH endpoint validate the status?
3. What happens if the API call fails?
4. Why use dynamic routes [id] instead of query params?
5. How does Next.js handle the notFound() function?
```

---

### **✅ Checkpoint: Update Status Complete**

**You should now have:**
- [ ] PATCH `/api/tickets/[id]` endpoint working
- [ ] GET `/api/tickets/[id]` endpoint working
- [ ] StatusDropdown component with optimistic updates
- [ ] Ticket detail page at `/tickets/[id]`
- [ ] 404 page for invalid ticket IDs
- [ ] Status changes saving to database
- [ ] Error handling and revert on failure

**Test Your Understanding:**
1. What is optimistic UI update?
2. Why validate status on both client and server?
3. What HTTP status code is returned when ticket not found?

**Common Issues:**

**Error: "Cannot read property 'id' of undefined"**
- Check params destructuring: `{ params }: { params: { id: string } }`
- Verify file is named `[id]` with square brackets

**Status doesn't update**
- Check PATCH endpoint is working (test with Thunder Client first)
- Verify ticket ID is correct
- Check console for fetch errors

**Optimistic update doesn't revert on error**
- Make sure you're storing `previousStatus` before updating
- Check error catch block is calling `setStatus(previousStatus)`

**404 page doesn't show**
- Verify `not-found.tsx` is in the same directory as `page.tsx`
- Check you're calling `notFound()` function, not returning it

**Use this AI prompt if stuck:**
```
My status update feature isn't working:
Issue: [DESCRIBE PROBLEM]

StatusDropdown code:
[PASTE StatusDropdown.tsx]

API route code:
[PASTE app/api/tickets/[id]/route.ts]

Error messages (if any): [PASTE]

Help me debug this!
```

---

## **Micro-Milestone L.8: Testing & Polish (20 min)**

### **Objective**
Perform end-to-end testing of all features, add final polish to UI, handle edge cases, and prepare the application for demonstration.

### **What You'll Build**
- Comprehensive testing checklist
- Error boundary for graceful error handling
- Loading states and transitions
- Final UI polish and accessibility improvements

### **Step-by-Step Instructions**

**Step 1: End-to-End Testing Checklist**

Go through this complete testing flow:

**✅ Ticket Creation Flow**

1. Navigate to `/submit`
2. Test validation:
   - [ ] Submit empty form → Shows 3 error messages
   - [ ] Enter title "Test" (< 5 chars) → Shows error
   - [ ] Enter description "Short" (< 20 chars) → Shows error
   - [ ] Enter email "invalid" → Shows "Invalid email format"

3. Test successful submission:
   - [ ] Fill in valid data:
     - Title: "Application keeps freezing when I upload large files"
     - Description: "Every time I try to upload a file larger than 50MB, the application freezes completely and I have to force quit. This happens consistently on both Chrome and Firefox browsers. I'm running MacOS Ventura 13.2."
     - Email: "testuser@example.com"
   - [ ] Click Submit
   - [ ] See loading spinner
   - [ ] See success message with AI categorization
   - [ ] Form clears after success
   - [ ] Open Prisma Studio → Verify ticket was created

**✅ Dashboard Flow**

1. Navigate to `/dashboard`
2. Test display:
   - [ ] Statistics cards show correct counts
   - [ ] All tickets display in grid
   - [ ] Cards show correct status colors
   - [ ] Cards show correct priority badges
   - [ ] Dates are formatted correctly
   - [ ] Truncated ticket IDs display

3. Test filtering:
   - [ ] Click "Open" → URL changes to `?status=OPEN`
   - [ ] Only open tickets show
   - [ ] Statistics still accurate
   - [ ] Click "All Tickets" → Shows all tickets
   - [ ] Try each filter (In Progress, Resolved, Closed)

4. Test responsive design:
   - [ ] Resize browser → Grid adapts (3 → 2 → 1 column)
   - [ ] Statistics cards stack on mobile
   - [ ] Filter buttons wrap on small screens

**✅ Ticket Detail Flow**

1. From dashboard, click any ticket card
2. Test detail page:
   - [ ] Correct ticket information displays
   - [ ] Priority badge shows
   - [ ] Category icon displays
   - [ ] Description is readable
   - [ ] Email is clickable mailto: link
   - [ ] Status dropdown shows current status
   - [ ] Last updated timestamp shows

3. Test status update:
   - [ ] Change status to "In Progress"
   - [ ] See brief loading spinner
   - [ ] Status updates immediately
   - [ ] Navigate back to dashboard
   - [ ] Verify ticket shows new status
   - [ ] Check Prisma Studio → Status changed

4. Test back navigation:
   - [ ] Click "Back to Dashboard" → Returns to `/dashboard`
   - [ ] Maintains filter if one was active

**✅ Error Scenarios**

1. Test 404 handling:
   - [ ] Navigate to `/tickets/invalid-id-123`
   - [ ] See "Ticket Not Found" page
   - [ ] "Back to Dashboard" button works

2. Test API failure:
   - [ ] Stop dev server
   - [ ] Try submitting ticket → See error message
   - [ ] Try updating status → See error, status reverts
   - [ ] Restart server → Everything works again

3. Test network throttling:
   - [ ] Open DevTools → Network tab
   - [ ] Throttle to "Slow 3G"
   - [ ] Submit ticket → Loading states show longer
   - [ ] Update status → Loading spinner visible

---

**Step 2: Add Global Error Boundary**

Create `app/error.tsx`:

```typescript
'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Something Went Wrong
        </h1>
        <p className="text-gray-600 mb-6">
          An unexpected error occurred. Don't worry, your data is safe.
        </p>
        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Try Again
          </button>
          
            href="/dashboard"
            className="block w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Go to Dashboard
          </a>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Error Details (Development Only)
            </summary>
            <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}
```

**Test error boundary:**
1. Add intentional error to any page:
```typescript
throw new Error('Test error boundary')
```
2. Navigate to that page
3. Should see error UI with "Try Again" button
4. Click "Try Again" → Should attempt to re-render
5. Remove the error and test again

---

**Step 3: Add Loading State to Dashboard**

Create `app/dashboard/loading.tsx`:

```typescript
export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
            </div>
            <div className="h-12 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>

          {/* Statistics Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-12 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-10 bg-gray-200 rounded-lg w-24 animate-pulse"
            ></div>
          ))}
        </div>

        {/* Tickets Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow p-6 border border-gray-200 animate-pulse"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded mb-1 w-full"></div>
              <div className="h-4 bg-gray-200 rounded mb-4 w-5/6"></div>
              <div className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

**Test loading state:**
1. Add artificial delay to dashboard:
```typescript
// In app/dashboard/page.tsx
await new Promise(resolve => setTimeout(resolve, 2000))
```
2. Navigate to `/dashboard`
3. Should see loading skeleton for 2 seconds
4. Then real content appears
5. Remove the delay

---

**Step 4: Add Accessibility Improvements**

Update `components/TicketForm.tsx` to add aria-labels:

```typescript
// Add to form element
<form 
  onSubmit={handleSubmit} 
  className="space-y-6"
  aria-label="Support ticket submission form"
>

// Add to submit button
<button
  type="submit"
  disabled={isSubmitting}
  className="..."
  aria-label={isSubmitting ? 'Submitting ticket' : 'Submit ticket'}
  aria-busy={isSubmitting}
>
```

Update `components/StatusDropdown.tsx`:

```typescript
<select
  value={status}
  onChange={(e) => handleStatusChange(e.target.value as Status)}
  disabled={isUpdating}
  className="..."
  aria-label="Change ticket status"
  aria-busy={isUpdating}
>
```

---

**Step 5: Final UI Polish**

**Add transitions to buttons:**

Update all buttons to include transition classes:

```typescript
// Example: TicketForm submit button
className="w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 transform hover:scale-105 active:scale-95 ..."
```

**Add hover effects to cards:**

Update `components/TicketCard.tsx`:

```typescript
<Link
  href={`/tickets/${ticket.id}`}
  className="block bg-white rounded-lg shadow hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 p-6 border border-gray-200"
>
```

**Add focus styles for keyboard navigation:**

Add to `app/globals.css`:

```css
/* Enhanced focus styles for accessibility */
*:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

button:focus-visible,
a:focus-visible {
  ring: 2px;
  ring-color: #3b82f6;
  ring-offset: 2px;
}
```

---

**Step 6: Create a README**

Create comprehensive `README.md` in your project root:

```markdown
# Support Ticket System with AI Categorization

A full-stack Next.js application that uses OpenAI GPT-4 to automatically categorize and prioritize support tickets.

## 🎯 Features

- **AI-Powered Categorization**: Automatically categorizes tickets into Technical, Billing, Account, or General
- **Priority Suggestion**: AI suggests priority levels (Low, Medium, High, Urgent)
- **Real-time Status Updates**: Update ticket status with optimistic UI
- **Responsive Dashboard**: View and filter tickets by status
- **Modern UI**: Built with TailwindCSS for a clean, professional look

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **AI**: OpenAI API (GPT-4)
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or cloud)
- OpenAI API key

## 🚀 Installation

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd ticket-system
npm install
```

### 2. Set Up Environment Variables

Create `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ticketdb"
OPENAI_API_KEY="sk-your-api-key-here"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Set Up Database

```bash
# Run migrations
npx prisma migrate dev --name init

# Seed with sample data
npx prisma db seed

# Open Prisma Studio to view data
npx prisma studio
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
ticket-system/
├── app/
│   ├── api/
│   │   └── tickets/
│   │       ├── route.ts          # POST, GET endpoints
│   │       └── [id]/
│   │           └── route.ts      # PATCH, GET by ID
│   ├── dashboard/
│   │   ├── page.tsx              # Dashboard UI
│   │   └── loading.tsx           # Loading skeleton
│   ├── submit/
│   │   └── page.tsx              # Ticket submission form
│   ├── tickets/
│   │   └── [id]/
│   │       ├── page.tsx          # Ticket detail page
│   │       └── not-found.tsx     # 404 page
│   ├── layout.tsx
│   ├── page.tsx                  # Homepage
│   └── error.tsx                 # Error boundary
├── components/
│   ├── TicketForm.tsx            # Submission form
│   ├── TicketCard.tsx            # Ticket display card
│   ├── StatusDropdown.tsx        # Status update dropdown
│   └── StatusFilter.tsx          # Filter buttons
├── lib/
│   ├── prisma.ts                 # Prisma client
│   └── openai.ts                 # OpenAI integration
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Seed data
└── types/
    └── ticket.ts                 # TypeScript types
```

## 🎨 Key Features Explained

### AI Categorization

When a ticket is submitted, the system:
1. Sends title and description to OpenAI GPT-4
2. Analyzes content for keywords and urgency
3. Returns category (TECHNICAL, BILLING, ACCOUNT, GENERAL)
4. Returns priority (LOW, MEDIUM, HIGH, URGENT)
5. Saves ticket with AI-generated metadata

### Optimistic UI Updates

Status changes update immediately in the UI before the server responds, creating a snappy user experience. If the server request fails, the UI reverts to the previous state.

### Server Components

Dashboard and detail pages use Next.js Server Components to fetch data on the server, improving:
- SEO (search engines can crawl content)
- Initial page load speed
- Data freshness

## 🧪 Testing

### Manual Testing Checklist

- [ ] Submit ticket with valid data
- [ ] Test form validation (empty fields, invalid email)
- [ ] View all tickets on dashboard
- [ ] Filter tickets by status
- [ ] Update ticket status
- [ ] View ticket details
- [ ] Test responsive design (mobile, tablet, desktop)

### API Testing (Thunder Client / Postman)

**Create Ticket:**
```
```
POST http://localhost:3000/api/tickets
Content-Type: application/json

{
  "title": "Test ticket",
  "description": "This is a test ticket with enough characters to pass validation",
  "email": "test@example.com"
}
```

**Get All Tickets:**
```
GET http://localhost:3000/api/tickets
```

**Update Status:**
```
PATCH http://localhost:3000/api/tickets/{ticket-id}
Content-Type: application/json

{
  "status": "IN_PROGRESS"
}
```

## 🔧 Configuration

### OpenAI Settings

The AI categorization uses:
- Model: `gpt-4o-mini` (cost-effective for classification)
- Temperature: `0.3` (more consistent, less creative)
- Max tokens: `150`

Modify in `lib/openai.ts` if needed.

### Database Schema

To modify the schema:
1. Edit `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name description`
3. Prisma generates SQL and updates TypeScript types

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `DATABASE_URL`
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_APP_URL`
4. Deploy

### Database Options

**Free Tier Options:**
- [Neon](https://neon.tech) - Serverless Postgres
- [Supabase](https://supabase.com) - Open-source Firebase alternative
- [Railway](https://railway.app) - Simple cloud deployment

## 📊 Performance Optimizations

- Server Components for data fetching (no client-side fetch)
- Optimistic UI updates (immediate feedback)
- Next.js automatic code splitting
- TailwindCSS purges unused styles
- Prisma connection pooling

## 🐛 Troubleshooting

### "Cannot connect to database"
- Verify `DATABASE_URL` in `.env`
- Check database is running
- Test connection: `npx prisma db push`

### "OpenAI API error"
- Verify `OPENAI_API_KEY` in `.env`
- Check API key is valid
- Ensure you have API credits

### "Module not found" errors
- Run `npm install`
- Delete `node_modules` and reinstall
- Clear Next.js cache: `rm -rf .next`

### Status update not working
- Check browser console for errors
- Verify API route is working (test with Thunder Client)
- Check Prisma Studio to see if update persisted

## 📝 API Reference

### POST /api/tickets

Creates a new support ticket with AI categorization.

**Request:**
```json
{
  "title": "string (5-200 chars)",
  "description": "string (20+ chars)",
  "email": "string (valid email)"
}
```

**Response (201):**
```json
{
  "success": true,
  "ticket": {
    "id": "uuid",
    "title": "string",
    "description": "string",
    "email": "string",
    "status": "OPEN",
    "priority": "HIGH",
    "category": "TECHNICAL",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  },
  "aiReasoning": "string"
}
```

### GET /api/tickets

Retrieves all tickets, optionally filtered by status.

**Query Parameters:**
- `status` (optional): OPEN, IN_PROGRESS, RESOLVED, CLOSED

**Response (200):**
```json
{
  "success": true,
  "count": 10,
  "tickets": [...]
}
```

### GET /api/tickets/:id

Retrieves a single ticket by ID.

**Response (200):**
```json
{
  "success": true,
  "ticket": {...}
}
```

**Response (404):**
```json
{
  "error": "Ticket not found"
}
```

### PATCH /api/tickets/:id

Updates a ticket's status.

**Request:**
```json
{
  "status": "IN_PROGRESS"
}
```

**Response (200):**
```json
{
  "success": true,
  "ticket": {...},
  "previousStatus": "OPEN"
}
```

## 🎓 Learning Objectives

This project demonstrates:
- **TS.2 (Frontend)**: Building interactive React components
- **TS.3 (Backend)**: Creating RESTful API endpoints
- **TS.4 (Database)**: Designing schemas and relationships
- **TS.6 (AI Integration)**: Using OpenAI API for text classification

## 🤝 Contributing

This is a learning project. Feel free to:
- Add features (comments, file uploads, notifications)
- Improve UI/UX
- Optimize performance
- Add tests

## 📄 License

MIT

## 👤 Author

[Your Name]
- Portfolio: [your-portfolio.com]
- LinkedIn: [linkedin.com/in/yourprofile]
- GitHub: [github.com/yourusername]

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Next.js team for the amazing framework
- Prisma for the excellent ORM
```

---

**Step 7: Create `.env.example` Template**

Create `.env.example`:

```env
# Database
# Get a free PostgreSQL database from:
# - Neon: https://neon.tech
# - Supabase: https://supabase.com
# - Railway: https://railway.app
DATABASE_URL="postgresql://user:password@localhost:5432/ticketdb"

# OpenAI API
# Get your API key from: https://platform.openai.com/api-keys
# Free tier: $5 credit for new users
OPENAI_API_KEY="sk-proj-xxxxxxxxxxxxxxxxxxxxx"

# Application URL
# Local development: http://localhost:3000
# Production: https://your-app.vercel.app
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

**Step 8: Final Quality Checks**

**Code Quality:**
- [ ] Remove all `console.log()` statements (or keep only important ones)
- [ ] Remove commented-out code
- [ ] Check for unused imports
- [ ] Ensure consistent naming conventions
- [ ] Add comments to complex logic

**Performance:**
- [ ] Images optimized (if any added)
- [ ] No unnecessary re-renders
- [ ] API calls minimized
- [ ] Database queries efficient

**Security:**
- [ ] `.env` in `.gitignore`
- [ ] No API keys in code
- [ ] Input validation on all forms
- [ ] SQL injection prevention (Prisma handles this)

**Accessibility:**
- [ ] All forms have labels
- [ ] Buttons have descriptive text
- [ ] Colors have sufficient contrast
- [ ] Keyboard navigation works
- [ ] Screen reader friendly

---

**Step 9: Create Demo Script**

Prepare a 2-minute demo following this flow:

**Demo Script:**

```
1. INTRODUCTION (15 seconds)
   "Hi, I built a support ticket system with AI-powered categorization 
    using Next.js, PostgreSQL, and OpenAI's GPT-4."

2. SUBMIT TICKET (30 seconds)
   - Navigate to /submit
   - "Customers can submit tickets through this form"
   - Fill in: 
     Title: "Payment failed during checkout"
     Description: "I tried to purchase the premium plan but my credit card was declined even though it has funds. Getting error code 402."
     Email: "demo@example.com"
   - Submit
   - "Notice the AI automatically categorized this as BILLING with HIGH priority"

3. DASHBOARD (45 seconds)
   - Navigate to /dashboard
   - "The dashboard shows all tickets with color-coded statuses"
   - Point out statistics cards
   - "Agents can filter by status"
   - Click filter to show only OPEN tickets
   - "And update ticket status in real-time"
   - Click a ticket to open detail page

4. UPDATE STATUS (30 seconds)
   - Show ticket detail page
   - "Here agents can view full details and update status"
   - Change status from OPEN to IN_PROGRESS
   - "The update happens immediately with optimistic UI"
   - Navigate back to dashboard
   - "And the dashboard reflects the change"

5. CLOSING (15 seconds)
   "The system uses Server Components for fast page loads,
    optimistic updates for great UX, and Prisma for type-safe
    database operations. Check out my GitHub for the code!"
```

---

### **✅ Checkpoint: Testing & Polish Complete**

**You should now have:**
- [ ] Comprehensive testing completed
- [ ] Error boundary implemented
- [ ] Loading states added
- [ ] Accessibility improvements made
- [ ] UI polish (transitions, hover effects)
- [ ] Complete README.md
- [ ] `.env.example` template
- [ ] Demo script prepared
- [ ] All code quality checks passed

**Final Test Your Understanding:**
1. Can you explain how error boundaries work in Next.js?
2. What is optimistic UI and why does it improve UX?
3. How would you add unit tests to this application?

**Common Issues:**

**Error boundary not catching errors**
- Make sure `error.tsx` is in the correct directory
- Verify it's a Client Component ('use client')
- Check error is happening during render, not in event handler

**Loading states not showing**
- Verify `loading.tsx` is in same directory as `page.tsx`
- Add artificial delay to test: `await new Promise(r => setTimeout(r, 2000))`

**Accessibility issues**
- Run Lighthouse audit in Chrome DevTools
- Check keyboard navigation (Tab key)
- Test with screen reader if available

---

## **🎉 PHASE L COMPLETE!**

**Congratulations! You've built a complete full-stack application with:**

✅ **8 Micro-Milestones Completed:**
1. Database setup with Prisma ✅
2. OpenAI integration ✅
3. Create Ticket API ✅
4. Get Tickets API ✅
5. Ticket Form UI ✅
6. Ticket List UI ✅
7. Update Status feature ✅
8. Testing & Polish ✅

**Total Time:** ~160 minutes (2.5 hours)

**Competencies Demonstrated:**
- **TS.2.3**: Built interactive frontend with React/Next.js
- **TS.3.1**: Consumed OpenAI API
- **TS.3.2**: Handled HTTP requests and responses
- **TS.3.4**: Designed system architecture
- **TS.4.1**: Created database structure with Prisma
- **TS.4.2**: Navigated data with queries
- **TS.6.3**: Integrated AI tools