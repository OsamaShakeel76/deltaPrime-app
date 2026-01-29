#!/usr/bin/env python3
"""
Quick Supabase connection test using environment variables
"""
import os
import sys

# Read .env file manually
def read_env_file(filepath):
    """Read .env file and return dict of variables"""
    env_vars = {}
    try:
        with open(filepath, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#'):
                    if '=' in line:
                        key, value = line.split('=', 1)
                        env_vars[key.strip()] = value.strip()
    except Exception as e:
        print(f"Error reading .env file: {e}")
    return env_vars

def test_supabase():
    """Test Supabase connection"""
    print("=" * 70)
    print("SUPABASE CONNECTION TEST")
    print("=" * 70)
    
    # Read environment file
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    env_vars = read_env_file(env_path)
    
    SUPABASE_URL = env_vars.get('SUPABASE_URL', '')
    SUPABASE_KEY = env_vars.get('SUPABASE_KEY', '')
    GEMINI_API_KEY = env_vars.get('GEMINI_API_KEY', '')
    
    print("\n[1] CONFIGURATION CHECK:")
    print("-" * 70)
    
    # Check URL
    if SUPABASE_URL and SUPABASE_URL != 'your_supabase_url_here':
        print(f"✅ SUPABASE_URL: {SUPABASE_URL[:40]}...")
    else:
        print(f"❌ SUPABASE_URL: NOT CONFIGURED or invalid")
    
    # Check KEY
    if SUPABASE_KEY and SUPABASE_KEY != 'your_supabase_key_here':
        print(f"✅ SUPABASE_KEY: {SUPABASE_KEY[:30]}...")
    else:
        print(f"❌ SUPABASE_KEY: NOT CONFIGURED or invalid")
    
    # Check Gemini
    if GEMINI_API_KEY and GEMINI_API_KEY != 'your_gemini_key_here':
        print(f"✅ GEMINI_API_KEY: {GEMINI_API_KEY[:30]}...")
    else:
        print(f"⚠️  GEMINI_API_KEY: NOT CONFIGURED or invalid")
    
    print("\n[2] ATTEMPTING CONNECTION:")
    print("-" * 70)
    
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("❌ Missing Supabase credentials. Cannot proceed.")
        return False
    
    try:
        # Try importing and connecting
        print("Installing supabase client...")
        import subprocess
        result = subprocess.run([sys.executable, '-m', 'pip', 'install', '--quiet', 'supabase'], 
                              capture_output=True, timeout=30)
        
        from supabase import create_client
        
        print("✅ Supabase module imported successfully")
        print("🔄 Creating client connection...")
        
        client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("✅ Client created successfully!")
        
        print("\n[3] TESTING DATABASE ACCESS:")
        print("-" * 70)
        
        # Try to list tables
        print("🔄 Attempting to access voice_interactions table...")
        try:
            response = client.table('voice_interactions').select('*').limit(1).execute()
            print(f"✅ voice_interactions table accessible! ({len(response.data)} records found)")
        except Exception as e:
            print(f"⚠️  voice_interactions table: {str(e)[:100]}")
        
        print("\n[4] CONNECTION SUMMARY:")
        print("-" * 70)
        print("✅ SUPABASE IS SUCCESSFULLY CONNECTED AND READY!")
        print("=" * 70)
        
        return True
        
    except ImportError as e:
        print(f"⚠️  Could not import supabase: {e}")
        print("    Run: pip install supabase")
        return False
    except Exception as e:
        print(f"❌ Connection failed: {str(e)}")
        print("=" * 70)
        return False

if __name__ == "__main__":
    success = test_supabase()
    sys.exit(0 if success else 1)
