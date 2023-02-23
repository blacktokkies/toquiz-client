import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto, SignUpDto } from './dto';
import { UsersRepository } from './users.repository';
import { PROVIDER, User } from 'shared';
import * as bcrypt from 'bcryptjs';
import { SignToken } from 'libs/utils/sign-token';
import { Prisma } from 'libs/prisma/prisma/generated/mysql';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository, private signToken: SignToken) {}

  async signUp(signUpDto: SignUpDto): Promise<void> {
    const encryptedPassword = await this.encryptPassword(signUpDto.password); // 비밀번호 암호화

    await this.usersRepository.createUser(
      { ...signUpDto, password: encryptedPassword },
      PROVIDER.LOCAL,
    );
  }

  async encryptPassword(
    password: User['password'],
    salt: string = bcrypt.genSaltSync(),
  ): Promise<User['password']> {
    return await bcrypt.hash(password, salt);
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const { username, password } = loginDto;
    const user: User = await this.getUser({ username });

    this.checkPasswordMatch(password, user.password); // 비밀번호가 일치하지 않으면 예외처리

    const accessToken = this.signToken.signAccessToken(user.id, user.nickname);
    const refreshToken = this.signToken.signRefreshToken(user.id);

    return { user, accessToken, refreshToken };
  }

  async refresh(
    id: User['id'],
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const user: User = await this.getUser({ id });

    const accessToken = this.signToken.signAccessToken(user.id, user.nickname);
    const refreshToken = this.signToken.signRefreshToken(user.id);

    return { user, accessToken, refreshToken };
  }

  async getUser(userWhereInput: Prisma.UserWhereInput): Promise<User> {
    const user: User = await this.usersRepository.findUser(userWhereInput);
    if (!user) throw new BadRequestException('아이디가 존재하지 않습니다.');

    return user;
  }

  async checkPasswordMatch(inputPassword, registeredPassword): Promise<void> {
    if (!(await bcrypt.compare(inputPassword, registeredPassword)))
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
  }
}
