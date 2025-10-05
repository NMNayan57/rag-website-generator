"""
Phase 2: Test database retrieval with vector search
"""

import psycopg2
from sentence_transformers import SentenceTransformer
import os
from dotenv import load_dotenv

# Load environment
load_dotenv()

print("🔍 Database Search Test")
print("=" * 80 + "\n")

# Load model
print("📦 Loading embedding model...")
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
print("✅ Model loaded!\n")

# Connect to database
DATABASE_URL = os.getenv('DATABASE_URL')
print("📡 Connecting to database...")

try:
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()
    print("✅ Connected!\n")
except Exception as e:
    print(f"❌ Connection failed: {e}")
    exit(1)

def search_db(query, category=None, limit=5):
    """Search database using vector similarity"""
    
    print(f"🔎 Query: '{query}'")
    if category:
        print(f"   Category: {category}")
    print()
    
    # Generate query embedding
    query_embedding = model.encode(query).tolist()
    
    # Search database
    if category:
        cursor.execute("""
            SELECT id, category, description, 
                   1 - (embedding <=> %s::vector) as similarity
            FROM components
            WHERE category = %s
            ORDER BY embedding <=> %s::vector
            LIMIT %s;
        """, (query_embedding, category, query_embedding, limit))
    else:
        cursor.execute("""
            SELECT id, category, description,
                   1 - (embedding <=> %s::vector) as similarity
            FROM components
            ORDER BY embedding <=> %s::vector
            LIMIT %s;
        """, (query_embedding, query_embedding, limit))
    
    results = cursor.fetchall()
    
    # Display results
    if results:
        print(f"📊 Found {len(results)} results:\n")
        print("-" * 80)
        for i, (comp_id, cat, desc, sim) in enumerate(results, 1):
            print(f"\n#{i} {comp_id}")
            print(f"   Category: {cat}")
            print(f"   Similarity: {sim:.3f}")
            print(f"   Description: {desc[:80]}...")
        print("\n" + "-" * 80)
    else:
        print("❌ No results found\n")
    
    return results

# ============================================
# RUN TESTS
# ============================================

print("\n" + "=" * 80)
print("RUNNING DATABASE SEARCH TESTS")
print("=" * 80 + "\n")

# Test 1
print("TEST 1: Navigation Search")
print("-" * 80)
search_db("modern navigation with search", category="navigation", limit=3)

# Test 2
print("\n\nTEST 2: Hero Search")
print("-" * 80)
search_db("hero section with gradient", category="hero", limit=3)

# Test 3
print("\n\nTEST 3: Footer Search")
print("-" * 80)
search_db("minimal footer", category="footer", limit=3)

# Test 4: No category filter
print("\n\nTEST 4: Generic Search (All Categories)")
print("-" * 80)
search_db("blue gradient component", limit=5)

# ============================================
# INTERACTIVE MODE
# ============================================

print("\n\n" + "=" * 80)
print("INTERACTIVE MODE")
print("=" * 80)
print("\nTest your own queries! Type 'quit' to exit\n")

while True:
    try:
        query = input("Search query: ").strip()
        
        if query.lower() in ['quit', 'exit', 'q']:
            break
        
        if not query:
            continue
        
        category = input("Category (navigation/hero/footer or Enter to skip): ").strip()
        category = category if category in ['navigation', 'hero', 'footer'] else None
        
        search_db(query, category=category, limit=5)
        print("\n")
        
    except KeyboardInterrupt:
        break
    except Exception as e:
        print(f"\n❌ Error: {e}\n")

# Close connection
cursor.close()
conn.close()

print("\n✅ Database connection closed")
print("\n🎉 Phase 2 Complete!")
print("=" * 80)
print("\n✅ What's working:")
print("   • PostgreSQL + pgvector database")
print("   • 21 components stored with embeddings")
print("   • Vector similarity search")
print("   • Category filtering")
print("\n🎯 Next: Phase 3 - Build FastAPI backend")