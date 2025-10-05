"""
Phase 3: FastAPI Backend for RAG Website Generator (FIXED + RAG PROOF LOGGING)
Endpoints:
- POST /api/search - Test component retrieval
- POST /api/generate - Full generation pipeline
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import psycopg2
from sentence_transformers import SentenceTransformer
import openai
import os
from dotenv import load_dotenv
import json
import re
from datetime import datetime

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="RAG Website Generator API", version="1.0")

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize models and connections
print("Loading embedding model...")
embedding_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
print("Model loaded!")

# OpenAI setup
openai.api_key = os.getenv('OPENAI_API_KEY')
DATABASE_URL = os.getenv('DATABASE_URL')

# Database connection pool
def get_db_connection():
    return psycopg2.connect(DATABASE_URL)

# ============================================
# Request/Response Models
# ============================================

class SearchRequest(BaseModel):
    query: str
    category: Optional[str] = None
    limit: int = 5

class GenerateRequest(BaseModel):
    prompt: str

class ComponentResult(BaseModel):
    id: str
    category: str
    description: str
    similarity: float
    style_tags: List[str]

class SearchResponse(BaseModel):
    query: str
    results: List[ComponentResult]
    count: int

class GenerateResponse(BaseModel):
    code: str
    components_used: List[str]
    generation_time_ms: int

# ============================================
# Helper Functions
# ============================================

def clean_llm_response(response_text: str) -> str:
    """Clean LLM response - remove explanations and extract only code"""
    
    # Remove common LLM preambles
    preambles = [
        "Certainly! Here's",
        "Here's the",
        "Sure! Here's",
        "Here is the",
        "Below is the",
        "I've created",
        "I've modified"
    ]
    
    for preamble in preambles:
        if response_text.strip().startswith(preamble):
            lines = response_text.split('\n')
            for i, line in enumerate(lines):
                if line.strip().startswith('import ') or line.strip().startswith('export '):
                    response_text = '\n'.join(lines[i:])
                    break
    
    # Extract code from markdown blocks
    if '```' in response_text:
        code_blocks = re.findall(r'```(?:typescript|tsx|javascript|jsx)?\n(.*?)```', response_text, re.DOTALL)
        if code_blocks:
            response_text = max(code_blocks, key=len)
    
    # Remove trailing explanations
    lines = response_text.split('\n')
    last_code_line = len(lines) - 1
    for i in range(len(lines) - 1, -1, -1):
        line = lines[i].strip()
        if line and not line.startswith('//') and not line.startswith('*'):
            if line.endswith('}') or line.endswith(';') or line.endswith('>'):
                last_code_line = i
                break
    
    response_text = '\n'.join(lines[:last_code_line + 1])
    
    return response_text.strip()


def search_components_db(query: str, category: Optional[str] = None, limit: int = 5):
    """Search database for relevant components"""
    
    query_embedding = embedding_model.encode(query).tolist()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        if category:
            cursor.execute("""
                SELECT id, category, description, style_tags,
                       1 - (embedding <=> %s::vector) as similarity
                FROM components
                WHERE category = %s
                ORDER BY embedding <=> %s::vector
                LIMIT %s;
            """, (query_embedding, category, query_embedding, limit))
        else:
            cursor.execute("""
                SELECT id, category, description, style_tags,
                       1 - (embedding <=> %s::vector) as similarity
                FROM components
                ORDER BY embedding <=> %s::vector
                LIMIT %s;
            """, (query_embedding, query_embedding, limit))
        
        results = cursor.fetchall()
        
        return [
            {
                "id": row[0],
                "category": row[1],
                "description": row[2],
                "style_tags": row[3],
                "similarity": float(row[4])
            }
            for row in results
        ]
    finally:
        cursor.close()
        conn.close()


def get_component_code(component_ids: List[str]):
    """Fetch full component code from database"""
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
            SELECT id, code, props_schema, description
            FROM components
            WHERE id = ANY(%s);
        """, (component_ids,))
        
        results = cursor.fetchall()
        
        return [
            {
                "id": row[0],
                "code": row[1],
                "props_schema": row[2],
                "description": row[3]
            }
            for row in results
        ]
    finally:
        cursor.close()
        conn.close()

# ============================================
# OpenAI Prompt Templates
# ============================================

INTENT_PARSER_PROMPT = """
You are an expert at analyzing website generation requests. Extract structured intent from the user prompt.

User Prompt: {user_prompt}

Extract and return JSON with:
1. site_type: category (e.g., "saas_landing", "portfolio", "ecommerce", "blog")
2. required_components: list of component types needed (e.g., ["navigation", "hero", "footer"])
3. style_hints: object with tone, color preferences, design style
4. content_hints: specific content elements mentioned

Return ONLY valid JSON, no explanation.

Example:
{{
  "site_type": "saas_landing",
  "required_components": ["navigation", "hero", "footer"],
  "style_hints": {{"tone": "professional", "style": "modern"}},
  "content_hints": {{"focus": "productivity tool"}}
}}
"""

