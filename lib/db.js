import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Prisma client instance

export async function getAllTransaksi(userId) {
  return prisma.transaksi.findMany({
    where: userId ? { userId: parseInt(userId) } : undefined,
    include: { customer: true }
  });
}

export async function getTransaksiById(id, userId) {
  return prisma.transaksi.findFirst({
    where: { 
      id,
      ...(userId ? { userId: parseInt(userId) } : {})
    },
    include: { customer: true }
  });
}

export async function addTransaksi(data) {
  return prisma.transaksi.create({
    data: data,
    include: { customer: true }
  });
}

export async function updateTransaksi(id, data, userId) {
  return prisma.transaksi.update({
    where: { 
      id,
      ...(userId ? { userId: parseInt(userId) } : {})
    },
    data,
    include: { customer: true }
  });
}

export async function deleteTransaksi(id, userId) {
  return prisma.transaksi.delete({
    where: { 
      id,
      ...(userId ? { userId: parseInt(userId) } : {})
    }
  });
}

export async function getAllCustomers(userId) {
  return prisma.customer.findMany({
    where: userId ? { userId: parseInt(userId) } : undefined
  });
}

export async function getCustomerById(id, userId) {
  return prisma.customer.findFirst({
    where: { 
      id,
      ...(userId ? { userId: parseInt(userId) } : {})
    }
  });
}

export async function addCustomer(data, userId) {
  if (!userId) {
    throw new Error('User ID is required to add a customer');
  }
  
  return prisma.customer.create({
    data: {
      ...data,
      userId: parseInt(userId)
    }
  });
}

export async function updateCustomer(id, data, userId) {
  return prisma.customer.update({
    where: { 
      id,
      ...(userId ? { userId: parseInt(userId) } : {})
    },
    data
  });
}

export async function deleteCustomer(id, userId) {
  try {
    // First check if customer exists
    const customer = await prisma.customer.findFirst({
      where: { 
        id,
        ...(userId ? { userId: parseInt(userId) } : {})
      },
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
      where: { 
        id,
        ...(userId ? { userId: parseInt(userId) } : {})
      }
    });
  } catch (error) {
    console.error('Error in deleteCustomer:', error);
    throw error;
  }
} 