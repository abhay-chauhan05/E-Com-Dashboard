const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

async function main() {
  const prisma = new PrismaClient();
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const plain = process.env.ADMIN_PASSWORD || 'AdminPass123!';
  const hashed = await bcrypt.hash(plain, 10);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('Admin user already exists:', existing.email);
    process.exit(0);
  }

  const user = await prisma.user.create({
    data: {
      name: 'Admin',
      email,
      password: hashed,
      role: 'admin'
    }
  });

  console.log('Created admin user:', user.email);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });