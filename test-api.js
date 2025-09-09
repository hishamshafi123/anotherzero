// Test your API endpoint
const apiUrl = 'https://n8n.anas.codes/webhook-test/46f147c3-c946-47cd-a613-212f8e06d7b6';

const testContact = {
  source: 'instagram',
  external_id: 'ig_api_test_456', 
  handle: '@api_test_user',

  name: 'API Test User',
  interest_level: 'interested'
};

fetch(apiUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testContact)
})
.then(response => response.json())
.then(data => console.log('API Response:', data))
.catch(error => console.error('Error:', error));