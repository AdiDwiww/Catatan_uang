const fs = require('fs');
const path = require('path');
const csv = require('csvtojson');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const csvFilePath = path.join(__dirname, '..', 'dummy_transaksi.csv');

async function importDirectly() {
  try {
    console.log('Starting direct import process...');
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
    
    // Process and save each transaction
    let successCount = 0;
    let errorCount = 0;
    
    for (const item of jsonArray) {
      try {
        // Format the data
        const transaksi = {
          customerId: parseInt(item.customerId),
          tanggal: new Date(item.tanggal),
          produk: item.produk,
          hargaAsli: parseInt(item.hargaAsli),
          hargaJual: parseInt(item.hargaJual),
          metode: item.metode,
          tujuan: item.tujuan,
          tag: item.tag
        };
        
        // Create the transaction in the database
        await prisma.transaksi.create({
          data: transaksi
        });
        
        successCount++;
        console.log(`Imported: ${transaksi.produk} for customer ID ${transaksi.customerId}`);
      } catch (error) {
        errorCount++;
        console.error(`Error importing record:`, error.message);
      }
    }
    
    console.log(`\nImport completed: ${successCount} records imported, ${errorCount} records failed`);
    
  } catch (error) {
    console.error('Error in import process:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import function
importDirectly(); 