export interface Contact {
  id: string;
  source: 'instagram' | 'facebook';
  external_id: string;
  handle: string;
  name: string;
  avatar_url: string;
  interest_level: 'interested' | 'not_interested' | 'neutral';
  last_seen_at: string;
  tags: string[];
  clicks_count: number;
  campaigns_count: number;
  status: 'active' | 'inactive' | 'blocked';
  engagement_score: number;
  location?: string;
  joined_at: string;
}

export interface Campaign {
  id: string;
  name: string;
  channel: 'instagram' | 'facebook' | 'both';
  status: 'draft' | 'scheduled' | 'running' | 'paused' | 'completed';
  schedule_start_at: string;
  audience_size: number;
  sent: number;
  clicks: number;
  ctr: number;
  conversions: number;
  variants: CampaignVariant[];
  created_at: string;
  created_by: string;
  description?: string;
}

export interface CampaignVariant {
  id: string;
  name: string;
  weight: number;
  message_template: string;
  sent: number;
  clicks: number;
  ctr: number;
  conversions: number;
}

export interface ABTest {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'paused';
  campaign_id: string;
  variants: ABTestVariant[];
  start_date: string;
  end_date?: string;
  confidence_level: number;
  winner?: string;
  description: string;
}

export interface ABTestVariant {
  id: string;
  name: string;
  message: string;
  sent: number;
  clicks: number;
  ctr: number;
  conversions: number;
  conversion_rate: number;
}

export interface Template {
  id: string;
  name: string;
  type: 'start' | 'campaign' | 'follow_up';
  channel: 'instagram' | 'facebook' | 'both';
  body_text: string;
  variables: string[];
  created_at: string;
  last_used: string;
  usage_count: number;
  category: string;
}

export interface ActivityItem {
  id: string;
  type: 'click' | 'message' | 'campaign' | 'tag_added' | 'status_changed';
  description: string;
  timestamp: string;
  contact_id?: string;
  campaign_id?: string;
  metadata?: Record<string, any>;
}

export interface CampaignInteraction {
  id: string;
  campaign_name: string;
  variant: string;
  status: 'sent' | 'clicked' | 'converted' | 'ignored';
  date: string;
  message: string;
}

export interface ClickEvent {
  id: string;
  url: string;
  timestamp: string;
  campaign_id: string;
  source_platform: 'instagram' | 'facebook';
}

export interface AutomationStrategy {
  id: string;
  name: string;
  description: string;
  triggers: {
    type: 'interest_detected' | 'campaign_clicked' | 'time_delay' | 'tag_added';
    conditions: Record<string, any>;
  }[];
  actions: {
    type: 'send_message' | 'add_tag' | 'create_task' | 'assign_campaign';
    parameters: Record<string, any>;
  }[];
  isActive: boolean;
  created_at: string;
  last_triggered?: string;
}

