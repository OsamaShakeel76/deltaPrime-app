# Voice Agent + RAG System - Deployment Checklist

## Pre-Deployment Checklist

### Environment Setup
- [ ] Create `backend/.env` file
- [ ] Add `GEMINI_API_KEY` (from Google AI Studio)
- [ ] Add `OPENAI_API_KEY` (from OpenAI dashboard)
- [ ] Add `SUPABASE_URL` (from Supabase project settings)
- [ ] Add `SUPABASE_KEY` (anon key from Supabase)
- [ ] Add `CORS_ORIGINS` for frontend URLs

### Supabase Setup
- [ ] Enable `vector` extension in Supabase
- [ ] Enable `pgcrypto` extension in Supabase
- [ ] Run `database_setup.sql` in Supabase SQL editor
- [ ] Verify all tables created:
  - [ ] `knowledge_base`
  - [ ] `voice_interactions`
  - [ ] `chat_messages`
  - [ ] `meeting_requests`
  - [ ] `contact_submissions`

### Backend Setup
- [ ] Install Python 3.8+
- [ ] `pip install -r backend/requirements.txt`
- [ ] Run `python backend/generate_embeddings.py`
- [ ] Verify embeddings generated: `SELECT COUNT(*) FROM knowledge_base WHERE embedding IS NOT NULL`
- [ ] Test RAG system: `python backend/test_rag.py`
- [ ] All tests pass with ✓ marks

### Frontend Setup
- [ ] Install Node.js/Bun
- [ ] `bun install`
- [ ] VoiceAgent component created: ✓
- [ ] VoiceAgent imported in App.tsx: ✓
- [ ] ChatWidget still working: ✓

### Testing
- [ ] Backend health check: `curl http://localhost:8000/api/health`
- [ ] Test voice endpoint (manual audio file)
- [ ] Browser microphone permissions granted
- [ ] Text-to-speech works in browser
- [ ] Refusal responses working (ask "what's the weather")
- [ ] Knowledge-based responses working (ask "what services do you offer")

---

## Step-by-Step Deployment

### 1. Backend Initialization (5 minutes)

```bash
cd backend

# Check Python version
python --version  # Should be 3.8+

# Install dependencies
pip install -r requirements.txt

# Verify .env file
cat .env  # Should show all keys

# Generate embeddings
python generate_embeddings.py
# Output should show: ✓ All embeddings complete!
```

### 2. Test RAG System (3 minutes)

```bash
python test_rag.py
# Should show:
# ✓ ANSWERED (found in KB) - for service questions
# ✓ CORRECTLY REFUSED - for unrelated questions
```

### 3. Start Backend Server (1 minute)

```bash
python main.py
# Output should show:
# INFO:     Uvicorn running on http://0.0.0.0:8000
# INFO:     Application startup complete
```

### 4. Frontend Setup (2 minutes)

In another terminal:
```bash
cd deltaprime-ai-hub-main
bun install
bun run dev
# Output should show:
# VITE v... ready in ... ms
# ➜  Local:   http://localhost:5173
```

### 5. Manual Testing (10 minutes)

1. Open browser: `http://localhost:5173`
2. Find **microphone icon** (bottom-right, next to chat)
3. Click it to open Voice Agent
4. Click **"Start Speaking"**
5. Say: **"What services do you offer?"**
6. Click **"Stop Recording"**
7. Listen for voice response + see text
8. Try: **"What's the weather?"**
9. Verify refusal response

---

## Verification Checklist

### API Responses
```bash
# Test transcription endpoint
curl -X POST http://localhost:8000/api/voice/transcribe \
  -F "audio=@test_audio.wav" \
  -F "session_id=test_123"

# Response should include:
# {
#   "transcribed_text": "...",
#   "response": "...",
#   "sources": ["..."],
#   "status": "success"
# }
```

### Database
```bash
# Check voice interactions logged
# In Supabase SQL Editor:
SELECT COUNT(*) as total_interactions FROM voice_interactions;

# Check KB has embeddings
SELECT COUNT(*) FROM knowledge_base WHERE embedding IS NOT NULL;
# Should return: 8 (or more if custom KB added)
```

### Browser Console
```
❌ Errors should be minimal:
  - Only CORS warnings (if any) are acceptable
  - No "undefined" errors
  - No "Cannot find module" errors
```

---

## Performance Benchmarks

### Expected Response Times

| Operation | Time | Notes |
|-----------|------|-------|
| Audio Recording | 5-30s | User controlled |
| Transcription | 1-3s | Gemini API |
| Vector Search | 0.5-1s | Supabase |
| Response Generation | 2-4s | Gemini API |
| Text-to-Speech | 2-5s | Browser native |
| **Total User Flow** | **10-20s** | End-to-end |

### Optimization Tips
- Cache embeddings locally
- Pre-warm vector index
- Batch process logs
- Monitor API quotas

---

## Troubleshooting During Deployment

### Issue: "ModuleNotFoundError: No module named 'supabase'"
```bash
pip install supabase==2.3.0
```

