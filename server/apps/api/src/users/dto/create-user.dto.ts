import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { User } from 'shared';
import { ApiProperty } from '@nestjs/swagger';

// 8~20자 영문, 숫자, 특수문자 최소 한가지씩 조합
const passwordRegex = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,20}$/;

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @Length(5, 16)
  @ApiProperty()
  username: User['username'];

  @IsNotEmpty()
  @Matches(passwordRegex)
  @ApiProperty()
  password: User['password'];

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  nickname: User['nickname'];
}