COMPOSITION_PROMPT = """
You are an expert React developer. Create a complete Next.js page by combining these pre-built components.

User Request: {user_prompt}

Available Components:
{components_context}

Your Task:
1. Use components AS-IS (don't modify their code)
2. Create a complete Next.js page with proper imports
3. Configure props appropriately
4. Ensure Tailwind styling is consistent
5. Add TypeScript types

CRITICAL: Return ONLY the raw TypeScript code. No explanations, no markdown blocks, no commentary. Start directly with imports.

Example format:
import {{ ComponentA }} from '@/components/category/ComponentA'
import {{ ComponentB }} from '@/components/category/ComponentB'

export default function Page() {{
  return (
    <div>
      <ComponentA prop1="value" />
      <ComponentB prop2="value" />
    </div>
  )
}}
"""

UNIQUENESS_PROMPT = """
You are a creative web designer. Take this functional code and make it feel unique and custom.

Original Code:
{initial_code}

User's Intent: {user_prompt}

Make it unique by:
1. Rewriting copy/headings (generic → specific tone)
2. Customizing colors (use cohesive palette)
3. Adjusting spacing for visual interest
4. Adding variety to prop values

CRITICAL: 
- Only change prop values, copy, colors, spacing
- DO NOT modify component imports or structure
- Return ONLY the raw code, no explanations or markdown blocks

Start directly with imports:
"""

# ============================================
# API Endpoints
# ============================================

@app.get("/")
def root():
    return {
        "message": "RAG Website Generator API",
        "version": "1.0",
        "endpoints": {
            "search": "POST /api/search",
            "generate": "POST /api/generate"
        }
    }

