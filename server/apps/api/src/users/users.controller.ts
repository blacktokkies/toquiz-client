import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDto, SignUpDto } from './dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IssueToquizTokenResult, LogInResult, RefreshResult, SignUpResult } from 'shared';
import { Request, Response } from 'express';
import { cookieOption } from 'libs/utils/cookie-option';
import { JwtRefreshGuard } from 'libs/common/guards/jwt-refresh.guard';

@Controller('api/users')
@ApiTags('유저 API')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('auth/signup')
  @ApiOperation({ summary: '회원가입 API', description: '유저를 생성한다.' })
  async signUp(@Body() signUpDto: SignUpDto): Promise<SignUpResult> {
    await this.usersService.signUp(signUpDto);

    return { message: '회원가입 성공' };
  }

  @Post('auth/login')
  @ApiOperation({ summary: '로그인 API' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LogInResult> {
    const { user, accessToken, refreshToken, toquizUserId } = await this.usersService.login(
      loginDto,
    );

    res.cookie('refreshToken', refreshToken, cookieOption.refreshToken);
    res.cookie('toquizToken', toquizUserId, cookieOption.toquizToken);

    return {
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        createdAt: user.createdAt,
      },
      accessToken,
    };
  }

  @Post('/auth/refresh')
  @UseGuards(JwtRefreshGuard)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RefreshResult> {
    const { user, accessToken, refreshToken } = await this.usersService.refresh(req.user['id']);

    res.cookie('refreshToken', refreshToken, cookieOption.refreshToken);

    return {
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        createdAt: user.createdAt,
      },
      accessToken,
    };
  }

  @Post('/auth/toquiz')
  async issueToquizToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IssueToquizTokenResult> {
    const toquizUserId = await this.usersService.issueToquizToken(req?.cookies?.toquizToken);

    res.cookie('toquizToken', toquizUserId, cookieOption.toquizToken);

    return { message: 'toquizToken 발급 성공' };
  }
}
