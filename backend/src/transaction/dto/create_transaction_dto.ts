import { IsNumber, IsEnum } from 'class-validator';
import { TransactionType } from '../schema/transaction_schema';

export class CreateTransactionDto {
  @IsNumber()
  amount: number;

  @IsEnum(TransactionType)
  type: TransactionType;
}
