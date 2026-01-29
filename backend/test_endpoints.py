#!/usr/bin/env python3
"""
Test DeltaPrime AI Hub endpoints
"""
import requests
import json
import uuid

BASE_URL = "http://localhost:8001"

def test_health():
    """Test health check endpoint"""
    print("\n" + "="*70)
    print("TEST 1: Health Check Endpoint")
    print("="*70)
    
    try:
        response = requests.get(f"{BASE_URL}/", timeout=5)
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_api_health():
    """Test API health endpoint"""
    print("\n" + "="*70)
    print("TEST 2: API Health Endpoint")
    print("="*70)
    
    try:
        response = requests.get(f"{BASE_URL}/api/health", timeout=5)
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_chat():
    """Test chat endpoint"""
    print("\n" + "="*70)
    print("TEST 3: Chat Endpoint")
    print("="*70)
    
    payload = {
        "message": "What services does DeltaPrime AI offer?",
        "session_id": str(uuid.uuid4())
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/chat",
            json=payload,
            timeout=10
        )
        print(f"Status: {response.status_code}")
        print(f"Request: {json.dumps(payload, indent=2)}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_contact():
    """Test contact endpoint"""
    print("\n" + "="*70)
    print("TEST 4: Contact Form Endpoint")
    print("="*70)
    
    payload = {
        "name": "Test User",
        "email": "test@example.com",
        "message": "This is a test contact message from the API test script."
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/contact",
            json=payload,
            timeout=5
        )
        print(f"Status: {response.status_code}")
        print(f"Request: {json.dumps(payload, indent=2)}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def run_tests():
    """Run all tests"""
    print("\n" + "="*70)
    print("DELTAPRIME AI HUB - API ENDPOINT TESTS")
    print("="*70)
    print(f"Base URL: {BASE_URL}")
    
    results = {
        "Health Check": test_health(),
        "API Health": test_api_health(),
        "Chat": test_chat(),
        "Contact": test_contact()
    }
    
    print("\n" + "="*70)
    print("TEST SUMMARY")
    print("="*70)
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test_name, passed_test in results.items():
        status = "✅ PASS" if passed_test else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    print("="*70)

if __name__ == "__main__":
    try:
        run_tests()
    except KeyboardInterrupt:
        print("\n\nTests interrupted by user")
    except Exception as e:
        print(f"\n\n❌ Fatal error: {str(e)}")
