# Voice Agent + RAG Backend Setup Guide

## Quick Start

### 1. Prerequisites
- Python 3.8+
- Supabase account (free tier works)
- OpenAI API key
- Google Gemini API key

### 2. Environment Setup

Create `.env` file in `backend/` directory:

```env
# Gemini API (for transcription and response generation)
GEMINI_API_KEY=your_gemini_api_key_here

# OpenAI API (for embeddings)
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key_here

# CORS (for frontend access)
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,https://yourdomain.com
```

### 3. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

All required packages:
- ✅ fastapi - Web framework
- ✅ uvicorn - ASGI server
- ✅ python-dotenv - Environment variables
- ✅ supabase - Database client
- ✅ google-generativeai - Gemini API
- ✅ openai - OpenAI embeddings
- ✅ pydantic - Data validation
- ✅ python-multipart - File uploads
- ✅ slowapi - Rate limiting
- ✅ email-validator - Email validation

### 4. Supabase Setup

**Step A: Enable Vector Extension**

In Supabase Dashboard:
1. Go to **SQL Editor**
2. Click **New Query**
3. Run this:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

4. Click **Run**

**Step B: Create Database Tables**

1. In **SQL Editor**, create new query
2. Copy entire contents of [database_setup.sql](database_setup.sql)
3. Run it

This creates:
- `knowledge_base` - RAG document store with vectors
- `voice_interactions` - Voice agent logs
- `chat_messages` - Chat history
- `meeting_requests` - Meeting booking
- And helper tables...

### 5. Generate Embeddings

Once tables are created:

```bash
python backend/generate_embeddings.py
```

This:
- Reads seed knowledge_base entries
- Generates OpenAI embeddings (1536 dimensions)
- Updates knowledge_base table
- Enables vector search

**Expected output:**
```
Processing document: Web Development Services
✓ Embedding generated and saved
✓ All embeddings complete!
```

### 6. Test RAG System

Before starting the server, test the RAG:

```bash
python backend/test_rag.py
```

**Expected output:**
```
[Test 1/15]
Query: What services do you offer?
Response: [Service description from KB]
Sources Used: ['Web Development Services', 'App Development Services']
✓ ANSWERED (found in KB)

[Test 2/15]
Query: What's the weather today?
Response: I don't have that information available...
✓ CORRECTLY REFUSED (not in KB)
```

### 7. Start Backend Server

```bash
python backend/main.py
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

Test the health endpoint:
```bash
curl http://localhost:8000/api/health
```

### 8. Start Frontend

In a new terminal:

```bash
cd deltaprime-ai-hub-main
bun install
bun run dev
```

Frontend will run at `http://localhost:5173`

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    USER INTERACTION                      │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Voice Agent Widget (VoiceAgent.tsx)                     │
│  ├─ Microphone input (Web Audio API)                     │
│  └─ Speaker output (Web Speech API)                      │
│                                                           │
└────────────────────┬────────────────────────────────────┘
                     │ 
                     ↓
        ┌────────────────────────────┐
        │  Backend API Gateway        │
        │ /api/voice/transcribe       │
        └────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         ↓                       ↓
   ┌──────────────┐      ┌──────────────────┐
   │ Gemini API   │      │ Vector Database  │
   │ Transcription│      │ (Supabase)       │
   └──────────────┘      │                  │
         │               │ RAG Search:      │
         ↓               │ match_documents()│
    ┌─────────────────────────────────┐     │
    │  RAG Pipeline (rag.py)           │     │
    │                                  │←────┘
    │ 1. Embed query                   │
    │ 2. Vector search (threshold 0.7) │
    │ 3. Build strict context          │
    │ 4. Generate response w/ Gemini   │
    │ 5. Store interaction             │
    └─────────────────────────────────┘
         │
         ↓
    ┌──────────────────────┐
    │ Bot Response + TTS   │
    │ (Text-to-Speech)     │
    └──────────────────────┘
         │
         ↓
    ┌──────────────────────┐
    │ User hears response  │
    └──────────────────────┘
```

## Key Files

### Frontend
- `src/components/widgets/VoiceAgent.tsx` - Main voice UI component

### Backend
- `backend/routes/voice.py` - Voice API endpoint
- `backend/services/rag.py` - RAG pipeline (strict mode)
- `backend/services/embeddings.py` - OpenAI embedding generation
- `backend/services/gemini.py` - Gemini integration
- `backend/main.py` - FastAPI app setup

### Database
- `backend/database_setup.sql` - All table schemas
- `backend/database.py` - Supabase client

## API Endpoints

### Voice Transcription (NEW)
```
POST /api/voice/transcribe

Request:
  - audio (file): WAV audio file
  - session_id (string): User session ID

