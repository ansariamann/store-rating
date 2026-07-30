import prisma from './db';
import bcrypt from 'bcryptjs';

async function main() {
  const hashedPassword = await bcrypt.hash('Admin123!', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@system.com' },
    update: {},
    create: {
      name: 'System Administrator (Initial)',
      email: 'admin@system.com',
      password: hashedPassword,
      address: 'Admin Headquarters',
      role: 'SYSTEM_ADMIN'
    }
  });

  console.log('✅ Default System Admin created!');
  console.log('Email: admin@system.com');
  console.log('Password: Admin123!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
