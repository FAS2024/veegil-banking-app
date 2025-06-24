import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

type JwtPayload = {
  sub?: string;
  phoneNumber?: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  public secretOrKey: string; // expose for testing

  constructor(private readonly configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET') || 'default_secret';

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });

    this.secretOrKey = secret; // assign for test access
  }

  async validate(payload: JwtPayload | null | undefined) {
    if (!payload || typeof payload !== 'object') {
      return {
        _id: undefined,
        phoneNumber: undefined,
      };
    }

    const { sub, phoneNumber } = payload;

    return {
      _id: sub,
      phoneNumber,
    };
  }
}
