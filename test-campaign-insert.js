// Test script to insert sample campaigns into Supabase
const { insertSampleCampaigns } = require('./src/lib/supabase-queries.ts');

async function testCampaignInsert() {
  console.log('🚀 Inserting sample campaigns into Supabase...');
  
  try {
    const result = await insertSampleCampaigns();
    
    if (result.success) {
      console.log('✅ Success! Campaign CTR will now show real Supabase data');
      console.log('📊 Inserted campaigns:', result.data?.map(c => c.name));
    } else {
      console.log('❌ Failed to insert campaigns:', result.error);
    }
  } catch (error) {
    console.error('💥 Script error:', error);
  }
}

testCampaignInsert();