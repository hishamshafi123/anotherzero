// Test script to directly query Supabase campaigns table
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testCampaignsQuery() {
  console.log('🚀 Testing Supabase campaigns query...');
  console.log('📍 URL:', supabaseUrl);
  
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });
    
    console.log('✅ Query completed');
    console.log('❓ Error:', error);
    console.log('📊 Data length:', data?.length);
    
    if (data && data.length > 0) {
      console.log('🔍 First campaign:', JSON.stringify(data[0], null, 2));
      console.log('🗂️  All campaign names:', data.map(c => c.name));
      console.log('💰 Campaign sent values:', data.map(c => ({ name: c.name, sent: c.sent, ctr: c.ctr })));
    } else {
      console.log('❌ No campaigns found or query failed');
    }
    
    // Test count query
    const { count, error: countError } = await supabase
      .from('campaigns')
      .select('*', { count: 'exact', head: true });
    
    console.log('📈 Total campaigns count:', count);
    console.log('❓ Count error:', countError);
    
  } catch (err) {
    console.error('💥 Error:', err);
  }
}

testCampaignsQuery();