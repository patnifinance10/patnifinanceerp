const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "mongodb://localhost:27017/loanerp?directConnection=true&retryWrites=false",
    },
  },
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  console.log('Testing connection...');
  try {
    const count = await prisma.user.count();
    console.log('User count:', count);

    const role = await prisma.role.create({
      data: {
        name: 'test_role_' + Date.now(),
        permissions: ['test'],
      }
    });
    console.log('Role created:', role);

  } catch (e) {
    console.error('Connection failed:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
