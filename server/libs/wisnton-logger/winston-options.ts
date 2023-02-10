import winston from 'winston';
import { utilities } from 'nest-winston';
import appRootPath from 'app-root-path';

export const consoleOptions = () => {
  const env = process.env.NODE_ENV;

  return {
    level: env === 'production' ? 'http' : 'silly', // 배포 환경 : http 단계 로그, 그 외 환경: silly 단계 로그
    format:
      env === 'production'
        ? winston.format.simple()
        : winston.format.combine(
            winston.format.colorize({ all: true }),
            winston.format.timestamp(),
            utilities.format.nestLike('toquiz', { prettyPrint: true }),
          ),
  };
};

export const fileOptions = (level: string) => {
  const logDir = appRootPath + '/logs';

  return {
    level,
    handleExceptions: true,
    json: false,
    datePattern: 'YYYY-MM-DD',
    dirname: logDir + `/${level}`,
    filename: `%DATE.${level}.log`,
    maxFiles: 30, // 30일치 로그 파일 저장
    zippedArchive: true, // 로그가 쌓이면 압축 관리
  };
};
