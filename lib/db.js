import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
  return prisma.customer.create({
    data
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