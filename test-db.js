const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('Database connected successfully');
    
    // Check if there are any users
    const users = await prisma.user.findMany();
    console.log('Users found:', users.length);
    
    if (users.length === 0) {
      console.log('No users found. Creating test user...');
      const testUser = await prisma.user.create({
        data: {
          email: 'test@example.com',
          name: 'Test User',
          password: '$2a$10$test' // dummy password hash
        }
      });
      console.log('Test user created:', testUser.id);
    }
    
    // Check if there are any customers
    const customers = await prisma.customer.findMany();
    console.log('Customers found:', customers.length);
    
    if (customers.length === 0) {
      console.log('No customers found. Creating test customer...');
      const testCustomer = await prisma.customer.create({
        data: {
          nama: 'Test Customer',
          userId: users[0]?.id || 1
        }
      });
      console.log('Test customer created:', testCustomer.id);
    }
    
    // List all customers
    const allCustomers = await prisma.customer.findMany({
      include: {
        User: true
      }
    });
    console.log('All customers:', allCustomers);
    
  } catch (error) {
    console.error('Database test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase(); 