# Full-Stack Integration Audit Report
## DeltaPrime AI Solutions - Frontend & Backend Architecture

**Date:** December 2024  
**Project:** DeltaPrime AI Solutions Website  
**Status:** Frontend Complete | Backend Pending Implementation

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Frontend Architecture](#frontend-architecture)
3. [Backend Architecture](#backend-architecture)
4. [Integration Points](#integration-points)
5. [Data Flow Diagrams](#data-flow-diagrams)
6. [API Contracts](#api-contracts)
7. [Database Schema](#database-schema)
8. [RAG Implementation](#rag-implementation)
9. [Security Considerations](#security-considerations)
10. [Deployment Strategy](#deployment-strategy)
11. [Testing Strategy](#testing-strategy)
12. [Future Enhancements](#future-enhancements)

---

## Executive Summary

### Current State
- **Frontend:** ✅ Complete React SPA with TypeScript, Vite, and modern UI components
- **Backend:** ⏳ To be implemented (Python FastAPI)
- **Database:** ⏳ To be configured (Supabase PostgreSQL + Vector Store)
- **AI Integration:** ⏳ To be implemented (Gemini 1.5 Flash + RAG)

### Architecture Overview
```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   React SPA     │  HTTP   │  Python FastAPI  │  SQL    │    Supabase     │
│   (Frontend)    │ ───────> │    (Backend)     │ ───────> │   (Database)    │
│                 │          │                  │          │                 │
│ - Contact Form  │          │ - REST API       │          │ - PostgreSQL   │
│ - Chat Widget   │          │ - RAG Pipeline   │          │ - Vector Store │
│ - Services Page │          │ - Gemini 1.5     │          │ - Storage      │
└─────────────────┘          └─────────────────┘          └─────────────────┘
```

### Key Integration Points
1. **Contact Form** → `/api/contact` → Database storage
2. **Chat Widget** → `/api/chat` → RAG → Gemini 1.5 Flash → Response
3. **Service Inquiries** → `/api/services/quote` → Lead generation

---

## Frontend Architecture

### Technology Stack
- **Framework:** React 18.3.1 with TypeScript
- **Build Tool:** Vite 5.4.19
- **Routing:** React Router DOM 6.30.1
- **Styling:** Tailwind CSS 3.4.17
- **UI Components:** shadcn/ui (Radix UI primitives)
- **Animations:** Framer Motion 12.23.26
- **State Management:** React Query 5.83.0 (configured, not yet used)
- **Form Validation:** React Hook Form 7.61.1 + Zod 3.25.76
- **Icons:** Lucide React 0.462.0

### Current Frontend Structure
```
src/
├── pages/
│   ├── Index.tsx          # Homepage with hero, services, testimonials
│   ├── Services.tsx       # Service listings (Web, App, AI, QA, DevOps)
│   ├── About.tsx          # Company information
│   ├── Contact.tsx        # Contact form (needs backend integration)
│   └── NotFound.tsx       # 404 page
├── components/
│   ├── layout/
│   │   ├── Header.tsx     # Navigation with theme toggle
│   │   ├── Footer.tsx     # Footer with links
│   │   └── Layout.tsx     # Main layout wrapper
│   ├── widgets/
│   │   ├── ChatWidget.tsx  # AI chat widget (needs backend)
│   │   └── WhatsAppButton.tsx # WhatsApp link (no backend needed)
│   └── ui/                # shadcn/ui components
└── hooks/
    ├── useTheme.tsx       # Dark/light theme management
    └── use-toast.ts       # Toast notifications
```

### Frontend Features Requiring Backend

#### 1. Contact Form (`Contact.tsx`)
**Current State:**
- ✅ Form validation with Zod schema
- ✅ UI/UX complete
- ⏳ API call simulated (needs real endpoint)

**Required Backend Integration:**
```typescript
// Current (simulated)
await new Promise((resolve) => setTimeout(resolve, 1500));

// Required (real API)
const response = await fetch('http://localhost:8000/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, message })
});
```

#### 2. Chat Widget (`ChatWidget.tsx`)
**Current State:**
- ✅ UI complete with animations
- ✅ Message history management
- ⏳ Hard-coded FAQ responses (needs RAG backend)

**Required Backend Integration:**
```typescript
// Current (hard-coded)
const getResponse = (message: string): string => {
  // Simple keyword matching
  return faqResponses.services;
};

// Required (RAG backend)
const response = await fetch('http://localhost:8000/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    message: inputValue, 
    session_id: sessionId 
  })
});
const data = await response.json();
// data.response contains AI-generated answer
```

#### 3. Services Page (`Services.tsx`)
**Current State:**
- ✅ Service cards displayed
- ⏳ No quote/inquiry functionality

**Optional Backend Integration:**
- Add "Get Quote" button → `/api/services/quote` endpoint

---

## Backend Architecture

### Technology Stack
- **Framework:** FastAPI (Python)
- **Database:** Supabase (PostgreSQL + pgvector)
- **AI Model:** Google Gemini 1.5 Flash (free tier)
- **Embeddings:** OpenAI text-embedding-3-small
- **Server:** Uvicorn ASGI server

### Backend Structure
```
backend/
├── main.py                 # FastAPI app entry point
├── config.py              # Environment variables
├── database.py            # Supabase client
├── models.py              # Pydantic data models
├── routes/
│   ├── contact.py        # Contact form endpoint
│   ├── chat.py           # AI chat endpoint
│   └── services.py       # Service inquiry endpoint
├── services/
│   ├── gemini.py         # Gemini 1.5 Flash integration
│   ├── embeddings.py     # Vector embeddings
│   └── rag.py            # RAG pipeline
└── requirements.txt       # Python dependencies
```

### Backend Endpoints

#### 1. POST `/api/contact`
**Purpose:** Handle contact form submissions

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I'm interested in your services"
}
```

**Response:**
```json
{
  "success": true,
  "id": "uuid-here"
}
```

**Backend Logic:**
1. Validate input (Pydantic model)
2. Insert into `contact_submissions` table
3. Upsert email into `user_emails` table
4. Return success response

#### 2. POST `/api/chat`
**Purpose:** AI chatbot with RAG (Retrieval Augmented Generation)

**Request:**
```json
{
  "message": "What services do you offer?",
  "session_id": "client-generated-uuid"
}
```

**Response:**
```json
{
  "response": "We offer Web Development, App Development...",
  "sources": ["Web Development Services", "Service Overview"]
}
```

**Backend Logic:**
1. Generate embedding for user query
2. Search similar documents in `knowledge_base` (vector similarity)
3. Build context from top 3-5 documents
4. Call Gemini 1.5 Flash with context
5. Store conversation in `chat_messages`
6. Return response + sources

#### 3. POST `/api/services/quote` (Optional)
**Purpose:** Service inquiry/quote requests

**Request:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "service_type": "web_dev",
  "message": "I need a website for my business"
}
```

**Response:**
```json
{
  "success": true,
  "inquiry_id": "uuid-here",
  "message": "Thank you! We'll contact you within 24 hours."
}
```

---

## Integration Points

### 1. Contact Form Integration

**Frontend Flow:**
```
User fills form → Validation (Zod) → Submit → 
POST /api/contact → Success toast → Reset form
```

**Backend Flow:**
```
Receive request → Validate (Pydantic) → 
Save to database → Return success
```

**Data Flow:**
```
Contact.tsx (React)
    ↓ (HTTP POST)
FastAPI /api/contact
    ↓ (SQL INSERT)
Supabase contact_submissions table
    ↓ (SQL UPSERT)
Supabase user_emails table
    ↓ (HTTP 200)
Contact.tsx (Success toast)
```

### 2. Chat Widget Integration

**Frontend Flow:**
```
User types message → Send → 
POST /api/chat → Display response → 
Add to message history
```

**Backend Flow:**
```
Receive message → Generate embedding → 
Search vectors → Build context → 
Call Gemini 1.5 Flash → Store messages → 
Return response
```

**Data Flow:**
```
ChatWidget.tsx (React)
    ↓ (HTTP POST with message)
FastAPI /api/chat
    ↓ (Generate embedding)
OpenAI Embeddings API
    ↓ (Vector search)
Supabase knowledge_base (pgvector)
    ↓ (Retrieve top 3-5 docs)
Build context string
    ↓ (AI generation)
Gemini 1.5 Flash API
    ↓ (Store conversation)
Supabase chat_messages table
    ↓ (HTTP 200 with response)
ChatWidget.tsx (Display response)
```

### 3. Service Inquiry Integration (Optional)

**Frontend Flow:**
```
User clicks "Get Quote" → Modal form → 
Submit → POST /api/services/quote → 
Success message
```

**Backend Flow:**
```
Receive inquiry → Validate → 
Save to database → Return success
```

---

## Data Flow Diagrams

### Complete System Flow

```
┌──────────────┐
│   Browser    │
│  (React SPA) │
└──────┬───────┘
       │
       │ HTTP Requests
       │
       ▼
┌─────────────────────────────────────┐
│      Python FastAPI Backend         │
│                                     │
│  ┌──────────┐  ┌──────────┐       │
│  │ /contact │  │  /chat   │       │
│  └────┬─────┘  └────┬──────┘       │
│       │             │               │
│       │             │               │
│       ▼             ▼               │
│  ┌─────────┐  ┌──────────────┐    │
│  │ Database│  │ RAG Pipeline │    │
│  │ Handler │  │              │    │
│  └────┬────┘  │ 1. Embedding │    │
│       │       │ 2. Vector    │    │
│       │       │    Search    │    │
│       │       │ 3. Gemini    │    │
│       │       └──────┬───────┘    │
│       │              │             │
│       └──────┬───────┘             │
│              │                     │
└──────────────┼─────────────────────┘
               │
               │ SQL Queries
               │ API Calls
               │
       ┌───────┴────────┐
       │                │
       ▼                ▼
┌─────────────┐  ┌──────────────┐
│  Supabase   │  │  AI Services │
│  Database   │  │              │
│             │  │ - OpenAI     │
│ - PostgreSQL│  │   Embeddings │
│ - pgvector  │  │ - Gemini 1.5 │
│ - Storage   │  │   Flash      │
└─────────────┘  └──────────────┘
```

### RAG Pipeline Detailed Flow

```
User Query: "What services do you offer?"
    │
    ▼
┌─────────────────────────┐
│ Generate Query Embedding│
│ (OpenAI API)            │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Vector Similarity Search│
│ (Supabase pgvector)     │
│                         │
│ SELECT * FROM           │
│ knowledge_base          │
│ ORDER BY embedding <->   │
│ query_embedding         │
│ LIMIT 5                 │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Build Context String    │
│                         │
│ "Based on our services: │
│ 1. Web Development...    │
│ 2. App Development...    │
│ ..."                    │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Call Gemini 1.5 Flash   │
│                         │
│ Prompt:                 │
│ "You are Delta...       │
│ Context: {context}       │
│ Question: {query}"       │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Return AI Response      │
│ "We offer Web Dev,      │
│  App Dev, AI Dev..."    │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Store in Database      │
│ - User message          │
│ - Assistant response    │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Return to Frontend      │
│ {response, sources}     │
└─────────────────────────┘
```

---

## API Contracts

### Contact API

**Endpoint:** `POST /api/contact`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```typescript
{
  name: string;      // Min 2 characters
  email: string;     // Valid email format
  message: string;   // Min 10 characters
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "error": "Validation error",
  "details": {
    "email": ["Invalid email format"]
  }
}
```

### Chat API

**Endpoint:** `POST /api/chat`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```typescript
{
  message: string;      // User's message
  session_id: string;  // Client-generated UUID
}
```

**Response (Success - 200):**
```json
{
  "response": "We offer comprehensive web development services...",
  "sources": [
    "Web Development Services",
    "Service Overview"
  ],
  "cached": false
}
```

**Response (Rate Limit - 429):**
```json
{
  "response": "I'm experiencing high traffic. Please try again in a moment.",
  "error": "rate_limit",
  "sources": []
}
```

**Response (Error - 500):**
```json
{
  "response": "I encountered an error. Please contact us directly.",
  "error": "api_error",
  "sources": []
}
```

### Service Quote API (Optional)

**Endpoint:** `POST /api/services/quote`

**Request Body:**
```typescript
{
  name: string;
  email: string;
  service_type: "web_dev" | "app_dev" | "ai_dev" | "qa" | "devops";
  message: string;
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "inquiry_id": "uuid-here",
  "message": "Thank you! We'll contact you within 24 hours."
}
```

---

## Database Schema

### Supabase PostgreSQL Tables

#### 1. `contact_submissions`
```sql
CREATE TABLE contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_contact_email ON contact_submissions(email);
CREATE INDEX idx_contact_created ON contact_submissions(created_at);
```

#### 2. `chat_messages`
```sql
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_chat_session ON chat_messages(session_id);
CREATE INDEX idx_chat_created ON chat_messages(created_at);
```

#### 3. `knowledge_base` (for RAG)
```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT,
    embedding vector(1536),  -- OpenAI embedding dimension
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Vector similarity index
CREATE INDEX ON knowledge_base 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Category index
CREATE INDEX idx_kb_category ON knowledge_base(category);
```

#### 4. `user_emails` (lead collection)
```sql
CREATE TABLE user_emails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    source TEXT,  -- 'contact_form', 'chat_widget', 'service_inquiry'
    service_interest TEXT,
    subscribed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_email ON user_emails(email);
```

#### 5. Vector Search Function
```sql
CREATE OR REPLACE FUNCTION match_documents(
    query_embedding vector(1536),
    match_threshold float DEFAULT 0.7,
    match_count int DEFAULT 5,
    category_filter text DEFAULT NULL
)
RETURNS TABLE (
    id uuid,
    title text,
    content text,
    category text,
    similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        kb.id,
        kb.title,
        kb.content,
        kb.category,
        1 - (kb.embedding <=> query_embedding) as similarity
    FROM knowledge_base kb
    WHERE 
        1 - (kb.embedding <=> query_embedding) > match_threshold
        AND (category_filter IS NULL OR kb.category = category_filter)
    ORDER BY kb.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;
```

---

## RAG Implementation

### Knowledge Base Content Structure

**Initial Documents to Populate:**

1. **Services (5 documents)**
   - Web Development Services
   - App Development Services
   - AI Development Services
   - QA Services
   - DevOps Services

2. **Service Details (15-20 documents)**
   - Technology stacks
   - Pricing information
   - Project timelines
   - Use cases

3. **FAQ (20-30 documents)**
   - Common questions
   - Process questions
   - Technical questions

4. **Company Info (5 documents)**
   - About DeltaPrime
   - Mission & Values
   - Team expertise

### RAG Pipeline Code

**services/rag.py:**
```python
from services.embeddings import get_embedding
from services.gemini import generate_response
from database import supabase

async def get_rag_response(query: str):
    # 1. Generate query embedding
    query_embedding = await get_embedding(query)
    
    # 2. Vector similarity search
    results = supabase.rpc("match_documents", {
        "query_embedding": query_embedding,
        "match_threshold": 0.7,
        "match_count": 5
    }).execute()
    
    # 3. Build context
    context_parts = []
    for doc in results.data:
        context_parts.append(f"Title: {doc['title']}\nContent: {doc['content']}")
    context = "\n\n---\n\n".join(context_parts)
    
    # 4. Generate response
    response = await generate_response(context, query)
    
    # 5. Extract sources
    sources = [doc["title"] for doc in results.data]
    
    return response, sources
```

**services/gemini.py:**
```python
import google.generativeai as genai
import os

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

async def generate_response(context: str, query: str):
    system_prompt = """You are Delta, the AI assistant for DeltaPrime AI Solutions.
We offer: Web Development, App Development, AI Development, QA Services, and DevOps.

Answer questions based ONLY on the provided context about our services.
If the answer isn't in the context, politely say you don't have that information 
and suggest contacting the team directly at hello@deltaprime.ai or through our contact form.

Be friendly, professional, and concise. Keep responses under 200 words."""

    prompt = f"""{system_prompt}

Context:
{context}

Question: {query}

Answer:"""
    
    try:
        response = model.generate_content(
            prompt,
            generation_config={
                "temperature": 0.7,
                "top_p": 0.8,
                "top_k": 40,
                "max_output_tokens": 512,
            }
        )
        return response.text
    except Exception as e:
        if "429" in str(e) or "quota" in str(e).lower():
            return "I'm experiencing high traffic right now. Please try again in a moment or contact us directly at hello@deltaprime.ai"
        return "I encountered an error. Please contact us directly at hello@deltaprime.ai"
```

**services/embeddings.py:**
```python
from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def get_embedding(text: str):
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding
```

---

## Security Considerations

### 1. API Security

**CORS Configuration:**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",  # Development
        "https://yourdomain.com"   # Production
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)
```

**Rate Limiting:**
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@router.post("/api/chat")
@limiter.limit("10/minute")  # 10 requests per minute per IP
async def chat_message(request: Request, chat_data: ChatRequest):
    # Implementation
    pass
```

### 2. Input Validation

**Frontend (Zod):**
```typescript
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
```

**Backend (Pydantic):**
```python
from pydantic import BaseModel, EmailStr, validator

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    message: str
    
    @validator('name')
    def name_length(cls, v):
        if len(v) < 2:
            raise ValueError('Name must be at least 2 characters')
        return v
    
    @validator('message')
    def message_length(cls, v):
        if len(v) < 10:
            raise ValueError('Message must be at least 10 characters')
        return v
```

### 3. Environment Variables

**Never commit API keys:**
```python
# .env file (gitignored)
SUPABASE_URL=your_url
SUPABASE_KEY=your_key
GEMINI_API_KEY=your_key
OPENAI_API_KEY=your_key
```

### 4. SQL Injection Prevention

- Use Supabase client (parameterized queries)
- Never use raw SQL with user input
- Validate all inputs before database operations

---

## Deployment Strategy

### Frontend Deployment

**Option 1: Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Option 2: Netlify**
```bash
# Build
npm run build

# Deploy dist/ folder to Netlify
```

**Environment Variables:**
- `VITE_API_URL` - Backend API URL

### Backend Deployment

**Option 1: Railway**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy
railway up
```

**Option 2: Render**
- Connect GitHub repository
- Set build command: `pip install -r requirements.txt`
- Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

**Environment Variables:**
- `SUPABASE_URL`
- `SUPABASE_KEY`
- `GEMINI_API_KEY`
- `OPENAI_API_KEY`
- `CORS_ORIGINS` (comma-separated)

### Database Deployment

**Supabase:**
- Already hosted/managed
- Run SQL migrations via Supabase dashboard
- Populate knowledge_base via admin panel or script

---

## Testing Strategy

### Frontend Tests

**Unit Tests (Jest + React Testing Library):**
```typescript
// Contact.test.tsx
test('submits contact form', async () => {
  // Mock API call
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ success: true })
    })
  );
  
  // Test form submission
  // Assert API call made
  // Assert success toast shown
});
```

### Backend Tests

**API Tests (pytest):**
```python
# test_contact.py
def test_contact_submission(client):
    response = client.post("/api/contact", json={
        "name": "Test User",
        "email": "test@example.com",
        "message": "Test message"
    })
    assert response.status_code == 200
    assert response.json()["success"] == True
```

### Integration Tests

**End-to-End (Playwright):**
```typescript
test('contact form flow', async ({ page }) => {
  await page.goto('/contact');
  await page.fill('[name="name"]', 'Test User');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="message"]', 'Test message');
  await page.click('button[type="submit"]');
  await expect(page.locator('.toast')).toContainText('Message Sent!');
});
```

---

## Future Enhancements

### Phase 1 (MVP)
- ✅ Contact form backend
- ✅ Chat widget with RAG
- ✅ Basic knowledge base

### Phase 2
- ⏳ Service inquiry form
- ⏳ Admin dashboard
- ⏳ Email notifications

### Phase 3
- ⏳ Voice agent (STT/TTS)
- ⏳ Real-time chat (WebSocket)
- ⏳ Analytics dashboard

### Phase 4
- ⏳ Multi-language support
- ⏳ Advanced RAG (reranking)
- ⏳ A/B testing for responses

---

## Conclusion

### Current Status
- **Frontend:** ✅ Production-ready
- **Backend:** ⏳ Needs implementation
- **Integration:** ⏳ Pending

### Next Steps
1. Set up Supabase database and tables
2. Implement Python FastAPI backend
3. Configure RAG pipeline with Gemini 1.5 Flash
4. Populate knowledge base
5. Test integration end-to-end
6. Deploy to production

### Estimated Timeline
- **Backend Development:** 1-2 weeks
- **RAG Setup:** 3-5 days
- **Testing & Deployment:** 1 week
- **Total:** 3-4 weeks

---

**Report Generated:** December 2024  
**Version:** 1.0  
**Status:** Draft - Pending Implementation



