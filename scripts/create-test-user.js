// Script to create a second test user for testing user data isolation
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting test data creation...');
    
    // Check if the user already exists or create a new one
    let user = await prisma.user.findUnique({
      where: {
        email: 'test2@example.com',
      },
    });

    if (!user) {
      // Hash the password
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      // Create the user
      user = await prisma.user.create({
        data: {
          name: 'Test User 2',
          email: 'test2@example.com',
          password: hashedPassword,
        },
      });
      console.log('Created test user 2:', user.id);
    } else {
      console.log('Using existing test user 2:', user.id);
    }

    console.log('Creating customer...');
    
    // Create a customer for this user
    const customer = await prisma.customer.create({
      data: {
        nama: `Test Customer for User 2 ${new Date().toISOString()}`,
        userId: user.id,
      },
    });

    console.log('Created test customer:', customer.id);
    console.log('Creating transaction...');

    // Create a transaction for this user
    const transaction = await prisma.transaksi.create({
      data: {
        customerId: customer.id,
        produk: `Test Product for User 2 ${new Date().toISOString()}`,
        hargaAsli: 50000,
        hargaJual: 75000,
        tanggal: new Date(),
        metode: 'Cash',
        tujuan: 'Test',
        tag: 'Test',
        userId: user.id,
      },
    });

    console.log('Created test transaction:', transaction.id);
    console.log('Test data creation completed successfully!');
    
  } catch (error) {
    console.error('Error creating test data:', error);
  } finally {
    await prisma.$disconnect();
    console.log('Disconnected from the database.');
  }
}

main(); 