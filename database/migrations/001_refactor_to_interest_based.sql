-- Migration: Refactor CRM to Interest-Based Lead Generator
-- Date: 2025-01-04
-- Description: Remove complex conversation tracking, focus on interest detection

-- Step 1: Remove unused tables
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS messages CASCADE; 
DROP TABLE IF EXISTS purchases CASCADE;
DROP TABLE IF EXISTS followups CASCADE;

-- Step 2: Update contacts table for interest-based approach
ALTER TABLE contacts 
  ADD COLUMN IF NOT EXISTS interest_level text CHECK (interest_level IN ('interested', 'not_interested', 'neutral')) DEFAULT 'neutral',
  ADD COLUMN IF NOT EXISTS last_interaction_at timestamp with time zone DEFAULT now(),
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
  DROP COLUMN IF EXISTS first_seen_at,
  DROP COLUMN IF EXISTS country;

-- Step 3: Simplify templates table (remove followup type)
ALTER TABLE templates 
  DROP CONSTRAINT IF EXISTS templates_type_check;

ALTER TABLE templates 
  ADD CONSTRAINT templates_type_check CHECK (type IN ('campaign', 'start'));

-- Step 4: Update campaigns table to focus on engagement metrics
ALTER TABLE campaigns 
  DROP COLUMN IF EXISTS revenue_target,
  DROP COLUMN IF EXISTS purchase_tracking_enabled,
  ADD COLUMN IF NOT EXISTS interest_filter text CHECK (interest_filter IN ('all', 'interested', 'not_interested', 'neutral')) DEFAULT 'interested';

-- Step 5: Create analytics events table for simplified tracking
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL CHECK (event_type IN ('contact_created', 'interest_detected', 'campaign_sent', 'link_clicked', 'campaign_opened')),
  contact_id uuid REFERENCES contacts(id) ON DELETE CASCADE,
  campaign_id uuid REFERENCES campaigns(id) ON DELETE SET NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);

-- Step 6: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_contacts_interest_level ON contacts(interest_level);
CREATE INDEX IF NOT EXISTS idx_contacts_source ON contacts(source);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_contact_id ON events(contact_id);
CREATE INDEX IF NOT EXISTS idx_events_campaign_id ON events(campaign_id);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at);

-- Step 7: Update existing data (if any)
UPDATE contacts SET interest_level = 'neutral' WHERE interest_level IS NULL;
UPDATE contacts SET last_interaction_at = created_at WHERE last_interaction_at IS NULL;