// Script to create more test data for the first test user
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting test data creation for first test user...');
    
    // Get the first test user
    let user = await prisma.user.findUnique({
      where: {
        email: 'test@example.com',
      },
    });

    if (!user) {
      console.log('First test user not found. Please run scripts/create-test-user.js first.');
      return;
    }
    
    console.log('Using existing test user:', user.id, user.name, user.email);
    console.log('Creating customer...');
    
    // Create a customer for this user
    const customer = await prisma.customer.create({
      data: {
        nama: `Test User Customer ${new Date().toISOString()}`,
        userId: user.id,
      },
    });

    console.log('Created test customer:', customer.id);
    console.log('Creating transaction...');

    // Create a transaction for this user with different values than the second user
    const transaction = await prisma.transaksi.create({
      data: {
        customerId: customer.id,
        produk: `Test User Unique Product ${new Date().toISOString()}`,
        hargaAsli: 10000, // different price than second user
        hargaJual: 15000, // different price than second user
        tanggal: new Date(),
        metode: 'Transfer', // different payment method than second user
        tujuan: 'Test User Only',
        tag: 'Test',
        userId: user.id,
      },
    });

    console.log('Created test transaction:', transaction.id);
    console.log('Test data creation completed successfully!');
    
  } catch (error) {
    console.error('Error creating test data:', error);
    // Log the full error stack
    console.error(error.stack);
  } finally {
    await prisma.$disconnect();
    console.log('Disconnected from the database.');
  }
}

main(); 