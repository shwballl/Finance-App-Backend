import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Query,
  Param,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private service: TransactionsService) {}

  @Post()
  create(@Body() dto: CreateTransactionDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() query: { from?: string; to?: string; categoryId?: string }) {
    return this.service.findAll(query);
  }

  @Get('stats')
  stats(@Query('from') from: string, @Query('to') to: string) {
    return this.service.stats(from, to);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
