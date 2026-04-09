import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { getModelToken } from '@nestjs/mongoose';
import { TransactionType } from './transaction-type.enum';
import { NotFoundException, BadRequestException } from '@nestjs/common';

// Utility for mocking a user document
const makeMockUser = (overrides = {}) => ({
  _id: 'someUserId',
  balance: 0,
  withdrawalLimit: 500,
  save: jest.fn().mockResolvedValue(true),
  ...overrides,
});

describe('TransactionService', () => {
  let service: TransactionService;
  let userModel: any;
  let transactionModel: any;
  let saveMock: jest.Mock;

  beforeEach(async () => {
    userModel = {
      findById: jest.fn(),
    };

    // Use arrow function here to keep lexical this
    saveMock = jest.fn().mockImplementation(() => {
      // 'this' refers to the object bound, so just use function argument workaround
      // Since arrow function doesn't bind its own 'this', use this trick:
      // saveMock.bind will set this to input object
      // But here we can't use 'this' because arrow functions don't have their own this.
      // So workaround: use saved input via bind context

      // Actually jest.fn().mockImplementation(function() { ... }) works but needs explicit typing
      // For simplicity, use regular function with typed this:

      throw new Error('saveMock must be implemented properly');
    });

    // To fix 'this' implicit any, explicitly type function:
    saveMock = jest.fn().mockImplementation(function (this: any) {
      return Promise.resolve({
        _id: 'txnId',
        amount: this.amount,
        type: this.type,
        userId: this.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    transactionModel = jest.fn().mockImplementation(function (input) {
      return {
        ...input,
        save: saveMock.bind(input),
      };
    });

    transactionModel.find = jest.fn().mockReturnThis();
    transactionModel.sort = jest.fn().mockReturnThis();
    transactionModel.exec = jest.fn().mockResolvedValue([
      {
        _id: 'txnId',
        amount: 100,
        type: TransactionType.DEPOSIT,
        userId: 'someUserId',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        { provide: getModelToken('Transaction'), useValue: transactionModel },
        { provide: getModelToken('User'), useValue: userModel },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTransaction', () => {
    it('creates a transaction for valid user and amount', async () => {
      userModel.findById.mockResolvedValue(makeMockUser());

      const input = { amount: 100, type: TransactionType.DEPOSIT };
      const result = await service.createTransaction('someUserId', input);

      expect(userModel.findById).toHaveBeenCalledWith('someUserId');
      expect(result).toHaveProperty('_id', 'txnId');
      expect(result.amount).toBe(100);
    });

    it('throws NotFoundException if user does not exist', async () => {
      userModel.findById.mockResolvedValue(null);

      await expect(
        service.createTransaction('invalidUserId', {
          amount: 100,
          type: TransactionType.DEPOSIT,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws BadRequestException if amount is zero or negative', async () => {
      userModel.findById.mockResolvedValue(makeMockUser());

      await expect(
        service.createTransaction('someUserId', {
          amount: 0,
          type: TransactionType.DEPOSIT,
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        service.createTransaction('someUserId', {
          amount: -10,
          type: TransactionType.DEPOSIT,
        }),
      ).rejects.toThrow('Amount must be positive');
    });

    it('throws if transaction save fails', async () => {
      userModel.findById.mockResolvedValue(
        makeMockUser({
          save: jest.fn(() => {
            throw new Error('DB error');
          }),
        }),
      );

      await expect(
        service.createTransaction('someUserId', {
          amount: 100,
          type: TransactionType.DEPOSIT,
        }),
      ).rejects.toThrow('DB error');
    });

    it('throws if withdrawal exceeds withdrawal limit', async () => {
      userModel.findById.mockResolvedValue(
        makeMockUser({ withdrawalLimit: 100, balance: 200 }),
      );

      await expect(
        service.createTransaction('someUserId', {
          amount: 150,
          type: TransactionType.WITHDRAW,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws if withdrawal exceeds balance', async () => {
      userModel.findById.mockResolvedValue(
        makeMockUser({ withdrawalLimit: 200, balance: 100 }),
      );

      await expect(
        service.createTransaction('someUserId', {
          amount: 200,
          type: TransactionType.WITHDRAW,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws for invalid transaction type', async () => {
      userModel.findById.mockResolvedValue(makeMockUser());

      await expect(
        service.createTransaction('someUserId', {
          amount: 50,
          // @ts-ignore
          type: 'INVALID_TYPE',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('handles very large transaction amounts', async () => {
      const largeAmount = Number.MAX_SAFE_INTEGER;
      userModel.findById.mockResolvedValue(makeMockUser());

      const result = await service.createTransaction('someUserId', {
        amount: largeAmount,
        type: TransactionType.DEPOSIT,
      });

      expect(result.amount).toBe(largeAmount);
    });

    it('calls save once when creating a transaction', async () => {
      const mockUser = makeMockUser();
      userModel.findById.mockResolvedValue(mockUser);

      await service.createTransaction('someUserId', {
        amount: 50,
        type: TransactionType.DEPOSIT,
      });

      expect(mockUser.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUserTransactions', () => {
    it('returns transactions sorted by createdAt descending', async () => {
      const result = await service.getUserTransactions('someUserId');

      expect(transactionModel.find).toHaveBeenCalledWith({
        userId: 'someUserId',
      });
      expect(transactionModel.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(transactionModel.exec).toHaveBeenCalled();
      expect(Array.isArray(result)).toBe(true);
    });

    it('returns empty array if no transactions found', async () => {
      transactionModel.exec.mockResolvedValueOnce([]);
      const result = await service.getUserTransactions('someUserId');
      expect(result).toEqual([]);
    });

    it('handles invalid user ID in getUserTransactions', async () => {
      transactionModel.exec.mockResolvedValueOnce([]);
      const result = await service.getUserTransactions('');
      expect(result).toEqual([]);
    });

    it('throws for invalid transaction type', async () => {
      userModel.findById.mockResolvedValue(makeMockUser());

      await expect(
        service.createTransaction('someUserId', {
          amount: 50,
          // @ts-ignore
          type: 'INVALID_TYPE',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
