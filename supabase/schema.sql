-- Meetly Database Schema
-- Run this in your Supabase SQL Editor

-- Meetings table
CREATE TABLE IF NOT EXISTS meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id TEXT UNIQUE NOT NULL,
  host_name TEXT NOT NULL,
  host_user_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'ended')),
  recording_enabled BOOLEAN DEFAULT true
);

-- Participants table
CREATE TABLE IF NOT EXISTS participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  left_at TIMESTAMPTZ,
  is_host BOOLEAN DEFAULT false,
  camera_enabled BOOLEAN DEFAULT false,
  mic_enabled BOOLEAN DEFAULT false
);

-- Recordings table
CREATE TABLE IF NOT EXISTS recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  recording_url TEXT,
  duration INTEGER DEFAULT 0,
  status TEXT DEFAULT 'started' CHECK (status IN ('started', 'stopped', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_meetings_meeting_id ON meetings(meeting_id);
CREATE INDEX IF NOT EXISTS idx_participants_meeting_id ON participants(meeting_id);
CREATE INDEX IF NOT EXISTS idx_recordings_meeting_id ON recordings(meeting_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_meeting_id ON chat_messages(meeting_id);
CREATE INDEX IF NOT EXISTS idx_participants_left_at ON participants(left_at);

-- Row Level Security (disabled for simplicity - API routes handle auth)
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Allow public access via API (since we use server-side API routes)
CREATE POLICY "Public access for meetings" ON meetings FOR ALL USING (true);
CREATE POLICY "Public access for participants" ON participants FOR ALL USING (true);
CREATE POLICY "Public access for recordings" ON recordings FOR ALL USING (true);
CREATE POLICY "Public access for chat_messages" ON chat_messages FOR ALL USING (true);
