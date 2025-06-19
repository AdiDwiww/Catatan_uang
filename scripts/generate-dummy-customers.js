const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// List of dummy customer names
const customerNames = [
  'Budi Santoso',
  'Siti Rahayu',
  'Ahmad Dahlan',
  'Dewi Kartika',
  'Joko Widodo',
  'Ratna Sari',
  'Hendra Wijaya',
  'Maya Indah',
  'Rizki Pratama',
  'Lina Putri',
  'Andi Hermawan',
  'Dian Permata',
  'Fandi Ahmad',
  'Rina Wijaya',
  'Agus Setiawan'
];

// Function to get default user ID
async function getDefaultUserId() {
  try {
    const defaultUser = await prisma.user.findFirst({
      where: {
        email: 'default@example.com',
      },
    });
    
    if (defaultUser) {
      return defaultUser.id;
    }
    
    // Create default user if it doesn't exist
    const newUser = await prisma.user.create({
      data: {
        email: 'default@example.com',
        name: 'Default User',
      },
    });
    
    return newUser.id;
  } catch (error) {
    console.error('Error getting default user:', error);
    throw error;
  }
}

// Function to create dummy customers
async function createDummyCustomers() {
  try {
    // Get existing customers count
    const existingCustomers = await prisma.customer.findMany();
    console.log(`Found ${existingCustomers.length} existing customers.`);
    
    // Only create customers if there are fewer than 5
    if (existingCustomers.length >= 5) {
      console.log('You already have 5 or more customers. No need to create dummy customers.');
      return;
    }
    
    // Get default user ID
    const userId = await getDefaultUserId();
    console.log(`Using userId: ${userId}`);
    
    // Number of customers to create
    const customersToCreate = 10;
    
    // Prepare customer data
    const customerData = customerNames.slice(0, customersToCreate).map(name => ({
      nama: name,
      userId: userId
    }));
    
    // Create customers
    const result = await prisma.customer.createMany({
      data: customerData,
      skipDuplicates: false
    });
    
    console.log(`Successfully created ${result.count} dummy customers!`);
    
  } catch (error) {
    console.error('Error creating dummy customers:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
createDummyCustomers(); 