// MOCK DATA CONSTANTS
export const MOCK_CONTACTS: Contact[] = [
  {
    id: '1',
    source: 'instagram',
    external_id: 'ig_123456',
    handle: '@sarah_fitness',
    name: 'Sarah Johnson',
    avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b193?w=100&h=100&fit=crop&crop=face',
    interest_level: 'interested',
    last_seen_at: '2024-09-03T14:30:00Z',
    tags: ['fitness', 'supplements', 'active', 'premium'],
    clicks_count: 5,
    campaigns_count: 3,
    status: 'active',
    engagement_score: 87,
    location: 'Los Angeles, CA',
    joined_at: '2024-08-15T10:20:00Z'
  },
  {
    id: '2',
    source: 'facebook',
    external_id: 'fb_789012',
    handle: 'mike.wellness',
    name: 'Mike Chen',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    interest_level: 'interested',
    last_seen_at: '2024-09-03T12:15:00Z',
    tags: ['nutrition', 'weight-loss', 'beginner'],
    clicks_count: 8,
    campaigns_count: 2,
    status: 'active',
    engagement_score: 92,
    location: 'New York, NY',
    joined_at: '2024-08-10T14:30:00Z'
  },
  {
    id: '3',
    source: 'instagram',
    external_id: 'ig_345678',
    handle: '@fitness_jenny',
    name: 'Jennifer Wilson',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    interest_level: 'neutral',
    last_seen_at: '2024-09-02T16:45:00Z',
    tags: ['yoga', 'mindfulness', 'organic'],
    clicks_count: 2,
    campaigns_count: 1,
    status: 'active',
    engagement_score: 64,
    location: 'Austin, TX',
    joined_at: '2024-08-20T09:15:00Z'
  },
  {
    id: '4',
    source: 'facebook',
    external_id: 'fb_901234',
    handle: 'david.strong',
    name: 'David Rodriguez',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    interest_level: 'not_interested',
    last_seen_at: '2024-09-01T09:20:00Z',
    tags: ['bodybuilding', 'advanced'],
    clicks_count: 0,
    campaigns_count: 1,
    status: 'inactive',
    engagement_score: 23,
    location: 'Miami, FL',
    joined_at: '2024-08-05T16:00:00Z'
  },
  {
    id: '5',
    source: 'instagram',
    external_id: 'ig_567890',
    handle: '@healthy_lisa',
    name: 'Lisa Park',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    interest_level: 'interested',
    last_seen_at: '2024-09-03T18:45:00Z',
    tags: ['healthy-eating', 'recipes', 'lifestyle'],
    clicks_count: 12,
    campaigns_count: 4,
    status: 'active',
    engagement_score: 95,
    location: 'Seattle, WA',
    joined_at: '2024-07-28T11:30:00Z'
  },
  {
    id: '6',
    source: 'facebook',
    external_id: 'fb_234567',
    handle: 'alex.trainer',
    name: 'Alex Thompson',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    interest_level: 'interested',
    last_seen_at: '2024-09-03T08:20:00Z',
    tags: ['personal-trainer', 'crossfit', 'protein'],
    clicks_count: 7,
    campaigns_count: 2,
    status: 'active',
    engagement_score: 78,
    location: 'Denver, CO',
    joined_at: '2024-08-12T13:45:00Z'
  }
];

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    name: 'September Supplement Launch',
    channel: 'both',
    status: 'running',
    schedule_start_at: '2024-09-01T10:00:00Z',
    audience_size: 1250,
    sent: 980,
    clicks: 147,
    ctr: 15.0,
    conversions: 23,
    variants: [
      {
        id: '1a',
        name: 'Direct Approach',
        weight: 60,
        message_template: 'Hey {{name}}! Saw your fitness posts 💪 Check out our new protein blend - {{link}}',
        sent: 588,
        clicks: 94,
        ctr: 16.0,
        conversions: 15
      },
      {
        id: '1b',
        name: 'Story Approach',
        weight: 40,
        message_template: 'Hi {{name}}! Your fitness journey reminds me of my own transformation... {{link}}',
        sent: 392,
        clicks: 53,
        ctr: 13.5,
        conversions: 8
      }
    ],
    created_at: '2024-08-28T14:00:00Z',
    created_by: 'Admin User',
    description: 'Launch campaign for new protein blend targeting fitness enthusiasts'
  },
  {
    id: '2',
    name: 'Weekend Warriors Retargeting',
    channel: 'instagram',
    status: 'scheduled',
    schedule_start_at: '2024-09-07T09:00:00Z',
    audience_size: 850,
    sent: 0,
    clicks: 0,
    ctr: 0,
    conversions: 0,
    variants: [
      {
        id: '2a',
        name: 'Weekend Focus',
        weight: 50,
        message_template: 'Weekend warrior vibes! 🏃‍♂️ Ready to fuel your next adventure? {{link}}',
        sent: 0,
        clicks: 0,
        ctr: 0,
        conversions: 0
      },
      {
        id: '2b',
        name: 'Recovery Focus',
        weight: 50,
        message_template: 'Post-workout recovery is key! Here\'s what top athletes use... {{link}}',
        sent: 0,
        clicks: 0,
        ctr: 0,
        conversions: 0
      }
    ],
    created_at: '2024-09-02T11:30:00Z',
    created_by: 'Sales Rep',
    description: 'Retargeting campaign for weekend fitness enthusiasts'
  },
  {
    id: '3',
    name: 'Nutrition Education Series',
    channel: 'facebook',
    status: 'completed',
    schedule_start_at: '2024-08-15T12:00:00Z',
    audience_size: 2100,
    sent: 2100,
    clicks: 294,
    ctr: 14.0,
    conversions: 41,
    variants: [
      {
        id: '3a',
        name: 'Educational Content',
        weight: 100,
        message_template: 'Did you know that timing your nutrition can boost performance by 30%? Learn more: {{link}}',
        sent: 2100,
        clicks: 294,
        ctr: 14.0,
        conversions: 41
      }
    ],
    created_at: '2024-08-10T09:00:00Z',
    created_by: 'Content Manager',
    description: 'Educational campaign focusing on nutrition timing and performance'
  }
];

