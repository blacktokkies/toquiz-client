import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from 'libs/common/middlewares/logger.middleware';
import { UsersModule } from '@users/users.module';
import { PrismaModule } from 'libs/prisma/src';
import { PanelsModule } from '@api/src/panels/panels.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.{process.env.NODE_ENV}.env`,
      isGlobal: true,
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
