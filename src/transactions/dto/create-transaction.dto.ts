import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
} from 'class-validator';
import { TransactionType } from '../../../generated/prisma/client';

export class CreateTransactionDto {
  @IsNumber()
  amount: number;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsString()
  accountId: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  date?: string;
}
