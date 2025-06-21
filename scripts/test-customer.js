const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testCustomer() {
  try {
    console.log('Testing customer functionality...');
    
    // Get all users
    const users = await prisma.user.findMany();
    console.log('Users found:', users.length);
    
    if (users.length === 0) {
      console.log('No users found. Please create a user first.');
      return;
    }
    
    const userId = users[0].id;
    console.log('Using user ID:', userId);
    
    // Get all customers for this user
    const customers = await prisma.customer.findMany({
      where: { userId: userId }
    });
    
    console.log('Customers found:', customers.length);
    customers.forEach(customer => {
      console.log(`- ID: ${customer.id}, Name: ${customer.nama}, User ID: ${customer.userId}`);
    });
    
    // Add a test customer if none exist
    if (customers.length === 0) {
      console.log('Adding test customer...');
      const newCustomer = await prisma.customer.create({
        data: {
          nama: 'Test Customer',
          userId: userId
        }
      });
      console.log('Test customer created:', newCustomer);
    }
    
    // Get transactions
    const transactions = await prisma.transaksi.findMany({
      where: { userId: userId },
      include: { customer: true }
    });
    
    console.log('Transactions found:', transactions.length);
    transactions.forEach(trans => {
      console.log(`- ID: ${trans.id}, Product: ${trans.produk}, Customer: ${trans.customer?.nama || 'No customer'}`);
    });
    
  } catch (error) {
    console.error('Error testing customer:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCustomer(); 