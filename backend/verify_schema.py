#!/usr/bin/env python3
"""
Verify Supabase schema deployment
"""
import os
import sys

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

def verify_schema():
    """Verify all tables exist in Supabase"""
    print("=" * 70)
    print("SUPABASE SCHEMA VERIFICATION")
    print("=" * 70)
    
    # Read environment file
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    env_vars = read_env_file(env_path)
    
    SUPABASE_URL = env_vars.get('SUPABASE_URL', '')
    SUPABASE_KEY = env_vars.get('SUPABASE_KEY', '')
    
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("❌ Missing Supabase credentials")
        return False
    
    print("\n[1] CONNECTING TO SUPABASE:")
    print("-" * 70)
    
    import requests
    
    headers = {
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }
    
    tables = [
        'voice_interactions',
        'chat_messages',
        'contact_submissions',
        'user_emails',
        'meeting_requests',
        'rag_documents',
        'analytics_events',
        'service_inquiries'
    ]
    
    print("✅ Checking table existence...\n")
    
    all_exist = True
    for table in tables:
        try:
            # Try to query the table (will fail if it doesn't exist)
            url = f"{SUPABASE_URL}/rest/v1/{table}?select=*&limit=0"
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                print(f"✅ {table}")
            else:
                print(f"❌ {table} (Status: {response.status_code})")
                all_exist = False
        except Exception as e:
            print(f"⚠️  {table} - {str(e)[:50]}")
            all_exist = False
    
    print("\n[2] SCHEMA STATUS:")
    print("-" * 70)
    
    if all_exist:
        print("✅ ALL TABLES CREATED SUCCESSFULLY!\n")
        print("Your database is ready. You can now:")
        print("  • Submit contact forms → stored in contact_submissions")
        print("  • Use voice chat → stored in voice_interactions")
        print("  • Have conversations → stored in chat_messages")
        print("  • Schedule meetings → stored in meeting_requests")
        print("  • Add service inquiries → stored in service_inquiries")
        return True
    else:
        print("⚠️  Some tables may not exist yet")
        print("\nIf you see 'No rows returned' in Supabase SQL Editor,")
        print("the schema deployed successfully (DDL queries don't return rows)")
        return False

if __name__ == "__main__":
    success = verify_schema()
    print("\n" + "=" * 70)
    print("=" * 70)
    sys.exit(0 if success else 1)
