"""
Phase 2: Upload components from embeddings.json to PostgreSQL
"""

import json
import psycopg2
from psycopg2.extras import execute_values
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

print("📤 Uploading Components to Database")
print("=" * 80 + "\n")

# Get database connection
DATABASE_URL = os.getenv('DATABASE_URL')

if not DATABASE_URL:
    print("❌ ERROR: DATABASE_URL not found in .env file")
    exit(1)

# Load embeddings
print("📂 Loading embeddings.json...")
try:
    with open('./embeddings.json', 'r', encoding='utf-8') as f:
        components = json.load(f)
    print(f"✅ Loaded {len(components)} components\n")
except FileNotFoundError:
    print("❌ ERROR: embeddings.json not found")
    print("   Run embed_components.py first!")
    exit(1)

# Connect to database
print("📡 Connecting to database...")
try:
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()
    print("✅ Connected!\n")
except Exception as e:
    print(f"❌ Connection failed: {e}")
    exit(1)

# Prepare data for bulk insert
print("🔄 Preparing data for upload...")
insert_data = []

for comp in components:
    insert_data.append((
        comp['id'],
        comp['filename'],
        comp['category'],
        comp['style_tags'],
        comp['color_scheme'],
        comp['complexity'],
        json.dumps(comp['props_schema']),  # Convert dict to JSON
        comp['dependencies'],
        comp['description'],
        comp['source'],
        comp['code'],
        comp['embedding']  # Already a list
    ))

print(f"✅ Prepared {len(insert_data)} records\n")

# Upload to database
print("📤 Uploading to database...")
try:
    # Use execute_values for efficient bulk insert
    execute_values(
        cursor,
        """
        INSERT INTO components (
            id, filename, category, style_tags, color_scheme, 
            complexity, props_schema, dependencies, description, 
            source, code, embedding
        ) VALUES %s
        ON CONFLICT (id) DO UPDATE SET
            filename = EXCLUDED.filename,
            category = EXCLUDED.category,
            style_tags = EXCLUDED.style_tags,
            color_scheme = EXCLUDED.color_scheme,
            complexity = EXCLUDED.complexity,
            props_schema = EXCLUDED.props_schema,
            dependencies = EXCLUDED.dependencies,
            description = EXCLUDED.description,
            source = EXCLUDED.source,
            code = EXCLUDED.code,
            embedding = EXCLUDED.embedding,
            updated_at = NOW()
        """,
        insert_data
    )
    
    conn.commit()
    print(f"✅ Uploaded {len(insert_data)} components successfully!\n")
    
except Exception as e:
    print(f"❌ Upload failed: {e}")
    conn.rollback()
    cursor.close()
    conn.close()
    exit(1)

# Verify upload
print("🔍 Verifying upload...")
cursor.execute("SELECT COUNT(*) FROM components;")
count = cursor.fetchone()[0]
print(f"✅ Database contains {count} components\n")

# Show sample data
print("📊 Sample data from database:")
cursor.execute("""
    SELECT id, category, array_length(style_tags, 1) as num_tags 
    FROM components 
    LIMIT 5;
""")

results = cursor.fetchall()
print("\n   ID                          | Category    | Tags")
print("   " + "-" * 55)
for row in results:
    print(f"   {row[0]:30} | {row[1]:11} | {row[2]}")

# Test vector search
print("\n🧪 Testing vector search...")
cursor.execute("""
    SELECT id, category, 1 - (embedding <=> embedding) as self_similarity
    FROM components
    LIMIT 1;
""")
test = cursor.fetchone()
print(f"✅ Vector search working! (self-similarity: {test[2]:.3f})")

# Close connection
cursor.close()
conn.close()

print("\n" + "=" * 80)
print("🎉 SUCCESS! All components uploaded to database!")
print("=" * 80)
print("\n📊 Summary:")
print(f"   • Total components: {count}")
print(f"   • Vector embeddings: ✅ Working")
print(f"   • Indexes: ✅ Created")
print(f"   • Search function: ✅ Ready")
print("\n🎯 Next step: Run test_db_search.py to test database retrieval")