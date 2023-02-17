import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignUpDto } from './dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SignUpResponse } from 'shared';

@Controller('api/users')
@ApiTags('유저 API')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('auth/signup')
  @ApiOperation({ summary: '유저 생성 API', description: '유저를 생성한다.' })
  async signUp(@Body() signUpDto: SignUpDto): Promise<SignUpResponse> {
    await this.usersService.signUp(signUpDto);

    return {
      statusCode: 200,
      result: {
        message: '회원가입 성공',
      },
    };
  }
}
