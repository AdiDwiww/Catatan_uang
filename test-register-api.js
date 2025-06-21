// Test script untuk menguji API registrasi
const testRegisterAPI = async () => {
  try {
    console.log('Testing register API...');
    
    // Test data
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };
    
    console.log('Sending test data:', { ...testData, password: '[HIDDEN]' });
    
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success! Response data:', data);
    } else {
      const errorData = await response.json();
      console.error('Error response:', errorData);
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run test if this file is executed directly
if (typeof window === 'undefined') {
  testRegisterAPI();
} 