import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
const prisma = new PrismaClient();
async function main() {
  const adminEmail = 'admin@example.com';
  const exists = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!exists) {
    await prisma.user.create({
      data: { email: adminEmail, password: await argon2.hash('admin12345'), role: 'ADMIN' },
    });
    console.log('✅ Seed: usuário admin criado:', adminEmail);
  } else {
    console.log('ℹ️ Seed: usuário admin já existe.');
  }
}
main().then(() => prisma.$disconnect()).catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
