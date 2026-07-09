import { Controller, Get, Post, Body } from '@nestjs/common';
import { AccountsService } from './accounts.service';

@Controller('accounts')
export class AccountsController {
  constructor(private service: AccountsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() body: { name: string; currency?: string }) {
    return this.service.create(body);
  }
}
