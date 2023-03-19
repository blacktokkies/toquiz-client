import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { SignToken } from 'libs/utils/sign-token';
import { JwtAccessStrategy } from 'libs/common/guards/strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from 'libs/common/guards/strategies/jwt-refresh.strategy';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { CacheService } from 'libs/common/cache/cache.service';
import { ToquizGuard } from 'libs/common/guards/toquiz.guard';

@Module({
  imports: [JwtModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [
    JwtService,
    SignToken,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    ConfigService,
    CacheService,
    ToquizGuard,
  ],
  exports: [
    JwtService,
    SignToken,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    ConfigService,
    ToquizGuard,
  ],
})
export class AuthModule {}
