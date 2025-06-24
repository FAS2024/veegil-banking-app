import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from './transaction.schema';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { TransactionType } from './transaction-type.enum';
import { User } from '../user/user.schema';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel('Transaction') private readonly transactionModel: Model<Transaction>,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  async createTransaction(
    userId: string,
    input: CreateTransactionInput,
  ): Promise<Transaction> {
    const user = await this.userModel.findById(userId); 

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (input.amount <= 0) {
      throw new BadRequestException('Amount must be positive');
    }

    if (input.type === TransactionType.WITHDRAW) {
      if (user.withdrawalLimit && input.amount > user.withdrawalLimit) {
        throw new BadRequestException('Withdrawal exceeds limit');
      }
      if (input.amount > user.balance) {
        throw new BadRequestException('Insufficient balance');
      }

      // Deduct balance
      user.balance -= input.amount;
    }

    if (input.type === TransactionType.DEPOSIT) {
      // Add to balance
      user.balance += input.amount;
    }

    // Save updated user balance
    await user.save();

    input.amount = Math.round(input.amount * 100) / 100;
    
    // 💾 Save transaction
    const transaction = new this.transactionModel({
      ...input,
      userId,
    });

    return await transaction.save();
  }

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    if (!userId) {
      return [];
    }

    return this.transactionModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();
  }
}
