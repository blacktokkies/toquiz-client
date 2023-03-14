import { BadRequestException, Injectable } from '@nestjs/common';
import { MysqlPrismaService } from 'libs/prisma/src/mysql-prisma.service';
import { SignUpDto } from './dto';
import { type PROVIDER, ToquizUser, User } from 'shared';
import { Prisma } from 'libs/prisma/prisma/generated/mysql';
import { MongodbPrismaService } from 'libs/prisma/src/mongodb-prisma.service';

@Injectable()
export class UsersRepository {
  constructor(
    private mysqlService: MysqlPrismaService,
    private mongodbService: MongodbPrismaService,
  ) {}

  async createUser(signUpDto: SignUpDto, provider: PROVIDER): Promise<User> {
    try {
      return await this.mysqlService.user.create({ data: { ...signUpDto, provider } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002')
          throw new BadRequestException('같은 아이디를 가진 회원이 존재합니다.');
      }
    }
  }

  async findUser(userWhereInput: Prisma.UserWhereInput): Promise<User> {
    return await this.mysqlService.user.findFirst({ where: userWhereInput });
  }

  async findToquizUserByUserId(userId: User['id']): Promise<ToquizUser> {
    return await this.mongodbService.toquizUser.findFirst({ where: { userId } });
  }

  async createToquizUser(userId: User['id'] = null): Promise<ToquizUser> {
    return await this.mongodbService.toquizUser.create({ data: { userId: userId, panels: [] } });
  }
}
