// Test direct import from new lib location
const { getCampaigns } = require('./lib/supabase-queries.js');

console.log('Testing direct import from ./lib/supabase-queries.js');
console.log('getCampaigns function exists:', typeof getCampaigns === 'function');

// Test the function
getCampaigns()
  .then(campaigns => {
    console.log('✅ Success! Got campaigns:', campaigns.length);
    console.log('First campaign:', campaigns[0]);
  })
  .catch(error => {
    console.error('❌ Error:', error.message);
  });