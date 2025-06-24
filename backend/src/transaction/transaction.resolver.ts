import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { Transaction } from './transaction.schema';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/user.schema';

@Resolver(() => Transaction)
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Mutation(() => Transaction)
  @UseGuards(GqlAuthGuard)
  createTransaction(
    @Args('input') input: CreateTransactionInput,
    @CurrentUser() user: User,
  ) {
    return this.transactionService.createTransaction(user._id, input);
  }

  @Query(() => [Transaction])
  @UseGuards(GqlAuthGuard)
  getMyTransactions(@CurrentUser() user: User) {
    return this.transactionService.getUserTransactions(user._id);
  }
}
