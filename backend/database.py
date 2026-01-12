from supabase import create_client
from config import SUPABASE_URL, SUPABASE_KEY

# Lazy initialization of Supabase client
_supabase_client = None

def get_supabase():
    """Get Supabase client instance (lazy initialization)"""
    global _supabase_client
    
    if _supabase_client is None:
        # Check if Supabase is configured
        if not SUPABASE_URL or SUPABASE_URL == "your_supabase_url_here" or not SUPABASE_KEY or SUPABASE_KEY == "your_supabase_key_here":
            raise Exception("Supabase is not configured. Please set SUPABASE_URL and SUPABASE_KEY in .env file")
        
        _supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    return _supabase_client

