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
  { name: 'RAM DDR4 8GB', basePrice: 450000, sellPrice: 550000 },
  { name: 'Webcam HD', basePrice: 350000, sellPrice: 450000 },
  { name: 'Charger Laptop', basePrice: 250000, sellPrice: 350000 },
  { name: 'USB Hub', basePrice: 120000, sellPrice: 180000 },
  { name: 'Router WiFi', basePrice: 450000, sellPrice: 550000 },
  { name: 'Printer Canon', basePrice: 1500000, sellPrice: 1800000 }
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
  'Promo', 'Regular', 'Bundle', 'Pre-Order', 'Clearance', 'Special'
];

// Function to generate random date within the last 60 days
function getRandomDate() {
  const today = new Date();
  const pastDays = Math.floor(Math.random() * 60); // Random day up to 60 days in the past
  const date = new Date(today);
  date.setDate(today.getDate() - pastDays);
  return date;
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

// Function to create dummy transactions
async function createDummyTransactions() {
  try {
    // Get all existing customers
    const customers = await prisma.customer.findMany();
    
    if (customers.length === 0) {
      console.log('No customers found. Please create some customers first.');
      return;
    }
    
    console.log(`Found ${customers.length} customers. Generating transactions...`);
    
    const transactions = [];
    const createdTransactions = [];
    
    // Generate 20 dummy transactions
    for (let i = 0; i < 20; i++) {
      // Randomly select a customer
      const customer = customers[Math.floor(Math.random() * customers.length)];
      
      // Generate random product and other data
      const product = getRandomProduct();
      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      const destination = destinations[Math.floor(Math.random() * destinations.length)];
      const tag = tags[Math.floor(Math.random() * tags.length)];
      const date = getRandomDate();
      
      // Create transaction object
      const transaction = {
        customerId: customer.id,
        tanggal: date,
        produk: product.name,
        hargaAsli: product.basePrice,
        hargaJual: product.sellPrice,
        metode: paymentMethod,
        tujuan: destination,
        tag: tag
      };
      
      transactions.push(transaction);
      
      // Create transaction in the database (one by one)
      try {
        const createdTransaction = await prisma.transaksi.create({
          data: transaction,
          include: { customer: true }
        });
        createdTransactions.push(createdTransaction);
        console.log(`Created transaction ${i+1}/20: ${product.name} for ${customer.nama}`);
      } catch (createError) {
        console.error(`Error creating transaction ${i+1}:`, createError);
      }
    }
    
    console.log(`Successfully created ${createdTransactions.length} transactions!`);
    
    // Display summary
    console.log('\nTransaction Summary:');
    createdTransactions.forEach((t, index) => {
      console.log(`${index + 1}. ${t.produk} - ${t.customer.nama} - Rp ${t.hargaJual.toLocaleString()} (${t.metode}) - ${t.tanggal.toLocaleDateString()}`);
    });
    
  } catch (error) {
    console.error('Error creating dummy transactions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
createDummyTransactions(); 