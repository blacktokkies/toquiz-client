import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { UsersRepository } from './users.repository';
import { PROVIDER, User } from 'shared';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async signUp(createUserDto: CreateUserDto): Promise<void> {
    const { username, password } = createUserDto;

    await this.checkUser(username); // 아이디가 존재하면 에러 처리
    const encryptedPassword = await this.encryptionPassword(password); // 비밀번호 암호화

    await this.usersRepository.createUser(
      { ...createUserDto, password: encryptedPassword },
      PROVIDER.LOCAL,
    );
  }

  async checkUser(username: User['username']): Promise<void> {
    const user = await this.usersRepository.getUserByUsername(username);
    if (user) {
      throw new BadRequestException('이미 존재하는 아이디가 있습니다.');
    }
  }

  async encryptionPassword(password: User['password']): Promise<User['password']> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }
}
