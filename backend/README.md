# DeltaPrime AI Solutions - Backend API

## Setup Instructions

### 1. Activate Virtual Environment

```bash
# Linux/Mac
source venv/bin/activate

# Windows
venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Edit `.env` file and add your credentials:

```env
GEMINI_API_KEY=your_gemini_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
OPENAI_API_KEY=your_openai_key (optional)
```

### 4. Set Up Supabase Database

Run the SQL scripts in `database_setup.sql` in your Supabase SQL editor.

### 5. Run the Server

```bash
# Development mode
uvicorn main:app --reload --port 8000

# Or use Python
python main.py
```

### 6. Test the API

Visit: http://localhost:8000

API Docs: http://localhost:8000/docs

## API Endpoints

- `POST /api/contact` - Contact form submission
- `POST /api/chat` - AI chat with RAG
- `POST /api/services/quote` - Service inquiry

## Database Setup

See `database_setup.sql` for table creation scripts.

