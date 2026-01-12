"""
Script to generate embeddings for knowledge base documents
Run this after setting up Supabase database and inserting documents
"""
import asyncio
from services.embeddings import get_embedding
from database import get_supabase

async def generate_all_embeddings():
    """Generate embeddings for all documents in knowledge_base without embeddings"""
    supabase = get_supabase()
    
    # Get all documents without embeddings
    result = supabase.table("knowledge_base").select("*").is_("embedding", "null").execute()
    
    if not result.data:
        print("No documents found without embeddings.")
        return
    
    print(f"Found {len(result.data)} documents without embeddings. Generating...")
    
    for doc in result.data:
        doc_id = doc["id"]
        content = doc.get("content", "")
        title = doc.get("title", "Unknown")
        
        if not content:
            print(f"Skipping {title} - no content")
            continue
        
        print(f"Generating embedding for: {title}")
        
        try:
            # Generate embedding
            embedding = await get_embedding(content)
            
            # Update document with embedding
            supabase.table("knowledge_base").update({
                "embedding": embedding
            }).eq("id", doc_id).execute()
            
            print(f"✓ Embedding generated for: {title}")
            
        except Exception as e:
            print(f"✗ Error generating embedding for {title}: {e}")
    
    print("\n✓ All embeddings generated!")

if __name__ == "__main__":
    asyncio.run(generate_all_embeddings())

