# Voice Agent + RAG System Integration Guide

## Overview
The Voice Agent is now fully integrated with the RAG (Retrieval-Augmented Generation) system. This means:

✅ **Responses are ONLY based on website context**  
✅ **No hallucinations or outside knowledge**  
✅ **Automatic source tracking**  
✅ **Database logging of all interactions**

## Architecture

### Flow Diagram
```
User Speech 
    ↓
Web Audio API (Browser)
    ↓
/api/voice/transcribe (Backend)
    ↓
Gemini Audio Transcription
    ↓
RAG Pipeline (Supabase Vector Search)
    ↓
Match Documents (threshold: 0.7)
    ↓
Gemini Response (with STRICT grounding)
    ↓
Text-to-Speech Response
    ↓
Browser Speaker
```

## Database Schema

### Knowledge Base Table
```sql
CREATE TABLE knowledge_base (
    id UUID PRIMARY KEY,
    title TEXT,                    -- Document title
    content TEXT,                  -- Full content
    category TEXT,                 -- web_dev, app_dev, ai_dev, qa, devops, etc.
    source TEXT UNIQUE,            -- Unique identifier for updates
    embedding vector(1536),        -- Vector representation (OpenAI)
    metadata JSONB,                -- Additional info
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Voice Interactions Table (NEW)
```sql
CREATE TABLE voice_interactions (
    id UUID PRIMARY KEY,
    session_id TEXT,               -- User session
    user_input TEXT,               -- What user said
    bot_response TEXT,             -- What bot responded
    sources_used TEXT[],           -- Which KB documents were used
    interaction_type TEXT,         -- 'voice', 'chat', etc.
    confidence_score FLOAT,        -- Optional: relevance score
    created_at TIMESTAMP
);
```

## RAG Strict Mode Features

### 1. Strict Grounding Rules (Backend)
In `services/rag.py`:

```python
STRICT_GROUNDING_HEADER = """
You are DeltaPrime AI Assistant.

STRICT GROUNDING RULES (NON-NEGOTIABLE):
1) Use ONLY the information in the CONTEXT below.
2) Do NOT use outside knowledge, assumptions, or guesses.
3) If the answer is not explicitly supported by the CONTEXT, 
   reply EXACTLY with: "I don't have that information available..."
"""
```

### 2. Vector Search Threshold
- **Threshold**: 0.7 (cosine similarity)
- **Behavior**: Only returns documents with >70% similarity match
- **Tunable**: Edit in `services/rag.py` line ~46

### 3. Fallback Response
If NO matching documents found:
```
"I don't have that information available on the DeltaPrime AI Solutions website yet. 
Would you like me to connect you with our team?"
```

## Setup Instructions

### Step 1: Enable Supabase Extensions

In Supabase Dashboard → SQL Editor → Run:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

### Step 2: Create Tables

Run [database_setup.sql](database_setup.sql) in Supabase SQL Editor.

This creates:
- `knowledge_base` table with vector support
- `voice_interactions` table
- `match_documents` RPC function (vector search)
- Seed data for services

### Step 3: Generate Embeddings

Run this Python script to embed your knowledge base:

```bash
python backend/generate_embeddings.py
```

This:
- Reads all knowledge_base entries
- Generates OpenAI embeddings
- Updates embeddings in Supabase
- Ready for vector search

### Step 4: Configure Environment

**.env file** (Backend):
```
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

## Usage

### For Users
1. Click the **Microphone** button (bottom-right)
2. Click **"Start Speaking"**
3. Speak your question
4. Click **"Stop Recording"** (or wait for auto-detection)
5. Bot responds with voice + text

### For Developers

#### Add Custom Knowledge
Insert into `knowledge_base`:

```python
supabase.table("knowledge_base").insert({
    "title": "Custom Service",
    "content": "Description of the service...",
    "category": "services",
    "source": "custom:my_service",
    "metadata": {"type": "custom", "priority": 1}
}).execute()
```

