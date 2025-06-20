// Script to list all users in the database
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Listing all users in the database...');
    
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        _count: {
          select: { 
            Customer: true,
            transaksi: true 
          }
        }
      },
    });

    console.log('Found', users.length, 'users:');
    users.forEach(user => {
      console.log(`- ID: ${user.id}, Name: ${user.name}, Email: ${user.email}`);
      console.log(`  Customers: ${user._count.Customer}, Transactions: ${user._count.transaksi}`);
    });
    
  } catch (error) {
    console.error('Error listing users:', error);
  } finally {
    await prisma.$disconnect();
    console.log('Disconnected from the database.');
  }
}

main(); 