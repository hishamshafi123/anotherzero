const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Testing Supabase Connection...');
console.log('URL:', supabaseUrl);
console.log('Key exists:', !!supabaseKey);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Test basic connection
    console.log('\n1. Testing basic connection...');
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Connection error:', error.message);
      return;
    }
    
    console.log('✅ Connection successful');
    
    // Check if campaigns table exists and get structure
    console.log('\n2. Checking campaigns table structure...');
    const { data: campaigns, error: campaignsError } = await supabase
      .from('campaigns')
      .select('*')
      .limit(1);
    
    if (campaignsError) {
      console.error('❌ Campaigns table error:', campaignsError.message);
      console.log('💡 The campaigns table might not exist yet');
      
      // Try to get all tables
      console.log('\n3. Checking what tables exist...');
      const { data: tables, error: tablesError } = await supabase.rpc('get_schema_tables');
      if (tablesError) {
        console.log('Could not fetch table list:', tablesError.message);
      } else {
        console.log('Available tables:', tables);
      }
    } else {
      console.log('✅ Campaigns table exists');
      console.log('Campaign count:', campaigns?.length || 0);
      if (campaigns && campaigns.length > 0) {
        console.log('Sample campaign fields:', Object.keys(campaigns[0]));
      }
    }
    
    // Check contacts table as well
    console.log('\n4. Checking contacts table...');
    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .select('*')
      .limit(1);
    
    if (contactsError) {
      console.error('❌ Contacts table error:', contactsError.message);
    } else {
      console.log('✅ Contacts table exists');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testConnection();