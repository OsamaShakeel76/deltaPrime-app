-- DeltaPrime AI Hub Database Schema (Supabase)
-- Executable in Supabase SQL Editor (includes pgvector enablement)

-- ============================================================================
-- 0) Enable pgvector (fixes: type "vector" does not exist)
-- ============================================================================
CREATE SCHEMA IF NOT EXISTS extensions;

-- Install pgvector extension into extensions schema
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- ============================================================================
-- TABLE 1: voice_interactions
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.voice_interactions (
    id BIGSERIAL PRIMARY KEY,
    session_id UUID NOT NULL,
    user_input TEXT NOT NULL,
    bot_response TEXT NOT NULL,
    sources_used TEXT[] DEFAULT ARRAY[]::TEXT[],
    interaction_type VARCHAR(50) DEFAULT 'voice',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_voice_interactions_session_id
    ON public.voice_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_voice_interactions_created_at
    ON public.voice_interactions(created_at);

-- ============================================================================
-- TABLE 2: chat_messages
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id BIGSERIAL PRIMARY KEY,
    session_id UUID NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    sources_used TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id
    ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at
    ON public.chat_messages(created_at);

-- ============================================================================
-- TABLE 3: contact_submissions
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded', 'spam')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    responded_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_email
    ON public.contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at
    ON public.contact_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status
    ON public.contact_submissions(status);

-- ============================================================================
-- TABLE 4: user_emails
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_emails (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    source VARCHAR(100) NOT NULL,
    subscribed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_user_emails_email
    ON public.user_emails(email);
CREATE INDEX IF NOT EXISTS idx_user_emails_subscribed
    ON public.user_emails(subscribed);

-- ============================================================================
-- TABLE 5: meeting_requests
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.meeting_requests (
    id BIGSERIAL PRIMARY KEY,
    session_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    preferred_date DATE,
    preferred_time TIME,
    purpose TEXT NOT NULL,
    service_interest VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_meeting_requests_session_id
    ON public.meeting_requests(session_id);
CREATE INDEX IF NOT EXISTS idx_meeting_requests_email
    ON public.meeting_requests(email);
CREATE INDEX IF NOT EXISTS idx_meeting_requests_status
    ON public.meeting_requests(status);
CREATE INDEX IF NOT EXISTS idx_meeting_requests_preferred_date
    ON public.meeting_requests(preferred_date);

-- ============================================================================
-- TABLE 6: rag_documents (pgvector enabled)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.rag_documents (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    source_url VARCHAR(1000),
    document_type VARCHAR(100),

    -- FIX: use extensions.vector(768) so it works when vector extension is in extensions schema
    embeddings_vector extensions.vector(768),

    metadata JSONB DEFAULT '{}'::JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_rag_documents_is_active
    ON public.rag_documents(is_active);
CREATE INDEX IF NOT EXISTS idx_rag_documents_created_at
    ON public.rag_documents(created_at);

-- Optional vector index (uncomment after you have enough rows; IVFFLAT needs lists tuning)
-- CREATE INDEX IF NOT EXISTS idx_rag_documents_embeddings
--     ON public.rag_documents USING ivfflat (embeddings_vector extensions.vector_cosine_ops);

-- ============================================================================
-- TABLE 7: analytics_events
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id BIGSERIAL PRIMARY KEY,
    session_id UUID NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB DEFAULT '{}'::JSONB,
    user_agent VARCHAR(500),
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id
    ON public.analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type
    ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at
    ON public.analytics_events(created_at);

-- ============================================================================
-- TABLE 8: service_inquiries
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.service_inquiries (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    service_type VARCHAR(100) NOT NULL CHECK (service_type IN ('web_dev', 'app_dev', 'ai_dev', 'qa', 'devops')),
    message TEXT NOT NULL,
    budget_range VARCHAR(100),
    timeline VARCHAR(100),
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'in_review', 'contacted', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_service_inquiries_email
    ON public.service_inquiries(email);
CREATE INDEX IF NOT EXISTS idx_service_inquiries_service_type
    ON public.service_inquiries(service_type);
CREATE INDEX IF NOT EXISTS idx_service_inquiries_status
    ON public.service_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_service_inquiries_created_at
    ON public.service_inquiries(created_at);

-- ============================================================================
-- Enable Row Level Security (RLS)
-- ============================================================================
ALTER TABLE public.voice_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rag_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_inquiries ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Public INSERT policies (anonymous inserts)
-- ============================================================================
DROP POLICY IF EXISTS "Allow anonymous inserts on voice_interactions" ON public.voice_interactions;
CREATE POLICY "Allow anonymous inserts on voice_interactions"
    ON public.voice_interactions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anonymous inserts on chat_messages" ON public.chat_messages;
CREATE POLICY "Allow anonymous inserts on chat_messages"
    ON public.chat_messages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anonymous inserts on contact_submissions" ON public.contact_submissions;
CREATE POLICY "Allow anonymous inserts on contact_submissions"
    ON public.contact_submissions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anonymous inserts on user_emails" ON public.user_emails;
CREATE POLICY "Allow anonymous inserts on user_emails"
    ON public.user_emails FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anonymous inserts on meeting_requests" ON public.meeting_requests;
CREATE POLICY "Allow anonymous inserts on meeting_requests"
    ON public.meeting_requests FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anonymous inserts on analytics_events" ON public.analytics_events;
CREATE POLICY "Allow anonymous inserts on analytics_events"
    ON public.analytics_events FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anonymous inserts on service_inquiries" ON public.service_inquiries;
CREATE POLICY "Allow anonymous inserts on service_inquiries"
    ON public.service_inquiries FOR INSERT WITH CHECK (true);



