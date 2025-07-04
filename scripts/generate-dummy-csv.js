const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Products with realistic prices
const products = [
  { name: 'Laptop Asus VivoBook', basePrice: 8500000, sellPrice: 9200000 },
  { name: 'Smartphone Samsung A53', basePrice: 4200000, sellPrice: 4800000 },
  { name: 'Monitor LG 24"', basePrice: 1800000, sellPrice: 2100000 },
  { name: 'Keyboard Mechanical', basePrice: 850000, sellPrice: 1100000 },
  { name: 'Mouse Gaming', basePrice: 250000, sellPrice: 350000 },
  { name: 'Headphone Sony', basePrice: 1200000, sellPrice: 1500000 },
  { name: 'Speaker Bluetooth', basePrice: 350000, sellPrice: 450000 },
  { name: 'Powerbank 10000mAh', basePrice: 180000, sellPrice: 250000 },
  { name: 'SSD 500GB', basePrice: 750000, sellPrice: 900000 },
  { name: 'RAM DDR4 8GB', basePrice: 450000, sellPrice: 550000 }
];

// Payment methods
const paymentMethods = [
  'Cash', 'Transfer Bank', 'QRIS', 'Kartu Kredit', 'E-Wallet'
];

// Destinations/channels
const destinations = [
  'Online Shop', 'Marketplace', 'Offline Store', 'Direct Order', 'Dropship'
];

// Tags
const tags = [
  'Promo', 'Regular', 'Bundle', 'Pre-Order', 'Clearance'
];

// Function to generate random date within the last 30 days
function getRandomDate() {
  const today = new Date();
  const pastDays = Math.floor(Math.random() * 30); // Random day up to 30 days in the past
  const date = new Date(today);
  date.setDate(today.getDate() - pastDays);
  return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
}

// Function to generate random product with slight price variation
function getRandomProduct() {
  const product = products[Math.floor(Math.random() * products.length)];
  
  // Add slight randomness to prices (±5%)
  const priceVariation = (Math.random() * 0.1) - 0.05; // -5% to +5%
  const basePrice = Math.round(product.basePrice * (1 + priceVariation));
  const sellPrice = Math.round(product.sellPrice * (1 + priceVariation));
  
  return {
    name: product.name,
    basePrice,
    sellPrice
  };
}

// Function to generate CSV file
async function generateCsvFile() {
  try {
    // Get all existing customers
    const customers = await prisma.customer.findMany();
    
    if (customers.length === 0) {
      console.log('No customers found. Please create some customers first.');
      return;
    }
    
    console.log(`Found ${customers.length} customers. Generating CSV...`);
    
    // CSV header
    let csvContent = 'customerId,tanggal,produk,hargaAsli,hargaJual,metode,tujuan,tag\n';
    
    // Generate 20 rows of dummy data
    for (let i = 0; i < 20; i++) {
      // Randomly select a customer
      const customer = customers[Math.floor(Math.random() * customers.length)];
      
      // Generate random product and other data
      const product = getRandomProduct();
      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      const destination = destinations[Math.floor(Math.random() * destinations.length)];
      const tag = tags[Math.floor(Math.random() * tags.length)];
      const date = getRandomDate();
      
      // Create CSV row
      const row = [
        customer.id,
        date,
        product.name,
        product.basePrice,
        product.sellPrice,
        paymentMethod,
        destination,
        tag
      ].join(',');
      
      csvContent += row + '\n';
    }
    
    // Write to file
    const filePath = path.join(__dirname, '..', 'dummy_transaksi.csv');
    fs.writeFileSync(filePath, csvContent);
    
    console.log(`Successfully created CSV file at: ${filePath}`);
    
  } catch (error) {
    console.error('Error generating CSV file:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
generateCsvFile(); 