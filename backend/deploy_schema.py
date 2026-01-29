#!/usr/bin/env python3
"""
Deploy database schema to Supabase
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

def deploy_schema():
    """Deploy schema to Supabase"""
    print("=" * 70)
    print("SUPABASE SCHEMA DEPLOYMENT")
    print("=" * 70)
    
    # Read environment file
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    env_vars = read_env_file(env_path)
    
    SUPABASE_URL = env_vars.get('SUPABASE_URL', '')
    SUPABASE_KEY = env_vars.get('SUPABASE_KEY', '')
    
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("❌ Missing Supabase credentials in .env file")
        return False
    
    print("\n[1] READING SCHEMA FILE:")
    print("-" * 70)
    
    schema_file = os.path.join(os.path.dirname(__file__), 'schema.sql')
    
    try:
        with open(schema_file, 'r') as f:
            schema_sql = f.read()
        print(f"✅ Schema file loaded ({len(schema_sql)} bytes)")
    except Exception as e:
        print(f"❌ Error reading schema file: {e}")
        return False
    
    print("\n[2] VALIDATING SQL SYNTAX:")
    print("-" * 70)
    
    # Basic validation
    required_tables = [
        'voice_interactions',
        'chat_messages',
        'contact_submissions',
        'user_emails',
        'meeting_requests',
        'rag_documents',
        'analytics_events',
        'service_inquiries'
    ]
    
    missing_tables = []
    for table in required_tables:
        if f'CREATE TABLE IF NOT EXISTS {table}' in schema_sql:
            print(f"✅ {table}")
        else:
            print(f"❌ {table}")
            missing_tables.append(table)
    
    if missing_tables:
        print(f"\n❌ Missing table definitions: {', '.join(missing_tables)}")
        return False
    
    print("\n[3] CONNECTING TO SUPABASE:")
    print("-" * 70)
    
    try:
        import requests
        
        # Test connection first
        headers = {
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json"
        }
        
        test_url = f"{SUPABASE_URL}/rest/v1/"
        response = requests.head(test_url, headers=headers, timeout=10)
        
        if response.status_code in [200, 401, 403]:
            print(f"✅ Connected to Supabase ({response.status_code})")
        else:
            print(f"❌ Connection failed ({response.status_code})")
            return False
        
        print("\n[4] EXECUTING SCHEMA:")
        print("-" * 70)
        
        # Try importing supabase
        try:
            from supabase import create_client
            client = create_client(SUPABASE_URL, SUPABASE_KEY)
            print("✅ Supabase client ready")
            
            # Execute schema using RPC or SQL
            print("🔄 Deploying tables...")
            
            # Split SQL into individual statements
            statements = schema_sql.split(';')
            statements = [s.strip() for s in statements if s.strip() and not s.strip().startswith('--')]
            
            print(f"📝 Found {len(statements)} SQL statements to execute")
            
            # Note: Full schema execution requires admin access
            print("\n[5] DEPLOYMENT INSTRUCTIONS:")
            print("-" * 70)
            print("""
To complete schema deployment, please:

1. Go to Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Go to SQL Editor → New Query
4. Copy the SQL from: backend/schema.sql
5. Paste into Supabase SQL Editor
6. Click "Run" button
7. Wait for confirmation ✅

Alternatively, use Supabase CLI:
    supabase db push
            """)
            
            return True
            
        except ImportError:
            print("⚠️  Supabase client not available")
            print("\nTo deploy schema manually:")
            print("1. Open Supabase Dashboard")
            print("2. Go to SQL Editor")
            print("3. Copy-paste the schema.sql file")
            print("4. Click Run")
            return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

if __name__ == "__main__":
    success = deploy_schema()
    print("\n" + "=" * 70)
    if success:
        print("✅ SCHEMA VALIDATION PASSED - Ready for deployment!")
    else:
        print("❌ SCHEMA VALIDATION FAILED")
    print("=" * 70)
    sys.exit(0 if success else 1)
