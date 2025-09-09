import { supabase } from './supabase'
import * as mockData from '@/data/mockData'

export type Contact = {
  id: string
  user_id: string
  source: 'instagram' | 'facebook'
  external_id: string
  handle: string
  name: string
  avatar_url: string
  interest_level: 'interested' | 'not_interested' | 'neutral'
  last_interaction_at: string
  tags: string[]
  clicks_count: number
  campaigns_count: number
  status: 'active' | 'inactive' | 'blocked'
  engagement_score: number
  location?: string
  joined_at: string
  created_at: string
  updated_at: string
}

export type Campaign = {
  id: string
  name: string
  channel: 'instagram' | 'facebook' | 'both'
  status: 'draft' | 'scheduled' | 'running' | 'paused' | 'completed'
  schedule_start_at: string
  audience_size: number
  sent: number
  clicks: number
  ctr: number
  conversions: number
  variants: Array<{
    id: string
    name: string
    weight: number
    ctr: number
  }>
  created_at: string
  created_by: string
  description?: string
  updated_at: string
}

export type Event = {
  id: string
  type: 'click' | 'message' | 'campaign' | 'tag_added' | 'status_changed'
  contact_id?: string
  campaign_id?: string
  data: Record<string, any>
  created_at: string
}

// Contact queries
export async function getContacts(): Promise<Contact[]> {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching contacts:', error)
      // Return mock data as fallback
      return generateMockContacts()
    }
    
    return data && data.length > 0 ? data : generateMockContacts()
  } catch (error) {
    console.error('Error connecting to Supabase:', error)
    return generateMockContacts()
  }
}

// Generate mock contacts with proper structure
function generateMockContacts(): Contact[] {
  return mockData.recentContacts.map((contact, index) => ({
    id: `contact-${index + 1}`,
    user_id: `user-${index + 1}`,
    source: contact.channel.toLowerCase() as 'instagram' | 'facebook',
    external_id: `ext-${index + 1}`,
    handle: contact.handle,
    name: contact.name,
    avatar_url: `https://ui-avatars.com/api/?name=${contact.name.replace(' ', '+')}&background=1d4ed8&color=fff`,
    interest_level: contact.interest_level as 'interested' | 'not_interested' | 'neutral',
    last_interaction_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    tags: [],
    clicks_count: Math.floor(Math.random() * 10),
    campaigns_count: Math.floor(Math.random() * 5),
    status: Math.random() > 0.3 ? 'active' : 'inactive',
    engagement_score: Math.floor(Math.random() * 100),
    location: undefined,
    joined_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  }))
}

export async function getContactsByChannel(channel: 'instagram' | 'facebook'): Promise<Contact[]> {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('source', channel)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error(`Error fetching ${channel} contacts:`, error)
    return []
  }
  
  return data || []
}

// Campaign queries
export async function getCampaigns(): Promise<Campaign[]> {
  try {
    console.log('🚀 getCampaigns() - Starting Supabase query...')
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false })
    
    console.log('🔍 Supabase campaigns response - error:', error, 'data length:', data?.length)
    
    if (error) {
      console.warn('❌ Supabase campaigns query failed, using mock data:', error)
      return generateMockCampaigns()
    }
    
    if (data && data.length > 0) {
      console.log('✅ Using REAL campaign data from Supabase:', data.length, 'campaigns')
      console.log('🔍 First campaign sample:', data[0])
      console.log('🔍 Campaign fields:', Object.keys(data[0] || {}))
      return data
    } else {
      console.warn('📊 Supabase campaigns table is empty, using mock data')
      return generateMockCampaigns()
    }
  } catch (error) {
    console.error('❌ Failed to connect to Supabase, using mock data:', error)
    return generateMockCampaigns()
  }
}

// Generate mock campaigns
function generateMockCampaigns(): Campaign[] {
  return mockData.campaigns.map((campaign, index) => ({
    id: `campaign-${index + 1}`,
    name: campaign.name,
    channel: campaign.channel.toLowerCase() as 'instagram' | 'facebook' | 'both',
    status: campaign.status.toLowerCase() as 'draft' | 'scheduled' | 'running' | 'paused' | 'completed',
    schedule_start_at: new Date().toISOString(),
    audience_size: campaign.sent + Math.floor(Math.random() * 1000),
    sent: campaign.sent,
    clicks: campaign.clicks,
    ctr: campaign.ctr,
    conversions: Math.floor(campaign.clicks * 0.1),
    variants: [],
    created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    created_by: 'user-1',
    description: `${campaign.name} campaign`,
    updated_at: new Date().toISOString(),
  }))
}

export async function getCampaignsByChannel(channel: 'instagram' | 'facebook'): Promise<Campaign[]> {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .in('channel', [channel, 'both'])
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error(`Error fetching ${channel} campaigns:`, error)
    return []
  }
  
  return data || []
}

// Analytics and stats functions
export async function getContactStats() {
  const contacts = await getContacts()
  
  return {
    totalContacts: contacts.length,
    interestedContacts: contacts.filter(c => c.interest_level === 'interested').length,
    activeContacts: contacts.filter(c => c.status === 'active').length,
    avgEngagement: Math.round(contacts.reduce((sum, c) => sum + (c.engagement_score || 0), 0) / contacts.length) || 0
  }
}

export async function getChannelStats(channel?: 'instagram' | 'facebook') {
  const contacts = channel ? await getContactsByChannel(channel) : await getContacts()
  const campaigns = channel ? await getCampaignsByChannel(channel) : await getCampaigns()
  
  const totalContacts = contacts.length
  const interestedContacts = contacts.filter(c => c.interest_level === 'interested').length
  const totalClicks = contacts.reduce((sum, c) => sum + c.clicks_count, 0)
  const totalSent = campaigns.reduce((sum, c) => sum + c.sent, 0)
  
  return {
    contacts: totalContacts,
    interested: interestedContacts,
    clicks: totalClicks,
    ctr: totalSent > 0 ? totalClicks / totalSent : 0,
    campaigns: campaigns.length,
    activeCampaigns: campaigns.filter(c => c.status === 'running').length
  }
}

export async function getCampaignStats() {
  const campaigns = await getCampaigns()
  
  const totalSent = campaigns.reduce((sum, c) => sum + c.sent, 0)
  const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0)
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0)
  
  return {
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter(c => c.status === 'running').length,
    totalSent,
    totalClicks,
    totalConversions,
    avgCtr: totalSent > 0 ? totalClicks / totalSent : 0,
    conversionRate: totalClicks > 0 ? totalConversions / totalClicks : 0
  }
}

// Dashboard specific data aggregation
export async function getDashboardData() {
  const [contacts, campaigns] = await Promise.all([
    getContacts(),
    getCampaigns()
  ])
  
  // Note: Engagement over time chart removed - no real daily click data available
  
  // Campaign CTR data - using real Supabase campaigns
  console.log('📊 getDashboardData campaigns:', campaigns.length, 'campaigns found')
  console.log('📋 Campaign details:', campaigns.map(c => ({ name: c.name, sent: c.sent, ctr: c.ctr })))
  
  const campaignCTr = campaigns
    .filter(c => c.sent && c.sent > 0) // Only show campaigns that have been sent
    .map(c => ({
      name: c.name,
      ctr: c.ctr
    }))
    .slice(0, 4) // Show top 4 campaigns
  
  console.log('📈 Campaign CTR data (after filter):', campaignCTr)
  
  // Channel split
  const instagramContacts = contacts.filter(c => c.source === 'instagram').length
  const facebookContacts = contacts.filter(c => c.source === 'facebook').length
  const totalChannelContacts = instagramContacts + facebookContacts
  
  const channelSplit = [
    { 
      name: 'Instagram', 
      value: totalChannelContacts > 0 ? Math.round((instagramContacts / totalChannelContacts) * 100) : 0 
    },
    { 
      name: 'Facebook', 
      value: totalChannelContacts > 0 ? Math.round((facebookContacts / totalChannelContacts) * 100) : 0 
    }
  ]
  
  // Recent contacts (last 10)
  const recentContacts = contacts
    .sort((a, b) => new Date(b.last_interaction_at || b.created_at).getTime() - new Date(a.last_interaction_at || a.created_at).getTime())
    .slice(0, 10)
    .map(c => ({
      id: c.id,
      user_id: c.user_id,
      name: c.name,
      handle: c.handle,
      channel: c.source === 'instagram' ? 'Instagram' : 'Facebook',
      interest_level: c.interest_level,
      status: c.status,
      stage: getContactStage(c)
    }))
  
  return {
    campaignCTr,
    channelSplit,
    campaigns: campaigns.slice(0, 10), // Recent campaigns
    recentContacts
  }
}

// Events queries
export async function getEvents(): Promise<Event[]> {
  console.log('🔄 getEvents() called - ALWAYS using fixed mock events for stable chart')
  // Always return fixed mock events for stable engagement chart
  // This ensures clicks data doesn't change on every reload
  return generateMockEvents()
}

