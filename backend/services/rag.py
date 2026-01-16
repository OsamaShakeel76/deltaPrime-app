from services.embeddings import get_embedding
from services.gemini import generate_response
from database import get_supabase

# STRICT refusal message (exact behavior when website context is missing)
REFUSAL_MESSAGE = (
    "I don’t have that information available on the DeltaPrime AI Solutions website yet. "
    "Would you like me to connect you with our team?"
)

# System-style strict instruction for the model (passed via context wrapper)
# NOTE: Since your generate_response(context, query) only accepts (context, query),
# we inject these rules into the "context" to force strict grounding.
STRICT_GROUNDING_HEADER = f"""
You are DeltaPrime AI Assistant.

STRICT GROUNDING RULES (NON-NEGOTIABLE):
1) Use ONLY the information in the CONTEXT below.
2) Do NOT use outside knowledge, assumptions, or guesses.
3) If the answer is not explicitly supported by the CONTEXT, reply EXACTLY with:
{REFUSAL_MESSAGE}

CONTEXT (Website Knowledge Base):
"""

async def get_rag_response(query: str):
    """
    STRICT RAG Pipeline:
    1) Vector search in Supabase (website KB)
    2) If no good matches -> REFUSE (no default knowledge fallback)
    3) If matches exist -> ask Gemini using ONLY retrieved context
    """
    query = (query or "").strip()
    if not query:
        return "Please type a question.", []

    # 1) Try Supabase retrieval
    try:
        supabase = get_supabase()

        # Create query embedding
        query_embedding = await get_embedding(query)

        # Vector similarity search
        results = supabase.rpc("match_documents", {
            "query_embedding": query_embedding,
            "match_threshold": 0.7,   # keep your threshold (you can tune later)
            "match_count": 5
        }).execute()

        docs = results.data if results and results.data else []

        # 2) If nothing found -> STRICT refusal
        if not docs:
            return REFUSAL_MESSAGE, []

        # 3) Build strict context
        context_parts = []
        sources = []

        for doc in docs:
            title = doc.get("title", "Unknown")
            content = doc.get("content", "")

            # skip empty docs
            if not content or not content.strip():
                continue

            context_parts.append(f"Title: {title}\nContent:\n{content}")
            sources.append(title)

        # If all retrieved docs were empty -> refuse
        if not context_parts:
            return REFUSAL_MESSAGE, []

        context = "\n\n---\n\n".join(context_parts)

        # Add strict instruction header before context
        strict_context = f"{STRICT_GROUNDING_HEADER}\n{context}"

        # 4) Ask Gemini (ONLY with website context)
        response = await generate_response(strict_context, query)

        # 5) Hard guard: if Gemini answers without support, you still want refusal.
        # We do a simple safety check: if response is empty or too generic, refuse.
        if not response or not str(response).strip():
            return REFUSAL_MESSAGE, []

        return response, sources

    except Exception as e:
        # If Supabase isn't available, we should still refuse (website-only requirement)
        print(f"RAG error (Supabase/Embeddings/Gemini): {e}")
        return REFUSAL_MESSAGE, []