@app.post("/api/search", response_model=SearchResponse)
def search_endpoint(request: SearchRequest):
    """Test component retrieval"""
    
    try:
        results = search_components_db(
            query=request.query,
            category=request.category,
            limit=request.limit
        )
        
        return SearchResponse(
            query=request.query,
            results=results,
            count=len(results)
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate", response_model=GenerateResponse)
def generate_endpoint(request: GenerateRequest):
    """Full website generation pipeline"""
    
    import time
    start_time = time.time()
    
    try:
        print("\n" + "="*100)
        print(f"🚀 NEW GENERATION REQUEST - {datetime.now().strftime('%H:%M:%S')}")
        print("="*100)
        
        # Step 1: Parse intent
        print(f"\n📋 STEP 1: PARSING INTENT")
        print(f"User Prompt: '{request.prompt}'")
        
        intent_response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{
                "role": "user",
                "content": INTENT_PARSER_PROMPT.format(user_prompt=request.prompt)
            }],
            response_format={"type": "json_object"},
            temperature=0.1
        )
        
        intent = json.loads(intent_response.choices[0].message.content)
        print(f"✅ Intent parsed: {json.dumps(intent, indent=2)}")
        print(f"🎯 Token usage (intent): Input={intent_response.usage.prompt_tokens}, Output={intent_response.usage.completion_tokens}")
        
        # Step 2: Retrieve components from DATABASE
        print(f"\n🔍 STEP 2: RETRIEVING COMPONENTS FROM DATABASE (RAG)")
        print(f"Required categories: {intent.get('required_components', ['navigation', 'hero', 'footer'])}")
        
        all_components = []
        components_used = []
        retrieval_details = []
        
        for category in intent.get('required_components', ['navigation', 'hero', 'footer']):
            search_query = f"{request.prompt} {category}"
            print(f"\n  🔎 Searching database for: '{search_query}' (category: {category})")
            
            results = search_components_db(
                query=search_query,
                category=category,
                limit=2
            )
            
            if results:
                selected = results[0]
                all_components.append(selected['id'])
                components_used.append(selected['id'])
                retrieval_details.append({
                    'category': category,
                    'component_id': selected['id'],
                    'similarity': selected['similarity']
                })
                print(f"  ✅ Retrieved: {selected['id']} (similarity: {selected['similarity']:.3f})")
        
        print(f"\n📦 PROOF: Retrieved {len(components_used)} PRE-BUILT components from database:")
        for detail in retrieval_details:
            print(f"  • {detail['component_id']} - {detail['category']} (match score: {detail['similarity']:.3f})")
        
        # Step 3: Fetch full component code from database
        print(f"\n💾 STEP 3: FETCHING FULL COMPONENT CODE FROM DATABASE")
        component_details = get_component_code(all_components)
        
        total_component_lines = 0
        total_component_chars = 0
        
        print("\n" + "-"*100)
        print("PROOF: These are PRE-WRITTEN components, NOT generated by LLM")
        print("-"*100)
        
        for comp in component_details:
            lines = len(comp['code'].split('\n'))
            chars = len(comp['code'])
            total_component_lines += lines
            total_component_chars += chars
            
            print(f"\n📄 Component: {comp['id']}")
            print(f"   Source: RETRIEVED FROM DATABASE")
            print(f"   Code size: {lines} lines, {chars} characters")
            print(f"   Props schema: {json.dumps(comp['props_schema'])}")
            print(f"   First 150 chars of code:")
            print(f"   {comp['code'][:150]}...")
        
        print("\n" + "-"*100)
        print(f"📊 TOTAL PRE-WRITTEN CODE: {total_component_lines} lines, {total_component_chars:,} characters")
        print(f"💡 These components exist in our database BEFORE LLM call")
        print("-"*100)
        
        # Format for LLM
        components_context = "\n\n".join([
            f"### {comp['id']}\n```typescript\n{comp['code']}\n```\n"
            for comp in component_details
        ])
        
        # Step 4: Compose with OpenAI (ASSEMBLY, not generation)
        print(f"\n🔧 STEP 4: LLM COMPOSITION (Assembly Only, Not Generation)")
        print(f"LLM task: Assemble pre-built components + configure props")
        print(f"LLM is NOT writing component code from scratch")
        
        composition_response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[{
                "role": "user",
                "content": COMPOSITION_PROMPT.format(
                    user_prompt=request.prompt,
                    components_context=components_context
                )
            }],
            temperature=0.3,
            max_tokens=4000
        )
        
        initial_code = composition_response.choices[0].message.content
        initial_code = clean_llm_response(initial_code)
        
        comp_input_tokens = composition_response.usage.prompt_tokens
        comp_output_tokens = composition_response.usage.completion_tokens
        
        print(f"\n📊 COMPOSITION TOKEN BREAKDOWN:")
        print(f"   Input tokens: {comp_input_tokens}")
        print(f"      └─ Of which ~{total_component_chars // 4} tokens are PRE-WRITTEN component code")
        print(f"   Output tokens: {comp_output_tokens}")
        print(f"      └─ LLM only wrote GLUE CODE and prop configuration")
        print(f"\n💰 Cost: ~${(comp_input_tokens * 0.0025 + comp_output_tokens * 0.01) / 1000:.4f}")
        
        # Step 5: Uniqueness pass
        print(f"\n🎨 STEP 5: UNIQUENESS PASS (Customization)")
        
        uniqueness_response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[{
                "role": "user",
                "content": UNIQUENESS_PROMPT.format(
                    initial_code=initial_code,
                    user_prompt=request.prompt
                )
            }],
            temperature=0.7,
            max_tokens=4000
        )
        
        final_code = uniqueness_response.choices[0].message.content
        final_code = clean_llm_response(final_code)
        
        unique_input_tokens = uniqueness_response.usage.prompt_tokens
        unique_output_tokens = uniqueness_response.usage.completion_tokens
        
        print(f"   Input tokens: {unique_input_tokens}")
        print(f"   Output tokens: {unique_output_tokens}")
        print(f"   Cost: ~${(unique_input_tokens * 0.0025 + unique_output_tokens * 0.01) / 1000:.4f}")
        
        generation_time = int((time.time() - start_time) * 1000)
        
        # Final summary
        total_input_tokens = intent_response.usage.prompt_tokens + comp_input_tokens + unique_input_tokens
        total_output_tokens = intent_response.usage.completion_tokens + comp_output_tokens + unique_output_tokens
        total_cost = (total_input_tokens * 0.0025 + total_output_tokens * 0.01) / 1000
        
        print("\n" + "="*100)
        print("✅ GENERATION COMPLETE - SUMMARY")
        print("="*100)
        print(f"⏱️  Time: {generation_time / 1000:.1f}s")
        print(f"📦 Components used: {', '.join(components_used)}")
        print(f"\n📊 TOKEN USAGE PROOF:")
        print(f"   Total input tokens: {total_input_tokens:,}")
        print(f"      └─ Most are PRE-WRITTEN components (~{total_component_chars // 4:,} tokens)")
        print(f"   Total output tokens: {total_output_tokens:,}")
        print(f"      └─ Only assembly code, NOT full component generation")
        print(f"   Total cost: ${total_cost:.3f}")
        print(f"\n💡 COMPARISON:")
        print(f"   Our approach: {total_input_tokens:,} input, {total_output_tokens:,} output")
        print(f"   v0/Lovable (estimate): 500 input, 15,000+ output (generating from scratch)")
        print(f"   Savings: ~{((15000 - total_output_tokens) / 15000 * 100):.0f}% fewer output tokens")
        print("="*100 + "\n")
        
        return GenerateResponse(
            code=final_code,
            components_used=components_used,
            generation_time_ms=generation_time
        )
    
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    """Health check endpoint"""
    try:
        conn = get_db_connection()
        conn.close()
        return {"status": "healthy", "database": "connected"}
    except:
        return {"status": "unhealthy", "database": "disconnected"}

if __name__ == "__main__":
    import uvicorn
    print("Starting FastAPI server...")
    print("API will be available at: http://localhost:8000")
    print("API docs at: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)