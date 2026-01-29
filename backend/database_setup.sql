-- DeltaPrime AI Solutions Database Setup (CLEAN)
-- Run this in Supabase SQL Editor

-- 0) Required extensions
-- Note: Enable 'vector' and 'pgcrypto' extensions in Supabase Dashboard
-- (Project Settings > Database > Extensions)
-- CREATE EXTENSION IF NOT EXISTS vector;
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1) contact_submissions
CREATE TABLE contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_contact_email ON contact_submissions(email);
CREATE INDEX idx_contact_created ON contact_submissions(created_at);

-- 2) chat_messages
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_chat_session ON chat_messages(session_id);
CREATE INDEX idx_chat_created ON chat_messages(created_at);

-- 3) knowledge_base (RAG)
CREATE TABLE IF NOT EXISTS knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT,

    -- ✅ for auto-ingest + upsert
    source TEXT UNIQUE,

    embedding vector(1536),
    metadata JSONB,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Vector similarity index
CREATE INDEX knowledge_base_embedding_idx ON knowledge_base
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

CREATE INDEX idx_kb_category ON knowledge_base(category);
CREATE INDEX idx_kb_source ON knowledge_base(source);

-- 4) user_emails
CREATE TABLE IF NOT EXISTS user_emails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    source TEXT,  -- 'contact_form', 'chat_widget', 'service_inquiry'
    service_interest TEXT,
    subscribed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_email ON user_emails(email);

-- 5) service_inquiries
CREATE TABLE IF NOT EXISTS service_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    service_type TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_service_email ON service_inquiries(email);
CREATE INDEX idx_service_type ON service_inquiries(service_type);

-- 6) meeting_requests
CREATE TABLE IF NOT EXISTS meeting_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    name TEXT,
    email TEXT,
    preferred_date TEXT,
    preferred_time TEXT,
    purpose TEXT,
    service_interest TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_meeting_email ON meeting_requests(email);
CREATE INDEX idx_meeting_status ON meeting_requests(status);
CREATE INDEX idx_meeting_created ON meeting_requests(created_at);

-- 7) voice_interactions (NEW - for voice agent logging)
CREATE TABLE IF NOT EXISTS voice_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    user_input TEXT NOT NULL,
    bot_response TEXT NOT NULL,
    sources_used TEXT[],
    interaction_type TEXT DEFAULT 'voice',
    confidence_score FLOAT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_voice_session ON voice_interactions(session_id);
CREATE INDEX idx_voice_created ON voice_interactions(created_at);
CREATE INDEX idx_voice_interaction_type ON voice_interactions(interaction_type);

-- 8) updated_at trigger
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_kb_updated ON knowledge_base;

CREATE TRIGGER trg_kb_updated
BEFORE UPDATE ON knowledge_base
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- 9) Vector search function (RPC)
CREATE OR REPLACE FUNCTION match_documents(
    query_embedding vector(1536),
    match_threshold float DEFAULT 0.7,
    match_count int DEFAULT 5,
    category_filter text DEFAULT NULL
)
RETURNS TABLE (
    id uuid,
    title text,
    content text,
    category text,
    source text,
    metadata jsonb,
    similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        kb.id,
        kb.title,
        kb.content,
        kb.category,
        kb.source,
        kb.metadata,
        1 - (kb.embedding <=> query_embedding) as similarity
    FROM knowledge_base kb
    WHERE 
        kb.embedding IS NOT NULL
        AND 1 - (kb.embedding <=> query_embedding) > match_threshold
        AND (category_filter IS NULL OR kb.category = category_filter)
    ORDER BY kb.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- 10) Seed knowledge base (optional)
-- NOTE: Embeddings will be NULL until your Python ingestion script updates them.
INSERT INTO knowledge_base (title, content, category, source, metadata)
VALUES
('Web Development Services',
 'DeltaPrime offers comprehensive web development services including responsive design, modern frameworks like React and Next.js, API integrations, SEO optimization, and ongoing maintenance.',
 'web_dev',
 'seed:web_dev',
 '{"type":"seed"}'::jsonb),

('App Development Services',
 'We specialize in mobile app development for iOS and Android platforms. Our services include native app development and cross-platform solutions using React Native and Flutter.',
 'app_dev',
 'seed:app_dev',
 '{"type":"seed"}'::jsonb),

('AI Development Services',
 'Our AI development services include custom machine learning models, natural language processing, computer vision solutions, recommendation engines, and AI integration into existing systems.',
 'ai_dev',
 'seed:ai_dev',
 '{"type":"seed"}'::jsonb),

('QA Services',
 'We provide comprehensive quality assurance services including manual testing, automated testing, performance testing, security testing, and continuous testing throughout the development lifecycle.',
 'qa',
 'seed:qa',
 '{"type":"seed"}'::jsonb),

('DevOps Services',
 'Our DevOps services include CI/CD pipeline setup, cloud infrastructure management, containerization with Docker and Kubernetes, monitoring and logging, and automated deployment strategies.',
 'devops',
 'seed:devops',
 '{"type":"seed"}'::jsonb),

('About DeltaPrime',
 'DeltaPrime AI Solutions is a software development agency specializing in web development, mobile apps, AI solutions, QA, and DevOps.',
 'about',
 'seed:about',
 '{"type":"seed"}'::jsonb),

('Our Process',
 'Our development process includes: Discovery, Design, Develop, and Deploy.',
 'process',
 'seed:process',
 '{"type":"seed"}'::jsonb),

('Contact Information',
 'You can reach us at hr@deltaprimeaisolutions.com or call +923047057347.',
 'contact',
 'seed:contact',
 '{"type":"seed"}'::jsonb)
ON CONFLICT (source) DO NOTHING;
