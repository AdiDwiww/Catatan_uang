// Test script untuk memverifikasi API transaksi
const testTransaksiAPI = async () => {
  try {
    console.log('Testing transaksi API...');
    
    // Test data
    const testData = {
      customerId: 1,
      tanggal: new Date().toISOString().split('T')[0],
      produk: 'Test Produk',
      hargaAsli: 100000,
      hargaJual: 150000,
      metode: 'Cash',
      tujuan: 'Test Tujuan',
      tag: 'Test Tag',
      mataUang: 'IDR',
      kurs: 1
    };
    
    console.log('Sending test data:', testData);
    
    const response = await fetch('http://localhost:3000/api/transaksi', {
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
      const errorText = await response.text();
      console.error('Error response:', errorText);
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run test if this file is executed directly
if (typeof window === 'undefined') {
  testTransaksiAPI();
} 