import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.account.findMany();
  }

  create(data: { name: string; currency?: string }) {
    return this.prisma.account.create({ data });
  }
}