Then regenerate embeddings:
```bash
python backend/generate_embeddings.py
```

#### Query Voice Interactions
```sql
SELECT 
    user_input,
    bot_response,
    sources_used,
    created_at
FROM voice_interactions
WHERE session_id = 'voice_session_xxxxx'
ORDER BY created_at DESC;
```

#### Check Vector Search
```sql
SELECT 
    title,
    content,
    1 - (embedding <=> '[...]'::vector) as similarity
FROM knowledge_base
WHERE 1 - (embedding <=> '[...]'::vector) > 0.7
ORDER BY embedding <=> '[...]'::vector
LIMIT 5;
```

## Testing

### Test the RAG System
```python
# backend/test_rag.py
import asyncio
from services.rag import get_rag_response

async def test():
    response, sources = await get_rag_response("What services do you offer?")
    print(f"Response: {response}")
    print(f"Sources: {sources}")

asyncio.run(test())
```

### Test Voice Endpoint
```bash
# Record a test audio file (or use an existing .wav)
curl -F "audio=@test_audio.wav" \
     -F "session_id=test_session" \
     http://localhost:8000/api/voice/transcribe
```

## Tuning Parameters

### Adjust Vector Similarity Threshold
**File**: `backend/services/rag.py` (line ~46)

```python
# More strict (fewer false positives)
"match_threshold": 0.8,  # Default: 0.7

# More lenient (more results)
"match_threshold": 0.6,
```

### Adjust Number of Matched Documents
**File**: `backend/services/rag.py` (line ~46)

```python
# Return more context
"match_count": 10,  # Default: 5

# Return fewer documents
"match_count": 3,
```

### Change Speech Recognition Language
**File**: `src/components/widgets/VoiceAgent.tsx` (line ~104)

```typescript
const utterance = new SpeechSynthesisUtterance(text);
utterance.lang = "en-US";  // Change language code
```

## Monitoring

### Check API Health
```bash
curl http://localhost:8000/api/health
```

### View Recent Voice Interactions
```sql
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_interactions,
    COUNT(DISTINCT session_id) as unique_sessions
FROM voice_interactions
GROUP BY DATE(created_at)
ORDER BY date DESC
LIMIT 7;
```

### Find Unanswerable Questions
```sql
SELECT user_input, COUNT(*) as frequency
FROM voice_interactions
WHERE bot_response LIKE '%don''t have that information%'
GROUP BY user_input
ORDER BY frequency DESC;
```

## Troubleshooting

### Problem: "Could not transcribe audio"
- **Cause**: Audio file corrupted or Gemini API key invalid
- **Solution**: Check GEMINI_API_KEY in .env

### Problem: "No matching documents found"
- **Cause**: Knowledge base not embedded or threshold too high
- **Solution**: Run `generate_embeddings.py` and lower match_threshold

### Problem: Bot responds with generic answers
- **Cause**: STRICT_GROUNDING_HEADER not working
- **Solution**: Check `services/rag.py` context building

### Problem: Microphone permission denied
- **Cause**: Browser not allowed access
- **Solution**: Check browser microphone permissions for localhost

## Performance Tips

1. **Embeddings**: Run `generate_embeddings.py` weekly to update KB
2. **Vector Index**: Monitor Supabase query performance
3. **Caching**: Consider caching frequent questions
4. **Batch Uploads**: Use `generate_embeddings.py --batch-size=100`

## Security Notes

⚠️ **Only use ANON_KEY for frontend API calls**  
✅ **Use SERVICE_ROLE_KEY for admin operations**  
✅ **Enable RLS on Supabase tables**  
✅ **Rate limit /api/voice/transcribe endpoint**

## Next Steps

- [ ] Add analytics dashboard for voice interactions
- [ ] Implement feedback loop (user rating responses)
- [ ] Add multi-language support
- [ ] Implement voice agent customization (accent, speed)
- [ ] Add confidence scoring for sources
