-- DeltaPrime AI Solutions Database Setup
-- Run this in Supabase SQL Editor

-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_submissions(created_at);

-- 3. Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_session ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_created ON chat_messages(created_at);

-- 4. Create knowledge_base table (for RAG)
CREATE TABLE IF NOT EXISTS knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT,
    embedding vector(1536),  -- OpenAI embedding dimension
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Vector similarity index
CREATE INDEX IF NOT EXISTS knowledge_base_embedding_idx ON knowledge_base 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_kb_category ON knowledge_base(category);

-- 5. Create user_emails table
CREATE TABLE IF NOT EXISTS user_emails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    source TEXT,  -- 'contact_form', 'chat_widget', 'service_inquiry'
    service_interest TEXT,
    subscribed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_email ON user_emails(email);

-- 6. Create service_inquiries table (optional)
CREATE TABLE IF NOT EXISTS service_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    service_type TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_email ON service_inquiries(email);
CREATE INDEX IF NOT EXISTS idx_service_type ON service_inquiries(service_type);

-- 7. Create vector search function
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

-- 8. Create meeting_requests table
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

CREATE INDEX IF NOT EXISTS idx_meeting_email ON meeting_requests(email);
CREATE INDEX IF NOT EXISTS idx_meeting_status ON meeting_requests(status);
CREATE INDEX IF NOT EXISTS idx_meeting_created ON meeting_requests(created_at);

-- 9. Insert sample knowledge base documents
-- Note: You'll need to generate embeddings for these separately

INSERT INTO knowledge_base (title, content, category) VALUES
('Web Development Services', 'DeltaPrime offers comprehensive web development services including responsive design, modern frameworks like React and Next.js, API integrations, SEO optimization, and ongoing maintenance. We build scalable web applications that drive business growth.', 'web_dev'),
('App Development Services', 'We specialize in mobile app development for iOS and Android platforms. Our services include native app development, cross-platform solutions using React Native and Flutter, app store optimization, and post-launch support.', 'app_dev'),
('AI Development Services', 'Our AI development services include custom machine learning models, natural language processing, computer vision solutions, recommendation engines, and AI integration into existing systems.', 'ai_dev'),
('QA Services', 'We provide comprehensive quality assurance services including manual testing, automated testing, performance testing, security testing, and continuous testing throughout the development lifecycle.', 'qa'),
('DevOps Services', 'Our DevOps services include CI/CD pipeline setup, cloud infrastructure management, containerization with Docker and Kubernetes, monitoring and logging, and automated deployment strategies.', 'devops'),
('About DeltaPrime', 'DeltaPrime AI Solutions is a leading software development agency specializing in web development, mobile apps, AI solutions, QA, and DevOps. We help businesses transform through innovative technology solutions.', 'about'),
('Our Process', 'Our development process includes: 1) Discovery - understanding your needs, 2) Design - creating solution architecture, 3) Develop - building your solution, 4) Deploy - launching and optimizing.', 'process'),
('Contact Information', 'You can reach us at hello@deltaprime.ai or call +1 (234) 567-890. Our office hours are Monday to Friday, 9 AM to 6 PM EST.', 'contact');

-- Note: After inserting documents, you need to generate embeddings for them
-- This can be done via a Python script or API call

