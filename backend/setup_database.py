"""
Phase 2: Setup PostgreSQL database with pgvector
Creates the schema and necessary indexes
"""

import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

print("🗄️  Database Setup - Phase 2")
print("=" * 80)

# Get database connection string
DATABASE_URL = os.getenv('DATABASE_URL')

if not DATABASE_URL:
    print("❌ ERROR: DATABASE_URL not found in .env file")
    print("\nMake sure your .env file has:")
    print("DATABASE_URL=postgresql://postgres:password@host:5432/postgres")
    exit(1)

print("📡 Connecting to Supabase...")

try:
    # Connect to database
    conn = psycopg2.connect(DATABASE_URL)
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = conn.cursor()
    
    print("✅ Connected successfully!\n")
    
    # Step 1: Enable pgvector extension
    print("📦 Step 1: Enabling pgvector extension...")
    cursor.execute("CREATE EXTENSION IF NOT EXISTS vector;")
    print("   ✅ pgvector enabled\n")
    
    # Step 2: Drop existing table (clean slate)
    print("🧹 Step 2: Cleaning up old tables...")
    cursor.execute("DROP TABLE IF EXISTS components CASCADE;")
    print("   ✅ Old tables removed\n")
    
    # Step 3: Create components table
    print("🔨 Step 3: Creating components table...")
    cursor.execute("""
        CREATE TABLE components (
            id TEXT PRIMARY KEY,
            filename TEXT NOT NULL,
            category TEXT NOT NULL,
            style_tags TEXT[] NOT NULL,
            color_scheme TEXT[] NOT NULL,
            complexity TEXT NOT NULL,
            props_schema JSONB NOT NULL,
            dependencies TEXT[] NOT NULL,
            description TEXT NOT NULL,
            source TEXT NOT NULL,
            code TEXT NOT NULL,
            embedding vector(384) NOT NULL,
            usage_count INTEGER DEFAULT 0,
            avg_rating FLOAT DEFAULT 0.0,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );
    """)
    print("   ✅ Table created\n")
    
    # Step 4: Create indexes
    print("📊 Step 4: Creating indexes for fast queries...")
    
    cursor.execute("CREATE INDEX idx_category ON components(category);")
    print("   ✅ Category index created")
    
    cursor.execute("CREATE INDEX idx_style_tags ON components USING GIN(style_tags);")
    print("   ✅ Style tags index created")
    
    cursor.execute("CREATE INDEX idx_complexity ON components(complexity);")
    print("   ✅ Complexity index created")
    
    cursor.execute("""
        CREATE INDEX idx_embedding ON components 
        USING ivfflat (embedding vector_cosine_ops)
        WITH (lists = 100);
    """)
    print("   ✅ Vector similarity index created\n")
    
    # Step 5: Create search function
    print("🔍 Step 5: Creating search function...")
    cursor.execute("""
        CREATE OR REPLACE FUNCTION search_components(
            query_embedding vector(384),
            match_category TEXT DEFAULT NULL,
            match_limit INT DEFAULT 5
        )
        RETURNS TABLE (
            id TEXT,
            filename TEXT,
            category TEXT,
            style_tags TEXT[],
            color_scheme TEXT[],
            complexity TEXT,
            props_schema JSONB,
            dependencies TEXT[],
            description TEXT,
            source TEXT,
            code TEXT,
            similarity FLOAT
        )
        LANGUAGE plpgsql
        AS $$
        BEGIN
            RETURN QUERY
            SELECT 
                c.id,
                c.filename,
                c.category,
                c.style_tags,
                c.color_scheme,
                c.complexity,
                c.props_schema,
                c.dependencies,
                c.description,
                c.source,
                c.code,
                1 - (c.embedding <=> query_embedding) AS similarity
            FROM components c
            WHERE 
                (match_category IS NULL OR c.category = match_category)
            ORDER BY c.embedding <=> query_embedding
            LIMIT match_limit;
        END;
        $$;
    """)
    print("   ✅ Search function created\n")
    
    # Step 6: Verify setup
    print("✅ Step 6: Verifying database setup...")
    cursor.execute("""
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'components'
        ORDER BY ordinal_position;
    """)
    
    columns = cursor.fetchall()
    print(f"   Table has {len(columns)} columns:")
    for col_name, col_type in columns[:5]:  # Show first 5
        print(f"      - {col_name}: {col_type}")
    print("      ...")
    
    # Close connection
    cursor.close()
    conn.close()
    
    print("\n" + "=" * 80)
    print("🎉 SUCCESS! Database setup complete!")
    print("=" * 80)
    print("\n📋 What was created:")
    print("   ✅ pgvector extension enabled")
    print("   ✅ components table with 15 columns")
    print("   ✅ 4 indexes for fast filtering")
    print("   ✅ Vector similarity search index")
    print("   ✅ search_components() function")
    print("\n🎯 Next step: Run upload_to_db.py to import your components")

except Exception as e:
    print(f"\n❌ ERROR: {e}")
    print("\nTroubleshooting:")
    print("1. Check your .env file has correct DATABASE_URL")
    print("2. Make sure Supabase project is running")
    print("3. Verify you can access Supabase dashboard")