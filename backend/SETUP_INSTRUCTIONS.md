# Backend Setup Instructions

## ✅ Completed Steps

1. ✅ Virtual environment created
2. ✅ All dependencies installed
3. ✅ Backend code structure created
4. ✅ Gemini API key configured

## 📋 Next Steps

### 1. Set Up Supabase Database

1. Go to [Supabase](https://supabase.com) and create a free account
2. Create a new project
3. Go to SQL Editor
4. Copy and paste the entire content from `database_setup.sql`
5. Run the SQL script

### 2. Configure Environment Variables

Edit the `.env` file in the backend directory:

```env
# Already configured
GEMINI_API_KEY=AIzaSyANETInXCs7STSaBUZbiwu_SA7_vvoovtQ

# Update these with your Supabase credentials
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key

# Optional: For better embeddings (or leave as is for hash-based fallback)
OPENAI_API_KEY=your_openai_key_here
```

**To get Supabase credentials:**
- Go to your Supabase project
- Settings → API
- Copy "Project URL" → `SUPABASE_URL`
- Copy "anon public" key → `SUPABASE_KEY`

### 3. Generate Embeddings for Knowledge Base

After running the SQL script, the knowledge base will have documents but no embeddings.

Run this command to generate embeddings:

```bash
cd backend
source venv/bin/activate
python generate_embeddings.py
```

**Note:** If you don't have OpenAI API key, it will use a hash-based fallback (less accurate but works for testing).

### 4. Start the Backend Server

```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

Or use the start script:
```bash
cd backend
./start.sh
```

### 5. Test the API

1. **Health Check:**
   - Visit: http://localhost:8000
   - Should see: `{"status":"ok",...}`

2. **API Documentation:**
   - Visit: http://localhost:8000/docs
   - Interactive API documentation

3. **Test Contact Endpoint:**
   ```bash
   curl -X POST http://localhost:8000/api/contact \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","message":"Test message"}'
   ```

4. **Test Chat Endpoint:**
   ```bash
   curl -X POST http://localhost:8000/api/chat \
     -H "Content-Type: application/json" \
     -d '{"message":"What services do you offer?","session_id":"test-123"}'
   ```

## 🔧 Troubleshooting

### Issue: "Module not found"
**Solution:** Make sure virtual environment is activated:
```bash
source venv/bin/activate
```

### Issue: "Supabase connection error"
**Solution:** Check your `.env` file has correct Supabase URL and key

### Issue: "Gemini API error"
**Solution:** Check your Gemini API key is correct in `.env`

### Issue: "Vector search not working"
**Solution:** 
1. Make sure you ran `database_setup.sql`
2. Make sure you generated embeddings with `generate_embeddings.py`
3. Check that `match_documents` function exists in Supabase

## 📁 Project Structure

```
backend/
├── main.py                 # FastAPI app
├── config.py              # Configuration
├── database.py            # Supabase connection
├── models.py              # Data models
├── routes/                # API endpoints
│   ├── contact.py
│   ├── chat.py
│   └── services.py
├── services/              # Business logic
│   ├── gemini.py
│   ├── embeddings.py
│   └── rag.py
├── venv/                  # Virtual environment
├── .env                   # Environment variables
├── requirements.txt       # Dependencies
└── database_setup.sql    # Database schema
```

## 🚀 Production Deployment

For production, consider:
- Using environment variables from your hosting platform
- Setting up proper CORS origins
- Adding rate limiting
- Using a production ASGI server like Gunicorn

## 📞 Support

If you encounter issues:
1. Check the error messages in terminal
2. Verify all environment variables are set
3. Ensure Supabase database is properly configured
4. Check API keys are valid

