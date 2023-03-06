import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerMiddleware } from 'libs/common/middlewares/logger.middleware';
import { UsersModule } from '@users/users.module';
import { PrismaModule } from 'libs/prisma/src';
import { PanelsModule } from '@api/src/panels/panels.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { RedisConfigService } from 'libs/common/cache/cache.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.{process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useClass: RedisConfigService,
      inject: [ConfigService],
    }),
    PrismaModule,
    UsersModule,
    PanelsModule,
  ],
  providers: [Logger],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
