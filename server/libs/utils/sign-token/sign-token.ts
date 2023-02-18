import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'shared';
import { Injectable } from '@nestjs/common';
import { tokenOption } from './token-option';

@Injectable()
export class SignToken {
  constructor(private jwt: JwtService, private config: ConfigService) {}

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
    return this.jwt.sign(payload, tokenOption.refreshToken(this.config.get('JWT_REFRESH_SECRET')));
  }
}
