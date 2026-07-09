import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTransactionDto) {
    const account = await this.prisma.account.findUnique({
      where: { id: dto.accountId },
    });
    if (!account) throw new NotFoundException('Счёт не найден');

    const delta = dto.type === 'EXPENSE' ? -dto.amount : dto.amount;

    const [transaction] = await this.prisma.$transaction([
      this.prisma.transaction.create({
        data: { ...dto, date: dto.date ?? new Date() },
      }),
      this.prisma.account.update({
        where: { id: dto.accountId },
        data: { balance: { increment: delta } },
      }),
    ]);

    return transaction;
  }

  async findAll(query: { from?: string; to?: string; categoryId?: string }) {
    return this.prisma.transaction.findMany({
      where: {
        categoryId: query.categoryId,
        date: {
          gte: query.from ? new Date(query.from) : undefined,
          lte: query.to ? new Date(query.to) : undefined,
        },
      },
      include: { category: true, account: true },
      orderBy: { date: 'desc' },
    });
  }

  async remove(id: string) {
    const t = await this.prisma.transaction.findUnique({ where: { id } });
    if (!t) throw new NotFoundException();

    const delta = t.type === 'EXPENSE' ? Number(t.amount) : -Number(t.amount);

    await this.prisma.$transaction([
      this.prisma.transaction.delete({ where: { id } }),
      this.prisma.account.update({
        where: { id: t.accountId },
        data: { balance: { increment: delta } },
      }),
    ]);
  }

  async stats(from: string, to: string) {
    const transactions = await this.prisma.transaction.findMany({
      where: { date: { gte: new Date(from), lte: new Date(to) } },
      include: { category: true },
    });

    const byCategory = new Map<
      string,
      { name: string; icon: string; total: number }
    >();
    let totalExpense = 0;
    let totalIncome = 0;

    for (const t of transactions) {
      const amount = Number(t.amount);
      if (t.type === 'EXPENSE') {
        totalExpense += amount;
        const key = t.category?.id ?? 'other';
        const existing = byCategory.get(key) ?? {
          name: t.category?.name ?? 'Без категории',
          icon: t.category?.icon ?? '❓',
          total: 0,
        };
        existing.total += amount;
        byCategory.set(key, existing);
      } else if (t.type === 'INCOME') {
        totalIncome += amount;
      }
    }

    return {
      totalExpense,
      totalIncome,
      balance: totalIncome - totalExpense,
      byCategory: Array.from(byCategory.values()).sort(
        (a, b) => b.total - a.total,
      ),
    };
  }
}
