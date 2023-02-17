import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto';
import { UsersRepository } from './users.repository';
import { PROVIDER, User } from 'shared';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

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
}
