import { Injectable, ExecutionContext } from '@nestjs/common';
import { MongodbPrismaService } from 'libs/prisma/src/mongodb-prisma.service';
import { AuthGuard } from '@nestjs/passport';
import { cookieOption } from 'libs/utils/cookie-option';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ToquizUser } from 'shared';

@Injectable()
export class ToquizGuard extends AuthGuard('jwt') {
  constructor(
    private mongodbService: MongodbPrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    let toquizToken = request?.cookies?.toquizToken;
    // toquiz token이 유효하지 않으면 toquiz token 발행
    if (await this.isUnvalidToquizToken(toquizToken)) {
      let userId = null;
      // 로그인 된 사용자인 경우 (accessToken이 있는 경우) 매핑된 toquizUser의 id를 발급
      const authHeader = request.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
          const decoded = this.jwtService.verify(token, {
            secret: this.configService.get('JWT_ACCESS_SECRET'),
          });
          userId = decoded.id;
        } catch (e) {}
      }
      toquizToken = await this.issueToquizToken(userId);
    }
    request.cookies.toquizToken = toquizToken;
    response.cookie('toquizToken', toquizToken, cookieOption.toquizToken);

    return true;
  }

  async isUnvalidToquizToken(toquizToken: string | undefined): Promise<boolean> {
    if (!toquizToken) return true;
    const toquizUser: ToquizUser = await this.mongodbService.toquizUser.findFirst({
      where: { id: toquizToken },
    });
    return !toquizUser;
  }

  async issueToquizToken(userId): Promise<ToquizUser['id']> {
    // 로그인된 회원일 경우 매핑된 toquizUserId 반환
    if (userId) {
      const toquizUser: ToquizUser = await this.mongodbService.toquizUser.findFirst({
        where: { userId },
      });
      if (toquizUser) return toquizUser.id;
    }
    // toquizUser에 새로운 도큐먼트 추가 및 toquizUserId 반환
    const toquizUser: ToquizUser = await this.mongodbService.toquizUser.create({
      data: { userId: userId, panels: [] },
    });
    return toquizUser.id;
  }
}