### Issue: "Supabase is not configured"
```
Check:
1. .env file exists in backend/
2. SUPABASE_URL is set
3. SUPABASE_KEY is set (use anon key, not service key)
4. Both values are correct (no extra spaces)
```

### Issue: "No matching documents found" (always refuses)
```
Run:
1. python backend/generate_embeddings.py
2. Wait for completion
3. Verify: SELECT COUNT(*) FROM knowledge_base WHERE embedding IS NOT NULL;
4. Should return > 0
```

### Issue: Microphone permission denied
```
Browser settings:
1. Check site permissions (microphone)
2. Reset browser permissions for localhost
3. Try in incognito mode
4. Ensure using HTTPS in production
```

### Issue: Voice response not playing
```
Check:
1. Browser volume not muted
2. Speaker connected
3. Check browser console for errors
4. Test with text response first
```

---

## Production Deployment

### Before Going Live

- [ ] Set `CORS_ORIGINS` to production domain
- [ ] Use service role key for admin operations (not anon)
- [ ] Enable RLS on Supabase tables
- [ ] Set up HTTPS certificate
- [ ] Configure rate limiting
- [ ] Add CAPTCHA if needed
- [ ] Set up monitoring/logging
- [ ] Create backup strategy
- [ ] Set up error tracking (Sentry)
- [ ] Document API keys securely

### Environment Variables (Production)

```env
GEMINI_API_KEY=***
OPENAI_API_KEY=***
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_anon_key_here
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
DEBUG=false
LOG_LEVEL=info
```

### Monitoring Commands

```bash
# Check logs
tail -f backend.log

# Monitor vector index performance
# In Supabase SQL Editor:
EXPLAIN ANALYZE 
SELECT * FROM knowledge_base 
WHERE 1 - (embedding <=> query_embedding) > 0.7;

# Check API usage
curl http://localhost:8000/api/health

# Monitor database connections
SELECT count(*) FROM pg_stat_activity;
```

---

## Rollback Plan

If issues occur:

### 1. Quick Rollback
```bash
# Kill running processes
pkill -f "python main.py"
pkill -f "bun run dev"

# Restore from git
git checkout HEAD -- src/components/widgets/VoiceAgent.tsx
git checkout HEAD -- backend/routes/voice.py

# Restart without voice agent
bun run dev  # Frontend only
```

### 2. Database Rollback
```sql
-- In Supabase SQL Editor:
DROP TABLE voice_interactions;
-- This removes voice logs but keeps other data
```

### 3. Full Rollback
```bash
# Restore from backup
supabase db pull  # Get latest schema
git reset --hard <commit_hash>
```

---

## Post-Deployment Monitoring

### Daily Checks
- [ ] Backend running: `curl http://localhost:8000/api/health`
- [ ] No error logs in console
- [ ] Voice interactions logging: `SELECT COUNT(*) FROM voice_interactions WHERE DATE(created_at) = TODAY()`
- [ ] API response times normal (<5s per request)

### Weekly Checks
- [ ] Vector index performance: `EXPLAIN ANALYZE` queries
- [ ] KB embeddings up to date
- [ ] No orphaned sessions
- [ ] Refusal rate acceptable (<15%)

### Monthly Checks
- [ ] Database size: `SELECT pg_size_pretty(pg_database_size(current_database()));`
- [ ] Backup integrity: Test restore
- [ ] Security audit: Check API logs
- [ ] User feedback: Review voice interactions

---

## Success Criteria

✅ Deployment is successful if:

1. **Frontend loads** - No console errors
2. **Voice button appears** - Bottom-right of page
3. **Microphone works** - Audio recording works
4. **Transcription works** - Speech converted to text
5. **RAG responds** - Answers about services
6. **RAG refuses** - Declines unknown topics
7. **Text-to-speech works** - Bot voice response audible
8. **Database logs** - Interactions appear in Supabase
9. **No error logs** - Backend running cleanly
10. **Performance acceptable** - <20s end-to-end

---

## Quick Reference

### Essential Commands

```bash
# Test everything
python backend/test_rag.py

# Start backend
python backend/main.py

# Start frontend
bun run dev

# Generate embeddings
python backend/generate_embeddings.py

# Check database
SELECT COUNT(*) FROM voice_interactions;
```

### Key Files

```
backend/
  ├── main.py                    ← Backend entry point
  ├── routes/voice.py            ← Voice API
  ├── services/rag.py            ← RAG logic
  ├── services/gemini.py         ← Gemini integration
  ├── services/embeddings.py     ← OpenAI embeddings
  ├── database_setup.sql         ← DB schema
  └── test_rag.py               ← Test suite

src/
  └── components/widgets/
      └── VoiceAgent.tsx         ← Voice UI
```

---

## Support & Documentation

- 📄 [RAG System Explained](RAG_SYSTEM_EXPLAINED.md)
- 📄 [Voice Agent Setup Guide](VOICE_AGENT_SETUP.md)
- 📄 [RAG Integration Details](RAG_VOICE_INTEGRATION.md)
- 🔧 [Backend API Docs](backend/README.md)

