import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { UsersRepository } from './users.repository';
import { PROVIDER, User } from 'shared';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async signUp(createUserDto: CreateUserDto): Promise<void> {
    const encryptedPassword = await this.encryptPassword(createUserDto.password); // 비밀번호 암호화

    await this.usersRepository.createUser(
      { ...createUserDto, password: encryptedPassword },
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
