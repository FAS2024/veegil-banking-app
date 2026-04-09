import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GqlAuthGuard } from '../guards/gql-auth.guard';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let configService: ConfigService;

  beforeEach(() => {
    configService = {
      get: jest.fn((key: string) => {
        if (key === 'JWT_SECRET') return 'test_secret';
        return null;
      }),
    } as any;

    jwtStrategy = new JwtStrategy(configService);
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  it('should call ConfigService.get with "JWT_SECRET"', () => {
    expect(configService.get).toHaveBeenCalledWith('JWT_SECRET');
  });

  it('should fallback to default_secret when JWT_SECRET is falsy', () => {
    const fakeConfigService = {
      get: jest.fn(() => undefined),
    } as any;
    const strategy = new JwtStrategy(fakeConfigService);
    expect(fakeConfigService.get).toHaveBeenCalledWith('JWT_SECRET');
    // @ts-ignore
    expect(strategy.secretOrKey).toBe('default_secret');
  });

  describe('validate()', () => {
    it('should return user object with _id and phoneNumber from payload', async () => {
      const payload = {
        sub: '12345',
        phoneNumber: '+1234567890',
      };

      const result = await jwtStrategy.validate(payload);
      expect(result).toEqual({
        _id: '12345',
        phoneNumber: '+1234567890',
      });
    });

    it('should handle missing payload fields gracefully', async () => {
      const payload = {} as any;

      const result = await jwtStrategy.validate(payload);
      expect(result).toEqual({
        _id: undefined,
        phoneNumber: undefined,
      });
    });

    it('should handle null or undefined payload', async () => {
      // @ts-ignore
      await expect(jwtStrategy.validate(null)).resolves.toEqual({
        _id: undefined,
        phoneNumber: undefined,
      });

      // @ts-ignore
      await expect(jwtStrategy.validate(undefined)).resolves.toEqual({
        _id: undefined,
        phoneNumber: undefined,
      });
    });

    // Extended tests

    it('should use fallback secret if JWT_SECRET is falsy in constructor', () => {
      const fakeConfig = { get: jest.fn(() => '') } as any;
      const strategy = new JwtStrategy(fakeConfig);
      // @ts-ignore
      expect(strategy.secretOrKey).toBe('default_secret');
    });

    it('validate should return user even if payload has extra fields', async () => {
      const payload = {
        sub: 'id123',
        phoneNumber: '08012345678',
        role: 'admin',
        iat: 1234567890,
      };
      const result = await jwtStrategy.validate(payload);
      expect(result).toEqual({
        _id: 'id123',
        phoneNumber: '08012345678',
      });
    });

    it('validate returns undefined properties if passed non-object payload', async () => {
      // @ts-ignore
      const result = await jwtStrategy.validate(null);
      expect(result).toEqual({ _id: undefined, phoneNumber: undefined });

      // @ts-ignore
      const result2 = await jwtStrategy.validate(42);
      expect(result2).toEqual({ _id: undefined, phoneNumber: undefined });
    });

    it('validate maps non-standard payload fields correctly', async () => {
      const payload = {
        sub: 'abc',
        phoneNumber: '12345',
        email: 'test@example.com', // extra fields should be ignored
      };

      const result = await jwtStrategy.validate(payload);
      expect(result).toEqual({ _id: 'abc', phoneNumber: '12345' });
    });
  });
});

// ------------------- Simple test for GqlAuthGuard -------------------

describe('GqlAuthGuard', () => {
  let guard: GqlAuthGuard;

  beforeEach(() => {
    guard = new GqlAuthGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('getRequest should extract request from GraphQL context', () => {
    const mockReq = { user: { id: '1' } };
    const mockContext = {
      getContext: () => ({ req: mockReq }),
    };

    const mockExecutionContext = {} as unknown as ExecutionContext;

    const gqlCreateSpy = jest
      .spyOn(GqlExecutionContext, 'create')
      .mockReturnValue(mockContext as any);

    const req = guard.getRequest(mockExecutionContext);
    expect(req).toBe(mockReq);

    gqlCreateSpy.mockRestore();
  });

  // Extended tests for GqlAuthGuard

  it('should call super.canActivate and respect its result (true)', async () => {
    const canActivateSpy = jest
      .spyOn(GqlAuthGuard.prototype as any, 'canActivate')
      .mockResolvedValue(true);

    const context = {} as ExecutionContext;
    const result = await guard.canActivate(context);

    expect(canActivateSpy).toHaveBeenCalled();
    expect(result).toBe(true);

    canActivateSpy.mockRestore();
  });

  it('should call super.canActivate and respect its result (false)', async () => {
    const canActivateSpy = jest
      .spyOn(GqlAuthGuard.prototype as any, 'canActivate')
      .mockResolvedValue(false);

    const context = {} as ExecutionContext;
    const result = await guard.canActivate(context);

    expect(canActivateSpy).toHaveBeenCalled();
    expect(result).toBe(false);

    canActivateSpy.mockRestore();
  });

  it('should throw if super.canActivate throws', async () => {
    const error = new Error('Auth error');
    const canActivateSpy = jest
      .spyOn(GqlAuthGuard.prototype as any, 'canActivate')
      .mockRejectedValue(error);

    const context = {} as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrow('Auth error');

    canActivateSpy.mockRestore();
  });

  it('getRequest returns undefined if GqlExecutionContext.create returns null', () => {
    jest.spyOn(GqlExecutionContext, 'create').mockReturnValue(null as any);

    const context = {} as ExecutionContext;
    const req = guard.getRequest(context);
    expect(req).toBeUndefined();
  });

  it('getRequest throws if GqlExecutionContext.create throws', () => {
    jest.spyOn(GqlExecutionContext, 'create').mockImplementation(() => {
      throw new Error('Failed to create context');
    });

    const context = {} as ExecutionContext;
    expect(() => guard.getRequest(context)).toThrow('Failed to create context');
  });
});
