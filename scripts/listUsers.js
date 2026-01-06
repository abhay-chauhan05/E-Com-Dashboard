const { PrismaClient } = require('@prisma/client');
(async()=>{
  const p = new PrismaClient();
  const users = await p.user.findMany();
  console.log(users);
  await p.$disconnect();
})().catch(e=>{console.error(e);process.exit(1)});