// Generate mock events with fixed dates for stable chart
function generateMockEvents(): Event[] {
  const events: Event[] = []
  
  // Create events with fixed patterns across last 7 days for consistent chart
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const eventPatterns = [
    { day: 0, clicks: 5, messages: 3, campaigns: 1 }, // 6 days ago
    { day: 1, clicks: 8, messages: 4, campaigns: 2 }, // 5 days ago  
    { day: 2, clicks: 12, messages: 6, campaigns: 1 }, // 4 days ago
    { day: 3, clicks: 15, messages: 8, campaigns: 3 }, // 3 days ago
    { day: 4, clicks: 10, messages: 5, campaigns: 2 }, // 2 days ago
    { day: 5, clicks: 18, messages: 9, campaigns: 2 }, // yesterday
    { day: 6, clicks: 14, messages: 7, campaigns: 1 }, // today
  ]
  
  let eventId = 1
  eventPatterns.forEach((pattern, dayIndex) => {
    const date = new Date(today)
    date.setDate(date.getDate() - (6 - dayIndex))
    
    // Add clicks for this day
    for (let i = 0; i < pattern.clicks; i++) {
      events.push({
        id: `event-${eventId++}`,
        type: 'click',
        contact_id: `user-${(i % 4) + 1}`,
        campaign_id: `campaign-${(i % 3) + 1}`,
        data: { action: 'click_event' },
        created_at: new Date(date.getTime() + (i * 60 * 60 * 1000)).toISOString(),
      })
    }
    
    // Add messages for this day
    for (let i = 0; i < pattern.messages; i++) {
      events.push({
        id: `event-${eventId++}`,
        type: 'message',
        contact_id: `user-${(i % 4) + 1}`,
        campaign_id: undefined,
        data: { action: 'message_event' },
        created_at: new Date(date.getTime() + ((i + pattern.clicks) * 60 * 60 * 1000)).toISOString(),
      })
    }
    
    // Add campaigns for this day
    for (let i = 0; i < pattern.campaigns; i++) {
      events.push({
        id: `event-${eventId++}`,
        type: 'campaign',
        contact_id: `user-${(i % 4) + 1}`,
        campaign_id: `campaign-${(i % 3) + 1}`,
        data: { action: 'campaign_event' },
        created_at: new Date(date.getTime() + ((i + pattern.clicks + pattern.messages) * 60 * 60 * 1000)).toISOString(),
      })
    }
  })
  
  console.log('📅 FIXED Mock events generated - sample clicks by day:', 
    eventPatterns.map((p, i) => ({ day: i, clicks: p.clicks })))
  
  return events
}

// Helper function to insert sample campaigns into Supabase for testing
export async function insertSampleCampaigns() {
  const sampleCampaigns = [
    {
      name: 'Instagram PR Pack Launch',
      channel: 'instagram' as const,
      status: 'running' as const,
      sent: 8421,
      clicks: 3612,
      ctr: 0.43,
      conversions: 361,
      created_by: 'user-1',
      description: 'Main Instagram campaign for PR pack promotion'
    },
    {
      name: 'Facebook Founder Feature',
      channel: 'facebook' as const,
      status: 'running' as const,
      sent: 6210,
      clicks: 1998,
      ctr: 0.32,
      conversions: 199,
      created_by: 'user-1',
      description: 'Facebook campaign featuring founder stories'
    },
    {
      name: 'Pro Bundle Cross-Channel',
      channel: 'both' as const,
      status: 'paused' as const,
      sent: 3120,
      clicks: 1497,
      ctr: 0.48,
      conversions: 149,
      created_by: 'user-1',
      description: 'Cross-platform campaign for Pro bundle'
    },
    {
      name: 'Summer Sale Instagram',
      channel: 'instagram' as const,
      status: 'completed' as const,
      sent: 5500,
      clicks: 1815,
      ctr: 0.33,
      conversions: 181,
      created_by: 'user-1',
      description: 'Summer promotion campaign'
    }
  ]

  try {
    const { data, error } = await supabase
      .from('campaigns')
      .insert(sampleCampaigns)
      .select()

    if (error) {
      console.error('❌ Failed to insert sample campaigns:', error)
      return { success: false, error }
    }

    console.log('✅ Successfully inserted sample campaigns:', data?.length)
    return { success: true, data }
  } catch (error) {
    console.error('❌ Error inserting sample campaigns:', error)
    return { success: false, error }
  }
}

// Utility functions
function getContactStage(contact: Contact): string {
  if (contact.clicks_count > 0) return 'Clicked Link'
  if (contact.interest_level === 'interested') return 'High Interest'
  if (contact.campaigns_count > 0) return 'Engaged'
  if (contact.interest_level === 'not_interested') return 'Not Interested'
  return 'New'
}

// Mock AB test data (until AB tests table is created)
export const MOCK_AB_TESTS = [
  {
    id: '1',
    name: 'DM CTA length',
    status: 'running' as const,
    campaign_id: '1',
    variants: [
      { id: '1a', name: 'Short CTA', message: 'Quick message', sent: 1000, clicks: 420, ctr: 0.42, conversions: 50, conversion_rate: 0.05 },
      { id: '1b', name: 'Long CTA', message: 'Longer message', sent: 1000, clicks: 490, ctr: 0.49, conversions: 65, conversion_rate: 0.065 }
    ],
    start_date: '2024-01-01',
    confidence_level: 95,
    winner: 'B',
    description: 'Testing CTA length effectiveness'
  },
  {
    id: '2',
    name: 'Message personalization',
    status: 'running' as const,
    campaign_id: '2',
    variants: [
      { id: '2a', name: 'Generic', message: 'Generic message', sent: 800, clicks: 280, ctr: 0.35, conversions: 25, conversion_rate: 0.031 },
      { id: '2b', name: 'Personalized', message: 'Personal message', sent: 800, clicks: 264, ctr: 0.33, conversions: 30, conversion_rate: 0.038 }
    ],
    start_date: '2024-01-15',
    confidence_level: 82,
    description: 'Testing personalization impact'
  }
]