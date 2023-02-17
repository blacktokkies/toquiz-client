import { BadRequestException, Injectable } from '@nestjs/common';
import { MysqlPrismaService } from 'libs/prisma/src/mysql-prisma.service';
import { SignUpDto } from './dto';
import { type PROVIDER } from 'shared';
import { Prisma } from 'libs/prisma/prisma/generated/mysql';

@Injectable()
export class UsersRepository {
  constructor(private mysqlService: MysqlPrismaService) {}

  async createUser(signUpDto: SignUpDto, provider: PROVIDER): Promise<void> {
    try {
      await this.mysqlService.user.create({ data: { ...signUpDto, provider } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002')
          throw new BadRequestException('같은 아이디를 가진 회원이 존재합니다.');
      }
    }
  }
}
