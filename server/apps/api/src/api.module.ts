import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerMiddleware } from 'libs/common/middlewares/logger.middleware';
import { UsersModule } from '@users/users.module';
import { PrismaModule } from 'libs/prisma/src';
import { PanelsModule } from '@api/src/panels/panels.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { RedisConfigService } from 'libs/common/cache/cache.config';
import { QuestionsModule } from '@api/src/questions/questions.module';

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
    QuestionsModule,
  ],
  providers: [Logger],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
