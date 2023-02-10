import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'production' ? '.production.env' : '.development.env',
    }),
  ],
  controllers: [],
  providers: [ConfigService],
})
export class ApiModule {}
