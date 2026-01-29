# Voice Agent RAG System - Context-Based Response System

## How the RAG System Works

### Core Principle
**Only provide information that exists in the website knowledge base. Refuse any question that cannot be answered from available context.**

---

## Request Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                     USER SPEAKS A QUESTION                          │
│                                                                       │
│              "What web development services do you offer?"           │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │  1. TRANSCRIBE (Gemini Audio API)    │
        │                                      │
        │  Output: "What web development      │
        │          services do you offer?"    │
        └──────────────────┬───────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │  2. GENERATE EMBEDDING (OpenAI)      │
        │                                      │
        │  Convert question to 1536-dim vector │
        │  using text-embedding-3-small        │
        └──────────────────┬───────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │  3. VECTOR SEARCH (Supabase)         │
        │                                      │
        │  Find similar documents in KB        │
        │  Threshold: 0.7 (70% similarity)    │
        └──────────────────┬───────────────────┘
                           │
                 ┌─────────┴─────────┐
                 │                   │
                 ▼                   ▼
        ┌─────────────────┐ ┌──────────────────┐
        │ FOUND MATCHES?  │ │  NO MATCHES?     │
        │   Similarity    │ │  Similarity      │
        │   > 0.7         │ │  < 0.7           │
        └────────┬────────┘ └────────┬─────────┘
                 │                   │
                 ▼                   ▼
        ┌─────────────────────┐   ┌──────────────────────┐
        │ RETRIEVE DOCUMENTS  │   │ RETURN REFUSAL MSG   │
        │                     │   │                      │
        │ • Web Development   │   │ "I don't have that   │
        │   Services          │   │  information on the  │
        │ • App Development   │   │  website. Connect    │
        │   Services          │   │  with our team?"     │
        │                     │   │                      │
        └────────┬────────────┘   └──────────┬───────────┘
                 │                          │
                 ▼                          │
        ┌─────────────────────┐             │
        │ BUILD STRICT CONTEXT │             │
        │                     │             │
        │ STRICT GROUNDING:   │             │
        │ "Use ONLY info      │             │
        │  from CONTEXT.      │             │
        │  Do NOT use outside │             │
        │  knowledge."        │             │
        │                     │             │
        │ CONTEXT:            │             │
        │ ================    │             │
        │ Web Development     │             │
        │ Services: ...       │             │
        │                     │             │
        │ App Development     │             │
        │ Services: ...       │             │
        │                     │             │
        └────────┬────────────┘             │
                 │                          │
                 ▼                          │
        ┌─────────────────────┐             │
        │ ASK GEMINI (strict) │             │
        │                     │             │
        │ Generate response   │             │
        │ using ONLY context  │             │
        │ above               │             │
        │                     │             │
        │ Response: "Yes,     │             │
        │ we offer web dev    │             │
        │ including..."       │             │
        └────────┬────────────┘             │
                 │                          │
                 └──────────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   FINAL RESPONSE      │
                    │                       │
                    │   Based on website    │
                    │   context ONLY        │
                    │                       │
                    │   - Researched        │
                    │   - Accurate          │
                    │   - Referenced        │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │  TEXT-TO-SPEECH       │
                    │  (Web Speech API)     │
                    │                       │
                    │  User hears response  │
                    └───────────────────────┘
```

---

## Response Examples

### ✅ QUESTION IN KNOWLEDGE BASE
**User asks:** "What AI development services do you offer?"

```
SEARCH RESULTS:
- Title: AI Development Services
  Similarity: 0.92 ✓ MATCHES (>0.7)
  
- Title: Our Process
  Similarity: 0.81 ✓ MATCHES (>0.7)

DECISION: Return response with sources
RESPONSE: "DeltaPrime specializes in custom machine learning 
           models, natural language processing, computer vision 
           solutions, recommendation engines, and AI integration..."
SOURCES: ["AI Development Services"]
```

### ❌ QUESTION NOT IN KNOWLEDGE BASE
**User asks:** "What's the weather today?"

```
SEARCH RESULTS:
- Title: Contact Information
  Similarity: 0.42 ✗ REJECTED (<0.7)

- Title: Web Development Services
  Similarity: 0.38 ✗ REJECTED (<0.7)

DECISION: No relevant documents found, REFUSE
RESPONSE: "I don't have that information available on the 
           DeltaPrime AI Solutions website yet. Would you like 
           me to connect you with our team?"
SOURCES: []
```

---

## Strict Grounding System

### How It Prevents Hallucinations

```python
# This is what gets sent to Gemini:

