import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto, SignUpDto } from './dto';
import { UsersRepository } from './users.repository';
import { PROVIDER, User } from 'shared';
import * as bcrypt from 'bcryptjs';
import { TokenService } from 'libs/common/authentication/token.service';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository, private toeknService: TokenService) {}

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

  async checkPasswordMatch(inputPassword, registeredPassword) {
    if (!(await bcrypt.compare(inputPassword, registeredPassword)))
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
  }

  async login(loginDto: LoginDto): Promise<Record<string, string>> {
    const { username, password } = loginDto;
    const user: User = await this.usersRepository.findUserByUsername(username);

    if (!user) throw new BadRequestException('아이디가 존재하지 않습니다.'); // 아이디가 존재하는지 않으면 예외처리
    this.checkPasswordMatch(password, user.password); // 비밀번호가 일치하지 않으면 예외처리

    // accessToken, refreshToken 발급
    const accessToken = await this.toeknService.signAccessToken(user.id, user.password);
    const refreshToken = await this.toeknService.signRefreshToken(user.id);

    return { username: user.username, nickname: user.nickname, accessToken, refreshToken };
  }
}
