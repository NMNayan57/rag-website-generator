"""
Phase 1: Generate embeddings for all components
Reads components folder, creates embeddings, saves to embeddings.json
"""

import json
import os
from pathlib import Path
from sentence_transformers import SentenceTransformer

print("🚀 Starting component embedding process...")
print("Loading embedding model (this might take 30 seconds first time)...")

# Load the embedding model (384-dimensional, fast and good for code)
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
print("✅ Model loaded!\n")

# Configuration
COMPONENTS_DIR = "./components"  #  components folder
OUTPUT_FILE = "./embeddings.json"

# Storage for all embeddings
all_embeddings = []

# Walk through all component folders
print(f"📁 Scanning {COMPONENTS_DIR} for components...\n")

for category_folder in ['navigation', 'hero', 'footer']:
    category_path = Path(COMPONENTS_DIR) / category_folder
    
    if not category_path.exists():
        print(f"⚠️  Warning: {category_path} folder not found, skipping...")
        continue
    
    print(f"📂 Processing {category_folder}/ ...")
    
    # Find all .json metadata files
    json_files = list(category_path.glob("*.json"))
    
    for json_file in json_files:
        # Read metadata
        with open(json_file, 'r', encoding='utf-8') as f:
            metadata = json.load(f)
        
        # Find corresponding .tsx file
        tsx_file = json_file.with_suffix('.tsx')
        
        if not tsx_file.exists():
            print(f"  ⚠️  Warning: {tsx_file.name} not found, skipping...")
            continue
        
        # Read component code
        with open(tsx_file, 'r', encoding='utf-8') as f:
            code = f.read()
        
        # Create searchable text combining metadata and code snippet
        # This is what will be embedded and searched
        searchable_text = f"""
        Category: {metadata.get('category', '')}
        Style: {' '.join(metadata.get('style_tags', []))}
        Colors: {' '.join(metadata.get('color_scheme', []))}
        Description: {metadata.get('description', '')}
        Source: {metadata.get('source', '')}
        Code Preview: {code[:500]}
        """.strip()
        
        # Generate embedding (converts text to 384-dimensional vector)
        print(f"  🔄 Embedding {metadata['id']}...")
        embedding = model.encode(searchable_text).tolist()
        
        # Store everything
        all_embeddings.append({
            "id": metadata['id'],
            "filename": metadata['filename'],
            "category": metadata['category'],
            "style_tags": metadata['style_tags'],
            "color_scheme": metadata['color_scheme'],
            "complexity": metadata['complexity'],
            "props_schema": metadata['props_schema'],
            "dependencies": metadata['dependencies'],
            "description": metadata['description'],
            "source": metadata.get('source', 'Unknown'),
            "code": code,  # Full component code
            "embedding": embedding  # 384-dimensional vector
        })
        
        print(f"  ✅ {metadata['id']} embedded successfully")
    
    print(f"  Completed {category_folder}/ ({len(json_files)} components)\n")

# Save to JSON file
print(f"💾 Saving {len(all_embeddings)} embeddings to {OUTPUT_FILE}...")
with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
    json.dump(all_embeddings, f, indent=2)

print(f"\n✅ SUCCESS! Embedded {len(all_embeddings)} components")
print(f"📄 Output saved to: {OUTPUT_FILE}")
print(f"📊 File size: {os.path.getsize(OUTPUT_FILE) / 1024 / 1024:.2f} MB")
print("\n🎯 Next step: Run test_search.py to test retrieval")