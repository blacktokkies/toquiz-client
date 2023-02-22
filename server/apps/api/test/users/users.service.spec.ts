import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '@users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from 'shared';
import { UsersModule } from '@users/users.module';
import { PrismaModule } from 'libs/prisma/src';
import { BadRequestException } from '@nestjs/common';

describe('UsersService', () => {
  let sut: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, PrismaModule],
    }).compile();

    sut = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('[function] encryptPassword 테스트', () => {
    it('암호화된 비밀번호는 암호화 된기 전 비밀번호와 달라야 한다.', async () => {
      //Given
      const salt: string = bcrypt.genSaltSync();
      const password: User['password'] = 'test@1234';
      // When
      const encryptedPassword: User['password'] = await sut.encryptPassword(password, salt);
      // Then
      expect(password).not.toEqual(encryptedPassword);
    });
    it('같은 salt 로 암호화 된 비밀번호는 같아야 한다.', async () => {
      // Given
      const salt: string = bcrypt.genSaltSync();
      const password: User['password'] = 'test@1234';
      const expectedPassword: User['password'] = await sut.encryptPassword(password, salt);
      // When
      const result: User['password'] = await sut.encryptPassword(password, salt);
      // Then
      expect(result).toEqual(expectedPassword);
    });
  });

  describe('[function] checkPasswordMatch 테스트', () => {
    it('비밀번호가 일치하지 않으면 예외를 반환한다.', () => {
      // Given
      const inputPassword = 'input@1234';
      const registeredPassword = 'registerd@1234';
      // When, Then
      expect(
        async () => await sut.checkPasswordMatch(inputPassword, registeredPassword),
      ).rejects.toThrowError(new BadRequestException('비밀번호가 일치하지 않습니다.'));
    });

    it('비밀번호가 일치하면 예외를 반환하지 않는다.', async () => {
      // Given
      const inputPassword = 'same@1234';
      const registeredPassword = await sut.encryptPassword(inputPassword);
      // When, Then
      expect(
        async () => await sut.checkPasswordMatch(inputPassword, registeredPassword),
      ).not.toThrowError(new BadRequestException('비밀번호가 일치하지 않습니다.'));
    });
  });
});
