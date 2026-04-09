import { InputType, Field, Float } from '@nestjs/graphql';
import { IsEnum, IsNumber, Min } from 'class-validator';
import { TransactionType } from '../transaction-type.enum';

@InputType()
export class CreateTransactionInput {
  @Field(() => Float)
  @IsNumber()
  @Min(0.01, { message: 'Amount must be greater than 0' }) // Enforces positive amount
  amount!: number; // <-- Add "!"

  @Field(() => TransactionType)
  @IsEnum(TransactionType, { message: 'Invalid transaction type' })
  type!: TransactionType; //
}