Response:
  {
    "transcribed_text": "What services do you offer?",
    "response": "DeltaPrime offers web development...",
    "sources": ["Web Development Services"],
    "session_id": "voice_session_xxx",
    "status": "success"
  }
```

### Chat (Existing - uses same RAG)
```
POST /api/chat

Request:
  {
    "message": "Tell me about AI development",
    "session_id": "chat_session_xxx"
  }

Response:
  {
    "response": "DeltaPrime specializes in AI development...",
    "sources": ["AI Development Services"]
  }
```

## Database Queries

### View Voice Interactions
```sql
SELECT 
    user_input,
    bot_response,
    sources_used,
    created_at
FROM voice_interactions
ORDER BY created_at DESC
LIMIT 10;
```

### Find Unanswerable Questions
```sql
SELECT 
    user_input,
    COUNT(*) as frequency
FROM voice_interactions
WHERE bot_response LIKE '%don''t have that information%'
GROUP BY user_input
ORDER BY frequency DESC;
```

### Check Knowledge Base
```sql
SELECT 
    title,
    category,
    LENGTH(content) as content_length,
    embedding IS NOT NULL as has_embedding
FROM knowledge_base
ORDER BY category;
```

## Troubleshooting

### "Supabase is not configured"
```
❌ Error: Supabase URL and KEY not in .env
✓ Solution: Add SUPABASE_URL and SUPABASE_KEY to backend/.env
```

### "429 - Rate limit exceeded"
```
❌ Error: Gemini API rate limit hit
✓ Solutions:
  - Wait 1 minute and retry
  - Upgrade Gemini API plan
  - Check GEMINI_API_KEY is valid
```

### "Could not transcribe audio"
```
❌ Error: Audio file corrupted or Gemini rejected it
✓ Solutions:
  - Use WAV format (not MP3)
  - Check audio duration (less than 5 minutes)
  - Check GEMINI_API_KEY
```

### "No matching documents found"
```
❌ Error: Knowledge base not embedded
✓ Solutions:
  - Run: python backend/generate_embeddings.py
  - Check OPENAI_API_KEY is valid
  - Lower match_threshold in rag.py (0.6 instead of 0.7)
```

### "ModuleNotFoundError"
```
❌ Error: Python package not installed
✓ Solution: 
  pip install -r backend/requirements.txt
```

## Configuration Tuning

### RAG Strict Mode Parameters

**File: `backend/services/rag.py`**

```python
# Similarity threshold (0.0 to 1.0)
"match_threshold": 0.7,  # Higher = stricter

# Number of documents to retrieve
"match_count": 5,  # More = broader context

# System prompt enforces strict grounding
STRICT_GROUNDING_HEADER = "..."
```

### Voice Parameters

**File: `src/components/widgets/VoiceAgent.tsx`**

```typescript
// Text-to-speech settings
utterance.rate = 1;        // Speed (0.5 = slow, 2 = fast)
utterance.pitch = 1;       // Pitch (0.5 = low, 2 = high)
utterance.volume = 1;      // Volume (0.0 to 1.0)
```

## Performance Optimization

### 1. Embedding Caching
```bash
# Regenerate embeddings only when KB changes
python backend/generate_embeddings.py
```

### 2. Vector Index
Supabase automatically creates IVFFLAT index on embeddings.

### 3. Rate Limiting
Add to `backend/main.py`:
```python
from slowapi import Limiter
limiter = Limiter(key_func=...)
@router.post("/transcribe")
@limiter.limit("10/minute")
async def transcribe_voice(...):
```

## Security Best Practices

✅ **Use ANON_KEY for frontend API**  
✅ **Use SERVICE_ROLE_KEY only for admin operations**  
✅ **Enable Row-Level Security (RLS) on Supabase**  
✅ **Validate audio file size before processing**  
✅ **Rate limit transcription endpoint**  
⚠️ **Never commit API keys to git**

## Monitoring

### Backend Health
```bash
curl http://localhost:8000/api/health
```

### Voice Interactions Analytics
```sql
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total,
    COUNT(DISTINCT session_id) as users
FROM voice_interactions
GROUP BY DATE(created_at);
```

### Response Quality
```sql
SELECT 
    AVG(CASE WHEN bot_response LIKE '%don''t have%' THEN 1 ELSE 0 END) as refusal_rate
FROM voice_interactions;
```

## Next Steps

1. ✅ Complete the setup above
2. Test with `python backend/test_rag.py`
3. Try voice agent in browser
4. Add custom KB documents
5. Monitor interactions in Supabase
6. Fine-tune RAG parameters based on usage

## Support

For issues:
1. Check logs: `python backend/main.py 2>&1 | tee backend.log`
2. Test RAG: `python backend/test_rag.py`
3. Check .env variables
4. Review error in [RAG_VOICE_INTEGRATION.md](RAG_VOICE_INTEGRATION.md)
