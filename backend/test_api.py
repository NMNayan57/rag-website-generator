"""
Phase 3: Test script for FastAPI endpoints
Tests both search and generate endpoints
"""

import requests
import json

BASE_URL = "http://localhost:8000"

print("Testing RAG Website Generator API")
print("=" * 80 + "\n")

# Test 1: Health Check
print("TEST 1: Health Check")
print("-" * 80)
try:
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print("✅ API is running!\n")
except Exception as e:
    print(f"❌ API not running: {e}")
    print("Make sure you started the server with: python main.py\n")
    exit(1)

# Test 2: Component Search
print("\nTEST 2: Component Search")
print("-" * 80)

search_payload = {
    "query": "modern navigation with search",
    "category": "navigation",
    "limit": 3
}

try:
    response = requests.post(
        f"{BASE_URL}/api/search",
        json=search_payload
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"Query: {data['query']}")
        print(f"Found: {data['count']} components\n")
        
        for i, comp in enumerate(data['results'], 1):
            print(f"#{i} {comp['id']}")
            print(f"   Category: {comp['category']}")
            print(f"   Similarity: {comp['similarity']:.3f}")
            print(f"   Tags: {', '.join(comp['style_tags'])}")
        
        print("\n✅ Search endpoint working!")
    else:
        print(f"❌ Search failed: {response.status_code}")
        print(response.text)

except Exception as e:
    print(f"❌ Error: {e}")

# Test 3: Website Generation (Full Pipeline)
print("\n\nTEST 3: Website Generation")
print("-" * 80)
print("⚠️  This will take 15-30 seconds (calling OpenAI twice)...\n")

generate_payload = {
    "prompt": "Create a modern SaaS landing page for a project management tool"
}

try:
    response = requests.post(
        f"{BASE_URL}/api/generate",
        json=generate_payload,
        timeout=60  # 60 second timeout
    )
    
    if response.status_code == 200:
        data = response.json()
        
        print(f"Generation Time: {data['generation_time_ms']}ms")
        print(f"Components Used: {', '.join(data['components_used'])}")
        print(f"\nGenerated Code Preview (first 500 chars):")
        print("-" * 80)
        print(data['code'][:500])
        print("...")
        print("-" * 80)
        
        # Save to file
        with open('./generated_page.tsx', 'w', encoding='utf-8') as f:
            f.write(data['code'])
        
        print("\n✅ Generation successful!")
        print("💾 Full code saved to: generated_page.tsx")
        
    else:
        print(f"❌ Generation failed: {response.status_code}")
        print(response.text)

except requests.exceptions.Timeout:
    print("❌ Request timed out (took longer than 60 seconds)")
    print("   This might mean OpenAI is slow or API key is invalid")
except Exception as e:
    print(f"❌ Error: {e}")

print("\n" + "=" * 80)
print("API Testing Complete!")
print("=" * 80)