export const MOCK_AB_TESTS: ABTest[] = [
  {
    id: '1',
    name: 'Message Tone Comparison',
    status: 'completed',
    campaign_id: '1',
    variants: [
      {
        id: '1a',
        name: 'Casual Tone',
        message: 'Hey! Love your fitness content 💪 Want to try something amazing?',
        sent: 500,
        clicks: 85,
        ctr: 17.0,
        conversions: 12,
        conversion_rate: 14.1
      },
      {
        id: '1b',
        name: 'Professional Tone',
        message: 'Hello! I noticed your dedication to fitness. I\'d like to share...',
        sent: 500,
        clicks: 62,
        ctr: 12.4,
        conversions: 8,
        conversion_rate: 12.9
      }
    ],
    start_date: '2024-08-15T10:00:00Z',
    end_date: '2024-08-22T10:00:00Z',
    confidence_level: 95,
    winner: '1a',
    description: 'Testing casual vs professional tone in initial outreach messages'
  },
  {
    id: '2',
    name: 'CTA Button Text',
    status: 'running',
    campaign_id: '2',
    variants: [
      {
        id: '2a',
        name: 'Learn More',
        message: 'Check out our latest supplement blend. Learn More →',
        sent: 300,
        clicks: 42,
        ctr: 14.0,
        conversions: 6,
        conversion_rate: 14.3
      },
      {
        id: '2b',
        name: 'Get Started',
        message: 'Check out our latest supplement blend. Get Started →',
        sent: 300,
        clicks: 51,
        ctr: 17.0,
        conversions: 8,
        conversion_rate: 15.7
      }
    ],
    start_date: '2024-09-01T10:00:00Z',
    confidence_level: 78,
    description: 'Testing different call-to-action button text effectiveness'
  }
];

export const MOCK_TEMPLATES: Template[] = [
  {
    id: '1',
    name: 'Fitness Enthusiast Opener',
    type: 'start',
    channel: 'both',
    body_text: 'Hey {{name}}! Saw your amazing {{workout_type}} posts 💪 Your dedication is inspiring! I have something that might interest you - {{product_link}}',
    variables: ['name', 'workout_type', 'product_link'],
    created_at: '2024-08-20T14:00:00Z',
    last_used: '2024-09-03T10:30:00Z',
    usage_count: 15,
    category: 'Outreach'
  },
  {
    id: '2',
    name: 'Supplement Follow-up',
    type: 'follow_up',
    channel: 'instagram',
    body_text: 'Hi {{name}}! Thanks for checking out our products. Here\'s a special 20% discount just for you: {{discount_code}}',
    variables: ['name', 'discount_code'],
    created_at: '2024-08-25T09:15:00Z',
    last_used: '2024-09-02T16:45:00Z',
    usage_count: 8,
    category: 'Follow-up'
  },
  {
    id: '3',
    name: 'Weekly Motivation',
    type: 'campaign',
    channel: 'both',
    body_text: 'Monday motivation coming your way, {{name}}! 🔥 This week, let\'s crush those goals together. Ready to level up? {{link}}',
    variables: ['name', 'link'],
    created_at: '2024-08-18T11:30:00Z',
    last_used: '2024-09-01T09:00:00Z',
    usage_count: 22,
    category: 'Engagement'
  },
  {
    id: '4',
    name: 'Product Education',
    type: 'campaign',
    channel: 'facebook',
    body_text: 'Hi {{name}}, did you know that {{product_benefit}}? Here\'s how it can transform your {{fitness_goal}}: {{educational_link}}',
    variables: ['name', 'product_benefit', 'fitness_goal', 'educational_link'],
    created_at: '2024-08-22T15:45:00Z',
    last_used: '2024-09-03T14:20:00Z',
    usage_count: 12,
    category: 'Education'
  }
];

