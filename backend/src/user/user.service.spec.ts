import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/create-user.input';
import { LoginUserInput } from './dto/login-user.input';
import { LoginResponse } from './dto/loginResponse.dto';
import { User } from './user.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

// Mock bcryptjs module once here
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

type JwtPayload = {
  sub: string;
  phoneNumber: string;
};

describe('UserResolver & UserService', () => {
  let resolver: UserResolver;
  let service: UserService;

  let mockUserModel: jest.Mock & {
    findOne: jest.Mock;
    findById: jest.Mock;
  };
  let jwtService: jest.Mocked<JwtService>;

  const existingUser = {
    _id: 'existsId',
    fullName: 'Existing User',
    phoneNumber: '08012345678',
    password: 'hashedPass',
    balance: 0,
    toObject: () => ({
      _id: 'existsId',
      fullName: 'Existing User',
      phoneNumber: '08012345678',
      balance: 0,
    }),
  };

  beforeEach(async () => {
    mockUserModel = jest.fn().mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(undefined),
    })) as any;
    mockUserModel.findOne = jest.fn();
    mockUserModel.findById = jest.fn();

    jwtService = {
      sign: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        UserService,
        {
          provide: 'UserModel',
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    service = module.get<UserService>(UserService);

    jest.clearAllMocks();
  });

  // --- UserResolver Tests ---
  describe('UserResolver', () => {
    it('should be defined', () => {
      expect(resolver).toBeDefined();
    });

    it('sayHello returns greeting string', () => {
      expect(resolver.sayHello()).toBe('Hello from GraphQL!');
    });

    it('signup calls service and returns success message', async () => {
      const input: CreateUserInput = {
        fullName: 'Test User',
        phoneNumber: '08012345678',
        password: 'test123',
      };

      jest.spyOn(service, 'signup').mockResolvedValue({
        token: 'jwt-token',
        user: {
          _id: 'userId',
          fullName: input.fullName,
          phoneNumber: input.phoneNumber,
          balance: 0,
        } as User,
      });

      const result = await resolver.signup(input);

      expect(service.signup).toHaveBeenCalledWith(input);
      expect(result).toEqual({
        token: 'jwt-token',
        user: {
          _id: 'userId',
          balance: 0,
          fullName: 'Test User',
          phoneNumber: '08012345678',
        },
      });
    });

    it('signup throws ConflictException when user exists', async () => {
      jest
        .spyOn(service, 'signup')
        .mockRejectedValue(new ConflictException('User already exists'));
      const input: CreateUserInput = {
        fullName: 'Test User',
        phoneNumber: '08012345678',
        password: 'test123',
      };

      await expect(resolver.signup(input)).rejects.toThrow(ConflictException);
    });

    it('login calls service and returns token & user', async () => {
      const input: LoginUserInput = {
        phoneNumber: '08012345678',
        password: 'test123',
      };

      const loginResponse: LoginResponse = {
        token: 'mockedToken',
        user: {
          _id: 'abc123',
          fullName: 'Test User',
          phoneNumber: '08012345678',
          password: '',
          balance: 0,
        } as User,
      };

      jest.spyOn(service, 'login').mockResolvedValue(loginResponse);

      const result = await resolver.login(input);

      expect(service.login).toHaveBeenCalledWith(
        input.phoneNumber,
        input.password,
      );
      expect(result).toEqual(loginResponse);
    });

    it('login throws UnauthorizedException on invalid credentials', async () => {
      jest
        .spyOn(service, 'login')
        .mockRejectedValue(new UnauthorizedException('Invalid credentials'));
      const input: LoginUserInput = {
        phoneNumber: '08012345678',
        password: 'wrongPass',
      };

      await expect(resolver.login(input)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  // --- UserService Tests ---
  describe('UserService', () => {
    it('signup creates user and returns LoginResponse', async () => {
      const input: CreateUserInput = {
        fullName: 'New User',
        phoneNumber: '08099998888',
        password: 'password123',
      };

      // Mock bcrypt.hash using the mocked module
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      mockUserModel.findOne.mockResolvedValue(null);

      const saveMock = jest.fn().mockResolvedValue(undefined);
      const userInstance = {
        ...input,
        password: 'hashedPassword',
        _id: 'newUserId',
        save: saveMock,
        toObject: () => ({
          _id: 'newUserId',
          fullName: input.fullName,
          phoneNumber: input.phoneNumber,
          balance: 0,
        }),
      };

      mockUserModel.mockImplementation(() => userInstance);

      jwtService.sign.mockReturnValue('signed-token');

      const result = await service.signup(input);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        phoneNumber: input.phoneNumber,
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(input.password, 10);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 'newUserId',
        phoneNumber: input.phoneNumber,
      });
      expect(result).toMatchObject({
        token: 'signed-token',
        user: expect.objectContaining({
          _id: 'newUserId',
          fullName: input.fullName,
          phoneNumber: input.phoneNumber,
        }),
      });
    });

    it('signup throws ConflictException if user already exists', async () => {
      mockUserModel.findOne.mockResolvedValue(existingUser);

      await expect(
        service.signup({
          fullName: 'Existing User',
          phoneNumber: existingUser.phoneNumber,
          password: 'password123',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('login returns LoginResponse on success', async () => {
      mockUserModel.findOne.mockReturnValue({
        lean: jest.fn().mockResolvedValue(existingUser),
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      jwtService.sign.mockReturnValue('signed-token');

      const result = await service.login(
        existingUser.phoneNumber,
        'password123',
      );

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        phoneNumber: existingUser.phoneNumber,
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'password123',
        existingUser.password,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: existingUser._id,
        phoneNumber: existingUser.phoneNumber,
      });
      expect(result.token).toBe('signed-token');
      expect(result.user.phoneNumber).toBe(existingUser.phoneNumber);
    });

    it('login throws NotFoundException if user not found', async () => {
      mockUserModel.findOne.mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      await expect(service.login('nonexistent', 'password')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('login throws UnauthorizedException if password invalid', async () => {
      mockUserModel.findOne.mockReturnValue({
        lean: jest.fn().mockResolvedValue(existingUser),
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login(existingUser.phoneNumber, 'wrongPass'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('login throws UnauthorizedException if bcrypt.compare fails', async () => {
      mockUserModel.findOne.mockReturnValue({
        lean: jest.fn().mockResolvedValue(existingUser),
      });

      (bcrypt.compare as jest.Mock).mockImplementation(() => {
        throw new Error('Compare error');
      });

      await expect(
        service.login(existingUser.phoneNumber, 'password'),
      ).rejects.toThrow(UnauthorizedException);
      await expect(
        service.login(existingUser.phoneNumber, 'password'),
      ).rejects.toThrow('Invalid credentials');
    });

    it('findById returns user without password', async () => {
      mockUserModel.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue(existingUser),
      });

      const result = await service.findById(existingUser._id);

      expect(mockUserModel.findById).toHaveBeenCalledWith(existingUser._id);
      expect(result._id).toBe(existingUser._id);
      expect((result as any).password).toBeUndefined();
    });

    it('findById throws NotFoundException if user not found', async () => {
      mockUserModel.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findById('wrong-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('findById throws error if model throws unexpected error', async () => {
      mockUserModel.findById.mockReturnValue({
        lean: jest.fn().mockRejectedValue(new Error('Unexpected error')),
      });

      await expect(service.findById(existingUser._id)).rejects.toThrow(
        'Unexpected error',
      );
    });

    it('signup throws error if bcrypt.hash fails', async () => {
      (bcrypt.hash as jest.Mock).mockRejectedValue(new Error('Hash error'));

      mockUserModel.findOne.mockResolvedValue(null);

      await expect(
        service.signup({
          fullName: 'User',
          phoneNumber: '08011112222',
          password: 'password',
        }),
      ).rejects.toThrow('Hash error');
    });

    it('signup throws error if saving user fails', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      mockUserModel.findOne.mockResolvedValue(null);

      const saveMock = jest.fn().mockRejectedValue(new Error('Save error'));
      const userInstance = {
        ...existingUser,
        password: 'hashedPassword',
        save: saveMock,
        toObject: jest.fn(),
      };
      mockUserModel.mockImplementation(() => userInstance);

      await expect(
        service.signup({
          fullName: 'User',
          phoneNumber: '08011112222',
          password: 'password',
        }),
      ).rejects.toThrow('Save error');
    });

    it('signup trims phoneNumber and fullName before saving', async () => {
      const input: CreateUserInput = {
        fullName: '  Trim Name  ',
        phoneNumber: '  08055555555  ',
        password: 'password123',
      };

      const trimmedUser = {
        ...input,
        fullName: input.fullName.trim(),
        phoneNumber: input.phoneNumber.trim(),
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      mockUserModel.findOne.mockResolvedValue(null);

      const saveMock = jest.fn().mockResolvedValue(undefined);
      const userInstance = {
        ...trimmedUser,
        password: 'hashedPassword',
        _id: 'trimmedId',
        save: saveMock,
        toObject: () => ({
          _id: 'trimmedId',
          fullName: trimmedUser.fullName,
          phoneNumber: trimmedUser.phoneNumber,
          balance: 0,
        }),
      };
      mockUserModel.mockImplementation(() => userInstance);

      jwtService.sign.mockReturnValue('signed-token');

      const result = await service.signup(input);

      expect(result.user.fullName).toBe(trimmedUser.fullName);
      expect(result.user.phoneNumber).toBe(trimmedUser.phoneNumber);
    });
  });
});
