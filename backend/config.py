import os
from dotenv import load_dotenv

load_dotenv()

# Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# OpenAI (for embeddings)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# CORS
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:8080").split(",")