export const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    type: 'click',
    description: 'Clicked product link in September Supplement Launch campaign',
    timestamp: '2024-09-03T14:30:00Z',
    contact_id: '1',
    campaign_id: '1',
    metadata: { url: 'https://example.com/product/protein-blend', variant: 'Direct Approach' }
  },
  {
    id: '2',
    type: 'message',
    description: 'Sent DM response about product pricing',
    timestamp: '2024-09-03T14:25:00Z',
    contact_id: '1',
    metadata: { message_type: 'pricing_inquiry' }
  },
  {
    id: '3',
    type: 'campaign',
    description: 'Received campaign message from Weekend Warriors campaign',
    timestamp: '2024-09-03T14:20:00Z',
    contact_id: '2',
    campaign_id: '2',
    metadata: { variant: 'Weekend Focus' }
  },
  {
    id: '4',
    type: 'tag_added',
    description: 'Added tag: premium',
    timestamp: '2024-09-03T12:15:00Z',
    contact_id: '1',
    metadata: { tag: 'premium', added_by: 'system' }
  }
];

export const MOCK_AUTOMATION_STRATEGIES: AutomationStrategy[] = [
  {
    id: '1',
    name: 'High-Intent Lead Nurturing',
    description: 'Automatically nurture leads who show high engagement',
    triggers: [
      {
        type: 'campaign_clicked',
        conditions: { clicks_threshold: 2, timeframe: '7_days' }
      }
    ],
    actions: [
      {
        type: 'add_tag',
        parameters: { tag: 'high-intent' }
      },
      {
        type: 'send_message',
        parameters: { template_id: '2', delay: '2_hours' }
      }
    ],
    isActive: true,
    created_at: '2024-08-25T10:00:00Z',
    last_triggered: '2024-09-03T14:30:00Z'
  },
  {
    id: '2',
    name: 'Re-engagement Campaign',
    description: 'Re-engage contacts who haven\'t interacted in 30 days',
    triggers: [
      {
        type: 'time_delay',
        conditions: { days_since_last_activity: 30 }
      }
    ],
    actions: [
      {
        type: 'assign_campaign',
        parameters: { campaign_id: 'reengagement_template' }
      }
    ],
    isActive: false,
    created_at: '2024-08-20T14:30:00Z'
  }
];

// Helper functions for data filtering and processing
export const getContactsByInterestLevel = (level: string) => {
  if (level === 'all') return MOCK_CONTACTS;
  return MOCK_CONTACTS.filter(contact => contact.interest_level === level);
};

export const getCampaignsByStatus = (status: string) => {
  if (status === 'all') return MOCK_CAMPAIGNS;
  return MOCK_CAMPAIGNS.filter(campaign => campaign.status === status);
};

export const getContactActivities = (contactId: string) => {
  return MOCK_ACTIVITIES.filter(activity => activity.contact_id === contactId);
};

export const getCampaignStats = () => ({
  totalCampaigns: MOCK_CAMPAIGNS.length,
  activeCampaigns: MOCK_CAMPAIGNS.filter(c => c.status === 'running').length,
  avgCTR: MOCK_CAMPAIGNS.reduce((sum, c) => sum + c.ctr, 0) / MOCK_CAMPAIGNS.length,
  totalSent: MOCK_CAMPAIGNS.reduce((sum, c) => sum + c.sent, 0),
  totalConversions: MOCK_CAMPAIGNS.reduce((sum, c) => sum + c.conversions, 0)
});

export const getContactStats = () => ({
  totalContacts: MOCK_CONTACTS.length,
  interestedContacts: MOCK_CONTACTS.filter(c => c.interest_level === 'interested').length,
  activeContacts: MOCK_CONTACTS.filter(c => c.status === 'active').length,
  avgEngagement: Math.round(MOCK_CONTACTS.reduce((sum, c) => sum + c.engagement_score, 0) / MOCK_CONTACTS.length)
});

export const getChannelStats = (channel: 'instagram' | 'facebook') => ({
  totalContacts: MOCK_CONTACTS.filter(c => c.source === channel).length,
  interestedRate: Math.round((MOCK_CONTACTS.filter(c => c.source === channel && c.interest_level === 'interested').length / MOCK_CONTACTS.filter(c => c.source === channel).length) * 100),
  avgEngagement: Math.round(MOCK_CONTACTS.filter(c => c.source === channel).reduce((sum, c) => sum + c.engagement_score, 0) / MOCK_CONTACTS.filter(c => c.source === channel).length),
  activeCampaigns: MOCK_CAMPAIGNS.filter(c => c.channel === channel || c.channel === 'both').length
});