"""
Phase 1: Test component search/retrieval
Load embeddings and search by natural language query
"""

import json
import numpy as np
from sentence_transformers import SentenceTransformer

print("🔍 Component Search System\n")
print("Loading model and embeddings...")

# Load model
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

# Load embeddings
with open('./embeddings.json', 'r', encoding='utf-8') as f:
    components = json.load(f)

print(f"✅ Loaded {len(components)} components\n")

def search_components(query, category=None, top_k=5):
    """
    Search for components using natural language query
    
    Args:
        query: Natural language search query
        category: Optional filter ('navigation', 'hero', 'footer')
        top_k: Number of results to return
    """
    print(f"🔎 Searching for: '{query}'")
    if category:
        print(f"   Filtering by category: {category}")
    print()
    
    # Embed the search query
    query_embedding = model.encode(query)
    
    # Filter by category if specified
    candidates = components
    if category:
        candidates = [c for c in components if c['category'] == category]
    
    # Calculate cosine similarity for each component
    for comp in candidates:
        comp_embedding = np.array(comp['embedding'])
        
        # Cosine similarity formula
        similarity = np.dot(query_embedding, comp_embedding) / (
            np.linalg.norm(query_embedding) * np.linalg.norm(comp_embedding)
        )
        
        comp['similarity'] = float(similarity)
    
    # Sort by similarity (highest first)
    candidates.sort(key=lambda x: x['similarity'], reverse=True)
    
    # Return top K results
    return candidates[:top_k]


def display_results(results):
    """Pretty print search results"""
    if not results:
        print("❌ No results found\n")
        return
    
    print(f"📊 Found {len(results)} results:\n")
    print("=" * 80)
    
    for i, comp in enumerate(results, 1):
        print(f"\n#{i} - {comp['id']}")
        print(f"   Category: {comp['category']}")
        print(f"   Similarity: {comp['similarity']:.3f} (higher is better)")
        print(f"   Style Tags: {', '.join(comp['style_tags'])}")
        print(f"   Colors: {', '.join(comp['color_scheme'])}")
        print(f"   Description: {comp['description']}")
        print(f"   Source: {comp['source']}")
    
    print("\n" + "=" * 80)


# ============================================
# TEST QUERIES - Run these to validate retrieval
# ============================================

print("\n" + "="*80)
print("STARTING RETRIEVAL TESTS")
print("="*80 + "\n")

# Test 1: Navigation search
print("TEST 1: General Navigation Search")
print("-" * 80)
results = search_components("modern navigation with search", category="navigation", top_k=3)
display_results(results)

# Test 2: Hero search
print("\n\nTEST 2: Hero Section Search")
print("-" * 80)
results = search_components("hero section with gradient background", category="hero", top_k=3)
display_results(results)

# Test 3: Footer search
print("\n\nTEST 3: Footer Search")
print("-" * 80)
results = search_components("simple minimal footer", category="footer", top_k=3)
display_results(results)

# Test 4: Style-based search (no category filter)
print("\n\nTEST 4: Style-Based Search (All Categories)")
print("-" * 80)
results = search_components("dark modern design with animations", top_k=5)
display_results(results)

# Test 5: Color-based search
print("\n\nTEST 5: Color-Based Search")
print("-" * 80)
results = search_components("blue gradient component", top_k=3)
display_results(results)


# ============================================
# INTERACTIVE MODE
# ============================================

print("\n\n" + "="*80)
print("INTERACTIVE SEARCH MODE")
print("="*80)
print("\nYou can now test your own queries!")
print("Type 'quit' to exit\n")

while True:
    try:
        query = input("Enter search query: ").strip()
        
        if query.lower() in ['quit', 'exit', 'q']:
            print("\n👋 Goodbye!")
            break
        
        if not query:
            continue
        
        # Ask for category filter (optional)
        category_input = input("Filter by category? (navigation/hero/footer or press Enter to skip): ").strip()
        category = category_input if category_input in ['navigation', 'hero', 'footer'] else None
        
        # Perform search
        results = search_components(query, category=category, top_k=5)
        display_results(results)
        
        print("\n")
    
    except KeyboardInterrupt:
        print("\n\n👋 Goodbye!")
        break
    except Exception as e:
        print(f"\n❌ Error: {e}\n")