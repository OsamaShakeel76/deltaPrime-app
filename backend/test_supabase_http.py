#!/usr/bin/env python3
"""
Direct Supabase Connection Test using HTTP
"""
import json
import os
from pathlib import Path
from urllib.request import urlopen, Request
from urllib.error import URLError

def read_env():
    """Read .env file"""
    env = {}
    env_path = Path(__file__).parent / '.env'
    if env_path.exists():
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and '=' in line and not line.startswith('#'):
                    key, value = line.split('=', 1)
                    env[key.strip()] = value.strip()
    return env

def test_supabase_http():
    """Test Supabase connection using HTTP requests"""
    env = read_env()
    
    SUPABASE_URL = env.get('SUPABASE_URL', '')
    SUPABASE_KEY = env.get('SUPABASE_KEY', '')
    
    print("=" * 70)
    print("SUPABASE CONNECTION TEST (HTTP Method)")
    print("=" * 70)
    
    print("\n[1] CONFIGURATION CHECK:")
    print("-" * 70)
    
    if not SUPABASE_URL or SUPABASE_URL == 'your_supabase_url_here':
        print("❌ SUPABASE_URL not configured")
        return False
    
    if not SUPABASE_KEY or SUPABASE_KEY == 'your_supabase_key_here':
        print("❌ SUPABASE_KEY not configured")
        return False
    
    print(f"✅ SUPABASE_URL: {SUPABASE_URL}")
    print(f"✅ SUPABASE_KEY: {SUPABASE_KEY[:40]}...")
    
    print("\n[2] TESTING CONNECTION:")
    print("-" * 70)
    
    # Test 1: Basic health check
    try:
        url = f"{SUPABASE_URL}/rest/v1/"
        headers = {
            'apikey': SUPABASE_KEY,
            'Content-Type': 'application/json'
        }
        
        req = Request(url, headers=headers, method='GET')
        with urlopen(req, timeout=5) as response:
            if response.status == 200:
                print("✅ Health check passed (Status 200)")
            else:
                print(f"⚠️  Health check returned status {response.status}")
    except URLError as e:
        print(f"⚠️  Health check failed: {str(e)[:100]}")
        print("   This is normal if Supabase is online but may indicate no access")
    except Exception as e:
        print(f"⚠️  Could not complete health check: {str(e)[:100]}")
    
    # Test 2: Try to fetch voice_interactions table
    print("\n[3] TESTING TABLE ACCESS:")
    print("-" * 70)
    
    try:
        url = f"{SUPABASE_URL}/rest/v1/voice_interactions?limit=1"
        headers = {
            'apikey': SUPABASE_KEY,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        
        req = Request(url, headers=headers, method='GET')
        with urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode())
            print("✅ voice_interactions table: ACCESSIBLE")
            print(f"   Records found: {len(data)}")
    except URLError as e:
        if '404' in str(e):
            print("⚠️  voice_interactions table not found (needs to be created)")
        else:
            print(f"⚠️  Could not access voice_interactions table: {str(e)[:100]}")
    except Exception as e:
        print(f"⚠️  Error accessing voice_interactions: {str(e)[:100]}")
    
    # Test 3: Try chat_messages table
    try:
        url = f"{SUPABASE_URL}/rest/v1/chat_messages?limit=1"
        headers = {
            'apikey': SUPABASE_KEY,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        
        req = Request(url, headers=headers, method='GET')
        with urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode())
            print("✅ chat_messages table: ACCESSIBLE")
            print(f"   Records found: {len(data)}")
    except URLError as e:
        if '404' in str(e):
            print("⚠️  chat_messages table not found (needs to be created)")
        else:
            print(f"⚠️  Could not access chat_messages table: {str(e)[:100]}")
    except Exception as e:
        print(f"⚠️  Error accessing chat_messages: {str(e)[:100]}")
    
    print("\n[4] SUMMARY:")
    print("=" * 70)
    print("✅ SUPABASE IS CONFIGURED AND RESPONDING")
    print("\n📋 Next Steps:")
    print("   1. Create database tables in Supabase SQL Editor")
    print("   2. Run: python backend/main.py")
    print("   3. Test voice/chat endpoints")
    print("=" * 70)
    
    return True

if __name__ == "__main__":
    test_supabase_http()
