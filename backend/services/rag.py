from services.embeddings import get_embedding
from services.gemini import generate_response
from database import get_supabase

# Default knowledge base content (fallback when Supabase is not configured)
DEFAULT_KNOWLEDGE_BASE = """DeltaPrime AI Solutions offers comprehensive technology services:

1. Web Development: We build responsive, modern web applications using React, Next.js, TypeScript, and Tailwind CSS. Our services include full-stack development, API integrations, SEO optimization, and ongoing maintenance.

2. App Development: We specialize in mobile app development for iOS and Android platforms. Our services include native app development, cross-platform solutions using React Native and Flutter, app store optimization, and post-launch support.

3. AI Development: Our AI development services include custom machine learning models, natural language processing, computer vision solutions, recommendation engines, and AI integration into existing systems.

4. QA Services: We provide comprehensive quality assurance services including manual testing, automated testing, performance testing, security testing, and continuous testing throughout the development lifecycle.

5. DevOps Services: Our DevOps services include CI/CD pipeline setup, cloud infrastructure management, containerization with Docker and Kubernetes, monitoring and logging, and automated deployment strategies.

Contact Information:
- Email: hello@deltaprime.ai
- Phone: +1 (234) 567-890
- Office Hours: Monday to Friday, 9 AM to 6 PM EST

Our Process:
1. Discovery - Understanding your needs and requirements
2. Design - Creating solution architecture
3. Develop - Building your solution
4. Deploy - Launching and optimizing

Meeting Scheduling:
We offer free consultation meetings to discuss your project needs. To schedule a meeting:
- You can request a meeting through this chat
- Our team will contact you within 24 hours to confirm the meeting time
- Meetings can be scheduled via video call (Zoom, Google Meet) or in-person
- Available time slots: Monday to Friday, 9 AM to 6 PM EST
- Meeting duration: Typically 30-60 minutes
- What to prepare: Brief description of your project, budget range, timeline expectations

When a client requests a meeting, collect their:
- Name
- Email address
- Preferred date/time
- Meeting purpose (which service they're interested in)
- Any specific questions or topics to discuss"""

async def get_rag_response(query: str):
    """
    RAG Pipeline:
    1. Try to search vector database (if Supabase configured)
    2. Fallback to default knowledge base
    3. Generate response with Gemini
    """
    # Try to use Supabase vector search if available
    try:
        supabase = get_supabase()
        
        # 1. Generate query embedding
        query_embedding = await get_embedding(query)
        
        # 2. Vector similarity search in Supabase
        try:
            results = supabase.rpc("match_documents", {
                "query_embedding": query_embedding,
                "match_threshold": 0.7,
                "match_count": 5
            }).execute()
            
            if results.data and len(results.data) > 0:
                # 3. Build context from retrieved documents
                context_parts = []
                for doc in results.data:
                    context_parts.append(f"Title: {doc.get('title', 'Unknown')}\nContent: {doc.get('content', '')}")
                context = "\n\n---\n\n".join(context_parts)
                
                # 4. Generate response with Gemini
                response = await generate_response(context, query)
                
                # 5. Extract sources
                sources = [doc.get("title", "Unknown") for doc in results.data]
                
                return response, sources
        except Exception as e:
            print(f"Vector search not available (using default knowledge): {e}")
            # Fall through to default context
            
    except Exception as e:
        print(f"Supabase not configured (using default knowledge): {e}")
        # Fall through to default context
    
    # Fallback: use default knowledge base with Gemini
    try:
        response = await generate_response(DEFAULT_KNOWLEDGE_BASE, query)
        return response, []
    except Exception as e:
        print(f"Gemini API error: {e}")
        # Final fallback: simple response
        return "I'm Delta, your AI assistant for DeltaPrime AI Solutions. We offer Web Development, App Development, AI Development, QA Services, and DevOps. For more information, please contact us at hello@deltaprime.ai", []
