-- ==============================================================
-- GEEKS UNITED // SUPABASE DATABASE SETUP SCHEMA
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- Safe to re-run multiple times (Idempotent & handles existing policies)
-- ==============================================================

-- 1. Events Table (For Ongoing, Upcoming & Previous Events)
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('ongoing', 'upcoming', 'previous')),
  date TEXT NOT NULL,
  venue TEXT NOT NULL,
  perk TEXT,
  "desc" TEXT NOT NULL,
  photo TEXT,
  tag TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS & allow public read/write access
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read on events" ON events;
DROP POLICY IF EXISTS "Allow public insert on events" ON events;
DROP POLICY IF EXISTS "Allow public update on events" ON events;
DROP POLICY IF EXISTS "Allow public delete on events" ON events;

CREATE POLICY "Allow public read on events" ON events FOR SELECT USING (true);
CREATE POLICY "Allow public insert on events" ON events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on events" ON events FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on events" ON events FOR DELETE USING (true);


-- 2. Coordinators Table (For Faculty and Student Coordinators)
CREATE TABLE IF NOT EXISTS coordinators (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('teacher', 'student')),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  dept_or_domain TEXT NOT NULL,
  email TEXT NOT NULL,
  linkedin TEXT,
  social TEXT,
  avatar TEXT,
  bio TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE coordinators ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read on coordinators" ON coordinators;
DROP POLICY IF EXISTS "Allow public insert on coordinators" ON coordinators;
DROP POLICY IF EXISTS "Allow public update on coordinators" ON coordinators;
DROP POLICY IF EXISTS "Allow public delete on coordinators" ON coordinators;

CREATE POLICY "Allow public read on coordinators" ON coordinators FOR SELECT USING (true);
CREATE POLICY "Allow public insert on coordinators" ON coordinators FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on coordinators" ON coordinators FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on coordinators" ON coordinators FOR DELETE USING (true);


-- 3. Join Us Applications Table (For Student Cohort Induction)
CREATE TABLE IF NOT EXISTS join_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  college_email TEXT NOT NULL,
  year_of_study TEXT NOT NULL,
  primary_domain TEXT NOT NULL,
  skills TEXT,
  portfolio_link TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE join_applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public insert on join_applications" ON join_applications;
DROP POLICY IF EXISTS "Allow public read on join_applications" ON join_applications;
DROP POLICY IF EXISTS "Allow public update on join_applications" ON join_applications;
DROP POLICY IF EXISTS "Allow public delete on join_applications" ON join_applications;

CREATE POLICY "Allow public insert on join_applications" ON join_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on join_applications" ON join_applications FOR SELECT USING (true);
CREATE POLICY "Allow public update on join_applications" ON join_applications FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on join_applications" ON join_applications FOR DELETE USING (true);


-- 4. Contact Messages Table (For Direct Inquiries & Partnerships)
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public insert on contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "Allow public read on contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "Allow public update on contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "Allow public delete on contact_messages" ON contact_messages;

CREATE POLICY "Allow public insert on contact_messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on contact_messages" ON contact_messages FOR SELECT USING (true);
CREATE POLICY "Allow public update on contact_messages" ON contact_messages FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on contact_messages" ON contact_messages FOR DELETE USING (true);


-- 5. Coordinator Access Requests Table (Requires Admin Approval by ghantysayan8@gmail.com)
CREATE TABLE IF NOT EXISTS coordinator_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role_requested TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT
);

ALTER TABLE coordinator_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public insert on coordinator_requests" ON coordinator_requests;
DROP POLICY IF EXISTS "Allow public read on coordinator_requests" ON coordinator_requests;
DROP POLICY IF EXISTS "Allow public update on coordinator_requests" ON coordinator_requests;
DROP POLICY IF EXISTS "Allow public delete on coordinator_requests" ON coordinator_requests;

CREATE POLICY "Allow public insert on coordinator_requests" ON coordinator_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on coordinator_requests" ON coordinator_requests FOR SELECT USING (true);
CREATE POLICY "Allow public update on coordinator_requests" ON coordinator_requests FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on coordinator_requests" ON coordinator_requests FOR DELETE USING (true);

-- 6. Enable Realtime Publications (So every device & account receives live updates immediately)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'events'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE events;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'coordinators'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE coordinators;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'coordinator_requests'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE coordinator_requests;
  END IF;
END $$;
