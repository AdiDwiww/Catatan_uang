import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get default user ID for customer operations
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

export async function getAllTransaksi() {
  return prisma.transaksi.findMany({
    include: { customer: true }
  });
}

export async function getTransaksiById(id) {
  return prisma.transaksi.findUnique({
    where: { id },
    include: { customer: true }
  });
}

export async function addTransaksi(data) {
  return prisma.transaksi.create({
    data,
    include: { customer: true }
  });
}

export async function updateTransaksi(id, data) {
  return prisma.transaksi.update({
    where: { id },
    data,
    include: { customer: true }
  });
}

export async function deleteTransaksi(id) {
  return prisma.transaksi.delete({
    where: { id }
  });
}

export async function getAllCustomers() {
  return prisma.customer.findMany();
}

export async function getCustomerById(id) {
  return prisma.customer.findUnique({
    where: { id }
  });
}

export async function addCustomer(data) {
  // Get default user ID and add it to customer data
  const userId = await getDefaultUserId();
  
  return prisma.customer.create({
    data: {
      ...data,
      userId
    }
  });
}

export async function updateCustomer(id, data) {
  return prisma.customer.update({
    where: { id },
    data
  });
}

export async function deleteCustomer(id) {
  try {
    // First check if customer exists
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: { transaksi: true }
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    // Check if customer has any transactions
    if (customer.transaksi.length > 0) {
      throw new Error('Cannot delete customer with existing transactions');
    }

    // Delete the customer
    return await prisma.customer.delete({
      where: { id }
    });
  } catch (error) {
    console.error('Error in deleteCustomer:', error);
    throw error;
  }
} 