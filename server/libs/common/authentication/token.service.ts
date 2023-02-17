import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'shared';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenService {
  constructor(private jwt: JwtService, private config: ConfigService) {}

  async signAccessToken(id: User['id'], nickname: User['nickname']): Promise<string> {
    const payload = {
      id,
      nickname,
    };
    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: '1hr',
      secret: this.config.get('JWT_ACCESS_SECRET'),
    });

    return accessToken;
  }

  async signRefreshToken(id: User['id']): Promise<string> {
    const payload = {
      id,
    };
    const refreshToken = await this.jwt.signAsync(payload, {
      expiresIn: '14d',
      secret: this.config.get('JWT_REFRESH_SECRET'),
    });

    return refreshToken;
  }
}
