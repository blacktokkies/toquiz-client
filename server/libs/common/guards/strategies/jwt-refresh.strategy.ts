import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { User } from 'shared';
import { CacheService } from 'libs/common/cache/cache.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(config: ConfigService, private cacheService: CacheService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.cookies?.refreshToken;
        },
      ]),
      secretOrKey: config.get('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }
  async validate(req: Request, payload: { id: User['id'] }) {
    const storedRefreshToken = await this.cacheService.get(payload.id);
    if (req?.cookies?.refreshToken !== storedRefreshToken) throw new UnauthorizedException();

    return payload;
  }
}
