import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SignUpResponse } from 'shared';

@Controller('api/users')
@ApiTags('유저 API')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('auth/signup')
  @ApiOperation({ summary: '유저 생성 API', description: '유저를 생성한다.' })
  async signUp(@Body() createUserDto: CreateUserDto): Promise<SignUpResponse> {
    await this.usersService.signUp(createUserDto);

    return {
      statusCode: 200,
      result: {
        message: '회원가입 성공',
      },
    };
  }
}
