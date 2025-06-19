const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    // Check if default user exists
    const defaultUser = await prisma.user.findFirst({
      where: {
        email: 'default@example.com',
      },
    });

    if (!defaultUser) {
      // Create default user
      await prisma.user.create({
        data: {
          email: 'default@example.com',
          name: 'Default User',
        },
      });
      console.log('Default user created successfully');
    } else {
      console.log('Default user already exists');
    }
  } catch (error) {
    console.error('Error creating default user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 