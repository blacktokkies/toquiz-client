import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '@users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from 'shared';
import { UsersModule } from '@users/users.module';
import { PrismaModule } from 'libs/prisma/src';

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

  describe('bcrypt 패키지 테스트', () => {
    it('암호화된 비밀번호는 암호화 된기 전 비밀번호와 달라야 한다.', async () => {
      //Given
      const salt: string = await bcrypt.genSalt();
      const password: User['password'] = 'test@1234';
      // When
      const encryptedPassword: User['password'] = await bcrypt.hash(password, salt);
      // Then
      expect(password).not.toEqual(encryptedPassword);
    });
    it('같은 salt 로 암호화 된 비밀번호는 같아야 한다.', async () => {
      // Given
      const salt: string = await bcrypt.genSalt();
      const password: User['password'] = 'test@1234';
      const expectedPassword: User['password'] = await bcrypt.hash(password, salt);
      // When
      const result: User['password'] = await sut.encryptPassword(password, salt);
      // Then
      expect(result).toEqual(expectedPassword);
    });
  });
});
