import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { TransactionType } from '../../generated/prisma/client';

@Controller('categories')
export class CategoriesController {
  constructor(private service: CategoriesService) {}

  @Get()
  findAll(@Query('type') type?: TransactionType) {
    return this.service.findAll(type);
  }

  @Post()
  create(@Body() body: { name: string; type: TransactionType; icon?: string }) {
    return this.service.create(body);
  }
}
