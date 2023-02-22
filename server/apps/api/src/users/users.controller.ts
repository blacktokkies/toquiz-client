import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDto, SignUpDto } from './dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LogInResponse, RefreshResponse, SignUpResponse } from 'shared';
import { Request, Response } from 'express';
import { cookieOption } from 'libs/utils/cookie-option';
import { JwtRefreshGuard } from 'libs/common/guards/jwt-refresh.guard';

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
      result: { message: '회원가입 성공' },
    };
  }

  @Post('auth/login')
  @ApiOperation({ summary: '로그인 API' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LogInResponse> {
    const { user, accessToken, refreshToken } = await this.usersService.login(loginDto);

    res.cookie('refreshToken', refreshToken, cookieOption.refreshToken);

    return {
      statusCode: 200,
      result: {
        user: {
          id: user.id,
          username: user.username,
          nickname: user.nickname,
          createdAt: user.createdAt,
        },
        accessToken,
      },
    };
  }

  @Post('/auth/refresh')
  @UseGuards(JwtRefreshGuard)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RefreshResponse> {
    const { user, accessToken, refreshToken } = await this.usersService.refresh(req.user['id']);

    res.cookie('refreshToken', refreshToken, cookieOption.refreshToken);

    return {
      statusCode: 200,
      result: {
        user: {
          id: user.id,
          username: user.username,
          nickname: user.nickname,
          createdAt: user.createdAt,
        },
        accessToken,
      },
    };
  }
}
