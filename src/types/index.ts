// Simplified TypeScript interfaces for Interest-Based Lead Generator

export type InterestLevel = 'interested' | 'not_interested' | 'neutral';
export type Channel = 'instagram' | 'facebook';
export type CampaignStatus = 'draft' | 'running' | 'paused' | 'completed';
export type EventType = 'contact_created' | 'interest_detected' | 'campaign_sent' | 'link_clicked' | 'campaign_opened';

// Core Contact interface - simplified for interest detection
export interface Contact {
  id: string;
  source: Channel;
  external_id: string;
  handle: string;
  name?: string;
  avatar_url?: string;
  interest_level: InterestLevel;
  last_interaction_at: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

// Simplified Campaign interface - removed purchase tracking
export interface Campaign {
  id: string;
  name: string;
  channel: Channel;
  status: CampaignStatus;
  interest_filter: InterestLevel | 'all';
  sent_count: number;
  click_count: number;
  ctr: number;
  created_at: string;
  updated_at: string;
}

// Campaign variants for A/B testing
export interface CampaignVariant {
  id: string;
  campaign_id: string;
  name: string;
  message_template: string;
  weight: number;
  sent_count: number;
  click_count: number;
  ctr: number;
}

// Simplified analytics event
export interface Event {
  id: string;
  event_type: EventType;
  contact_id?: string;
  campaign_id?: string;
  metadata: Record<string, any>;
  created_at: string;
}

// Meta webhook payload - simplified for interest detection
export interface MetaWebhookPayload {
  source: Channel;
  contact_external_id: string;
  handle: string;
  name?: string;
  avatar_url?: string;
  message_text: string; // For interest analysis only
  interest_level: InterestLevel;
  timestamp: string;
}

// Campaign dispatch to n8n - simplified
export interface CampaignDispatch {
  campaign_id: string;
  targets: Array<{
    contact_id: string;
    external_id: string;
    channel: Channel;
    interest_level: InterestLevel;
  }>;
  variants: Array<{
    id: string;
    weight: number;
    message_template: string;
  }>;
  schedule: {
    start_at: string;
    rate_limit_per_min: number;
  };
}

// Dashboard KPIs - focused on interest & engagement
export interface DashboardKPIs {
  totalContacts: number;
  interestedContacts: number;
  interestedRate: number; // interested / total contacts
  activeCampaigns: number;
  averageCTR: number; // clicks / messages sent
  totalClicks: number;
}

// Analytics data structures
export interface AnalyticsData {
  totalComments: number;
  interestDetectionRate: number;
  campaignReach: number;
  deliveryRate: number;
  clickThroughRate: number;
  variantPerformance: Array<{
    variant_id: string;
    name: string;
    ctr: number;
    clicks: number;
    sent: number;
  }>;
}

// Chart data interfaces
export interface EngagementByDay {
  day: string;
  contacts: number;
  interested: number;
  clicks: number;
}

export interface CampaignCTR {
  name: string;
  ctr: number;
}

export interface ChannelSplit {
  name: string;
  value: number;
}

// A/B Test data - simplified
export interface ABTest {
  test: string;
  variantA: {
    ctr: number;
    clicks: number;
  };
  variantB: {
    ctr: number;
    clicks: number;
  };
  pValue: number;
  status: string;
}