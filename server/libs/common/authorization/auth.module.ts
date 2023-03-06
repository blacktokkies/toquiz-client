import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { SignToken } from 'libs/utils/sign-token';
import { JwtAccessStrategy } from 'libs/common/guards/strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from 'libs/common/guards/strategies/jwt-refresh.strategy';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { CacheService } from 'libs/common/cache/cache.service';

@Module({
  imports: [JwtModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [
    JwtService,
    SignToken,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    ConfigService,
    CacheService,
  ],
  exports: [JwtService, SignToken, JwtAccessStrategy, JwtRefreshStrategy, ConfigService],
})
export class AuthModule {}
