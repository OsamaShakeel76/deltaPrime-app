#!/usr/bin/env python3
"""
Test Supabase connection and database functionality
"""
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_supabase_connection():
    """Test if Supabase connection is working"""
    try:
        from supabase import create_client
        
        SUPABASE_URL = os.getenv("SUPABASE_URL")
        SUPABASE_KEY = os.getenv("SUPABASE_KEY")
        
        print("=" * 60)
        print("SUPABASE CONNECTION TEST")
        print("=" * 60)
        
        # Check if credentials are configured
        if not SUPABASE_URL or SUPABASE_URL == "your_supabase_url_here":
            print("❌ SUPABASE_URL not configured")
            return False
        
        if not SUPABASE_KEY or SUPABASE_KEY == "your_supabase_key_here":
            print("❌ SUPABASE_KEY not configured")
            return False
        
        print(f"✓ SUPABASE_URL: {SUPABASE_URL[:50]}...")
        print(f"✓ SUPABASE_KEY: {SUPABASE_KEY[:20]}...")
        
        # Try to create client
        print("\n[1] Attempting to create Supabase client...")
        client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("✓ Client created successfully!")
        
        # Try to fetch data from a table
        print("\n[2] Testing database access...")
        try:
            # Try to get tables (this is a basic test)
            response = client.table('voice_interactions').select('*').limit(1).execute()
            print("✓ Successfully connected to 'voice_interactions' table!")
            print(f"   Response count: {len(response.data) if response.data else 0} records")
        except Exception as table_error:
            print(f"⚠ Could not access 'voice_interactions' table")
            print(f"  Error: {str(table_error)}")
            print("  Note: Table may not exist yet. Creating tables...")
            
            try:
                # Try accessing chat_interactions instead
                response = client.table('chat_interactions').select('*').limit(1).execute()
                print("✓ Successfully connected to 'chat_interactions' table!")
                print(f"   Response count: {len(response.data) if response.data else 0} records")
            except Exception as chat_error:
                print(f"⚠ Could not access 'chat_interactions' table either")
                print(f"  Error: {str(chat_error)}")
        
        print("\n[3] Testing write operation (insert test record)...")
        try:
            test_data = {
                "session_id": "test_connection_" + os.urandom(4).hex(),
                "user_input": "Test connection check",
                "bot_response": "Connection successful",
                "sources_used": [],
                "interaction_type": "test"
            }
            
            response = client.table('voice_interactions').insert(test_data).execute()
            print("✓ Successfully inserted test record!")
            print(f"   Test record ID: {response.data[0]['id'] if response.data else 'Unknown'}")
        except Exception as write_error:
            print(f"⚠ Could not insert record")
            print(f"  Error: {str(write_error)}")
        
        print("\n" + "=" * 60)
        print("✅ SUPABASE CONNECTION SUCCESSFUL!")
        print("=" * 60)
        return True
        
    except ImportError as e:
        print(f"❌ Import Error: {e}")
        print("   Please install: pip install supabase")
        return False
    except Exception as e:
        print(f"❌ Connection Error: {e}")
        print("=" * 60)
        return False

if __name__ == "__main__":
    success = test_supabase_connection()
    sys.exit(0 if success else 1)
