const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testCampaignsQuery() {
  try {
    console.log('🚀 getCampaigns() - Starting Supabase query...')
    
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false })
    
    console.log('🔍 Supabase campaigns response - error:', error, 'data length:', data?.length)
    
    if (error) {
      console.warn('❌ Supabase campaigns query failed:', error)
      return
    }
    
    if (data && data.length > 0) {
      console.log('✅ Using REAL campaign data from Supabase:', data.length, 'campaigns')
      console.log('🔍 First campaign sample:', JSON.stringify(data[0], null, 2))
      console.log('🔍 Campaign fields:', Object.keys(data[0] || {}))
      
      // Check if the data matches expected structure
      const campaign = data[0]
      const requiredFields = ['id', 'name', 'channel', 'status', 'sent', 'clicks', 'ctr']
      const missingFields = requiredFields.filter(field => !(field in campaign))
      
      if (missingFields.length > 0) {
        console.warn('⚠️ Missing required fields:', missingFields)
      } else {
        console.log('✅ All required fields present')
      }
      
      // Add empty variants array as done in the actual code
      const processedData = data.map(campaign => ({ ...campaign, variants: [] }))
      console.log('✅ Data processed successfully with variants array')
      
      return processedData
    } else {
      console.warn('📊 Supabase campaigns table is empty')
      return []
    }
  } catch (error) {
    console.error('❌ Failed to connect to Supabase:', error.message)
    return []
  }
}

// Also test campaign stats
async function testCampaignStats() {
  try {
    console.log('\n🚀 Testing getCampaignStats...')
    
    const { data: campaigns, error } = await supabase
      .from('campaigns')
      .select('*')
    
    if (error) {
      console.error('❌ Stats query failed:', error)
      return
    }
    
    console.log('✅ Got campaigns for stats:', campaigns?.length || 0)
    
    if (campaigns && campaigns.length > 0) {
      const totalSent = campaigns.reduce((sum, c) => sum + (c.sent || 0), 0)
      const totalClicks = campaigns.reduce((sum, c) => sum + (c.clicks || 0), 0)
      const totalConversions = campaigns.reduce((sum, c) => sum + (c.conversions || 0), 0)
      
      const stats = {
        totalCampaigns: campaigns.length,
        activeCampaigns: campaigns.filter(c => c.status === 'running').length,
        avgCtr: totalSent > 0 ? totalClicks / totalSent : 0,
        totalConversions: totalConversions
      }
      
      console.log('📊 Campaign stats:', stats)
    }
  } catch (error) {
    console.error('❌ Stats test failed:', error.message)
  }
}

async function runTests() {
  await testCampaignsQuery()
  await testCampaignStats()
}

runTests();