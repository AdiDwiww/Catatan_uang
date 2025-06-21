const fetch = require('node-fetch');

async function testAPI() {
  try {
    console.log('Testing API endpoints...');
    
    // Test customer API without session (should fail)
    console.log('\n1. Testing customer API without session:');
    const response1 = await fetch('http://localhost:3001/api/customer');
    console.log('Status:', response1.status);
    const data1 = await response1.json();
    console.log('Response:', data1);
    
    // Test with session cookie (if available)
    console.log('\n2. Testing with session cookie:');
    const response2 = await fetch('http://localhost:3001/api/customer', {
      headers: {
        'Cookie': 'next-auth.session-token=test'
      }
    });
    console.log('Status:', response2.status);
    const data2 = await response2.json();
    console.log('Response:', data2);
    
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testAPI(); 