import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'shared';
import { Injectable } from '@nestjs/common';
import { tokenOption } from './token-option';
import { CacheService } from 'libs/common/cache/cache.service';

@Injectable()
export class SignToken {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    private cacheService: CacheService,
  ) {}

  signAccessToken(id: User['id'], nickname: User['nickname']): string {
    const payload = {
      id,
      nickname,
    };
    return this.jwt.sign(payload, tokenOption.accessToken(this.config.get('JWT_ACCESS_SECRET')));
  }

  signRefreshToken(id: User['id']): string {
    const payload = {
      id,
    };
    const refreshToken = this.jwt.sign(
      payload,
      tokenOption.refreshToken(this.config.get('JWT_REFRESH_SECRET')),
    );
    this.cacheService.set(id, refreshToken, 60 * 60 * 24 * 14); // 14일 동안 유지

    return refreshToken;
  }
}
