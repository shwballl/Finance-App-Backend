import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionType } from '../../generated/prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  findAll(type?: TransactionType) {
    return this.prisma.category.findMany({ where: { type } });
  }

  create(data: { name: string; type: TransactionType; icon?: string }) {
    return this.prisma.category.create({ data });
  }
}