SYSTEM_INSTRUCTIONS = """
You are DeltaPrime AI Assistant.

STRICT GROUNDING RULES (NON-NEGOTIABLE):
1) Use ONLY the information in the CONTEXT below
2) Do NOT use outside knowledge, assumptions, or guesses
3) If answer not in CONTEXT, reply EXACTLY with:
   "I don't have that information available on the 
    DeltaPrime AI Solutions website yet..."

CONTEXT (Website Knowledge Base):
====================
Title: Web Development Services
Content: DeltaPrime offers comprehensive web development 
services including responsive design, modern frameworks 
like React and Next.js, API integrations, SEO optimization, 
and ongoing maintenance.

Title: Our Contact Information
Content: You can reach us at hr@deltaprimeaisolutions.com 
or call +923047057347.
====================

Question: What web development services do you offer?
"""
```

**Result:** Gemini MUST answer using only the provided context.

---

## Knowledge Base Structure

```sql
┌─────────────────────────────────────────┐
│        KNOWLEDGE_BASE TABLE             │
├─────────────────────────────────────────┤
│ id          | UUID Primary Key         │
│ title       | "Web Development"        │
│ content     | Full service description │
│ category    | "web_dev"                │
│ source      | "seed:web_dev"           │
│ embedding   | [0.2, 0.5, 0.8, ...]    │ ← 1536 dimensions
│             | (OpenAI generated)       │
│ created_at  | 2024-01-23               │
└─────────────────────────────────────────┘

Current Documents:
 ✓ Web Development Services
 ✓ App Development Services
 ✓ AI Development Services
 ✓ QA Services
 ✓ DevOps Services
 ✓ Contact Information
 ✓ About DeltaPrime
 ✓ Our Process
```

---

## Vector Search Mechanics

### Cosine Similarity Threshold

```
Similarity Range:  0.0 ━━━━━━━━━━━━━━━━━━━━ 1.0
                   (unrelated)      (perfect match)

Our Threshold:                    ███ 0.7
                                    ▲
                        Return documents here and above
                        Reject documents below

Example Similarities:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"Web development" vs KB "Web Development Services": 0.94 ✓
"Mobile apps" vs KB "App Development Services": 0.88 ✓
"Coding" vs KB "Web Development": 0.65 ✗
"Weather today" vs KB "Contact Information": 0.15 ✗
```

---

## Fallback Behavior

### When Vector Search Finds Nothing

```
User Query: "How do I cook pasta?"
     ↓
Vector Search Results: All < 0.7 similarity
     ↓
DECISION: Threshold check FAILED
     ↓
Return Standard Refusal:
"I don't have that information available on the 
 DeltaPrime AI Solutions website yet. Would you like 
 me to connect you with our team?"
     ↓
NO CALL TO GEMINI (prevents hallucination)
```

---

## Adding New Knowledge

### To Add Custom Documentation

```python
# 1. Add to Supabase knowledge_base table
supabase.table("knowledge_base").insert({
    "title": "Mobile Development Services",
    "content": "Our mobile development services include...",
    "category": "mobile_dev",
    "source": "seed:mobile_dev",
}).execute()

# 2. Generate embeddings
python backend/generate_embeddings.py

# 3. Now voice agent can answer questions about it
```

### Automatic Embedding Generation

```bash
python backend/generate_embeddings.py

Output:
Processing document: Mobile Development Services
 - Reading content...
 - Calling OpenAI embedding API...
 - Generated 1536-dimensional vector
 - Saved to Supabase
✓ All embeddings complete!
```

---

## Monitoring Responses

### Analytics Queries

**Find questions we refused to answer:**
```sql
SELECT user_input, COUNT(*) as frequency
FROM voice_interactions
WHERE bot_response LIKE '%don''t have that information%'
GROUP BY user_input
ORDER BY frequency DESC;
```

**Track response accuracy:**
```sql
SELECT 
    COUNT(*) as total,
    COUNT(DISTINCT session_id) as users,
    COUNT(CASE WHEN sources_used IS NOT NULL 
          THEN 1 END) as knowledge_based,
    COUNT(CASE WHEN sources_used IS NULL 
          THEN 1 END) as refusals
FROM voice_interactions;
```

---

## Key Features

| Feature | Purpose | How It Works |
|---------|---------|-------------|
| **Vector Search** | Find relevant docs | Cosine similarity on embeddings |
| **Threshold (0.7)** | Prevent false matches | Reject <70% similarity |
| **Strict Grounding** | Prevent hallucinations | Force Gemini to use context only |
| **Source Tracking** | Show references | Return KB titles used |
| **Database Logging** | Monitor quality | Store all interactions |
| **Refusal Messages** | Set expectations | Consistent "don't have that" response |

---

## Security & Reliability

✅ **No Internet Searches** - Only uses internal KB  
✅ **No Random Knowledge** - Gemini forced to use context  
✅ **Traceable Answers** - All sources logged  
✅ **Audit Trail** - All interactions stored  
✅ **Rate Limited** - Protects from abuse  

---

## Configuration Reference

```ini
# backend/services/rag.py

# Similarity threshold (0.0 to 1.0)
match_threshold = 0.7

# How many docs to retrieve (more = broader context)
match_count = 5

# Refusal message (customize here)
REFUSAL_MESSAGE = "I don't have that information..."

# System instructions (enforce strict mode)
STRICT_GROUNDING_HEADER = "Use ONLY the information..."
```

---

## Testing the System

```bash
# Test without running server
python backend/test_rag.py

# Output shows if RAG correctly:
# - Answers KB questions ✓
# - Refuses non-KB questions ✓
# - Uses proper sources ✓
# - Maintains strict grounding ✓
```

