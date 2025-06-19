const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const csv = require('csvtojson');

// Path to the CSV file
const csvFilePath = path.join(__dirname, '..', 'dummy_transaksi.csv');

// Function to import data
async function importData() {
  try {
    console.log('Starting import process...');
    console.log(`Reading CSV file from: ${csvFilePath}`);
    
    // Check if file exists
    if (!fs.existsSync(csvFilePath)) {
      console.error(`CSV file not found: ${csvFilePath}`);
      return;
    }
    
    // Read and parse the CSV file
    const jsonArray = await csv().fromFile(csvFilePath);
    console.log(`Successfully parsed ${jsonArray.length} records from CSV`);
    
    // Ensure we have data
    if (jsonArray.length === 0) {
      console.error('No data found in CSV file');
      return;
    }
    
    // Format the data to match API expectations
    const formattedData = jsonArray.map(item => ({
      customerId: parseInt(item.customerId),
      tanggal: item.tanggal,
      produk: item.produk,
      hargaAsli: parseInt(item.hargaAsli),
      hargaJual: parseInt(item.hargaJual),
      metode: item.metode,
      tujuan: item.tujuan,
      tag: item.tag
    }));
    
    console.log('Sending data to API...');
    
    // Make the API request
    const response = await fetch('http://localhost:3000/api/transaksi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bulkImport: true,
        data: formattedData
      }),
    });
    
    // Parse the response
    const result = await response.json();
    
    // Log the result
    if (result.success) {
      console.log(`Import successful: ${result.imported} records imported, ${result.failed} records failed`);
      
      if (result.errors && result.errors.length > 0) {
        console.log('\nErrors encountered:');
        result.errors.forEach((error, index) => {
          console.log(`Error ${index + 1}: ${error.error}`);
        });
      }
    } else {
      console.error('Import failed:', result.message);
    }
    
  } catch (error) {
    console.error('Error importing data:', error);
  }
}

// Run the import function
importData(); 