import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.account.create({ data: { name: 'Основная карта' } });
  await prisma.category.createMany({
    data: [
      { name: 'Продукты', type: 'EXPENSE', icon: '🛒' },
      { name: 'Транспорт', type: 'EXPENSE', icon: '🚕' },
      { name: 'Кафе', type: 'EXPENSE', icon: '☕️' },
      { name: 'Развлечения', type: 'EXPENSE', icon: '🎮' },
      { name: 'Зарплата', type: 'INCOME', icon: '💼' },
      { name: 'Перевод', type: 'INCOME', icon: '💸' },
    ],
  });
}

main().finally(() => prisma.$disconnect());
