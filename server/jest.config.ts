import dotenv from 'dotenv';
import path from 'path';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';
import type { JestConfigWithTsJest } from 'ts-jest';

// env 경로 설정
const envPath = path.resolve(__dirname, 'config/.test.env');
dotenv.config({ path: envPath });

const jestConfig: JestConfigWithTsJest = {
  roots: ['<rootDir>'],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  preset: 'ts-jest',

  setupFiles: ['dotenv/config'], // .env 파일의 내용이 환경변수로 등록되어 Jest 에서 사용할 수 있게 됨
  testEnvironment: 'node', // node 환경에서 실행
  testEnvironmentOptions: {
    NODE_ENV: 'test', // 실행 환경은 test
  },
};

export default jestConfig;
