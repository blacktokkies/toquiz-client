import { WinstonModule } from 'nest-winston';
import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';
import { consoleOptions, fileOptions } from './winston-options';

export const winstonLogger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console(consoleOptions()),
    // info, warn, error 로그는 파일에 저장
    new winstonDaily(fileOptions('info')),
    new winstonDaily(fileOptions('warn')),
    new winstonDaily(fileOptions('error')),
  ],
});
