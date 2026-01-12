from openai import OpenAI
from config import OPENAI_API_KEY
import os

# Initialize OpenAI client
client = None
if OPENAI_API_KEY and OPENAI_API_KEY != "your_openai_key_here":
    client = OpenAI(api_key=OPENAI_API_KEY)

async def get_embedding(text: str):
    """
    Generate embedding for text using OpenAI API
    Falls back to simple hash if OpenAI key not configured
    """
    if not client:
        # Fallback: return a simple hash-based embedding (not ideal, but works for testing)
        import hashlib
        hash_obj = hashlib.md5(text.encode())
        # Convert to 1536-dim vector (simple approach)
        hash_hex = hash_obj.hexdigest()
        # Create a basic embedding from hash
        embedding = [int(hash_hex[i:i+2], 16) / 255.0 for i in range(0, min(32, len(hash_hex)), 2)]
        # Pad to 1536 dimensions
        while len(embedding) < 1536:
            embedding.extend(embedding[:min(1536 - len(embedding), len(embedding))])
        return embedding[:1536]
    
    try:
        response = client.embeddings.create(
            model="text-embedding-3-small",
            input=text
        )
        return response.data[0].embedding
    except Exception as e:
        print(f"Error generating embedding: {e}")
        # Fallback to hash-based
        import hashlib
        hash_obj = hashlib.md5(text.encode())
        hash_hex = hash_obj.hexdigest()
        embedding = [int(hash_hex[i:i+2], 16) / 255.0 for i in range(0, min(32, len(hash_hex)), 2)]
        while len(embedding) < 1536:
            embedding.extend(embedding[:min(1536 - len(embedding), len(embedding))])
        return embedding[:1536]

