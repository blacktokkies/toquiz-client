import { Body, Controller, Post, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDto, SignUpDto } from './dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LogInResponse, SignUpResponse } from 'shared';
import { Response } from 'express';

@Controller('api/users')
@ApiTags('유저 API')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('auth/signup')
  @ApiOperation({ summary: '회원가입 API', description: '유저를 생성한다.' })
  async signUp(@Body() signUpDto: SignUpDto): Promise<SignUpResponse> {
    await this.usersService.signUp(signUpDto);

    return {
      statusCode: 200,
      result: {
        message: '회원가입 성공',
      },
    };
  }

  @Post('auth/login')
  @ApiOperation({ summary: '로그인 API' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LogInResponse> {
    const { username, nickname, accessToken, refreshToken } = await this.usersService.login(
      loginDto,
    );

    res.cookie('refreshToken', refreshToken, {
      path: '/api/users/auth/refresh',
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 14, // 14일 동안 유지
    });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60 * 1, // 1시간 동안 유지
    });

    return {
      statusCode: 200,
      result: {
        username,
        nickname,
      },
    };
  }
}
