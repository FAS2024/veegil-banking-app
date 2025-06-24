import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { UserService } from './src/user/user.service';
import { TransactionService } from './src/transaction/transaction.service';
import { CreateUserInput } from './src/user/dto/create-user.input';
import { TransactionType } from './src/transaction/transaction-type.enum';


async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userService = app.get(UserService);
  const transactionService = app.get(TransactionService);

  // Create demo users
  const users: CreateUserInput[] = [
    {
      fullName: 'Fatai Sunmonu',
      phoneNumber: '07011112222',
      password: 'testpass123',
    },
    {
      fullName: 'Jane Doe',
      phoneNumber: '07033334444',
      password: 'password321',
    },
  ];

  for (const user of users) {
    try {
      await userService.signup(user);
    } catch (e) {
      console.log(`User ${user.phoneNumber} already exists`);
    }
  }

  // Add transactions (example only)
  const demoUser = await userService.login('07011112222', 'testpass123');
  const userId = demoUser.user._id;

  await transactionService.createTransaction(userId, { amount: 1000, type: TransactionType.DEPOSIT });
  await transactionService.createTransaction(userId, { amount: 500, type: TransactionType.WITHDRAW });


  console.log('Database seeded successfully');
  await app.close();
}

bootstrap();
