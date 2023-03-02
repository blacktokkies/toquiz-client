import { me, refresh } from '@/lib/api/auth';
import { ApiError, setAccessToken } from '@/lib/apiClient';
import { setUser } from '@/store/userStore';

/**
 * ## 액세스 토큰 검증 및 재발급
 * 1. 현재 인메모리에 가지고 있는 액세스 토큰으로 `GET /api/user` 요청
 * 2. Unauthorized Error 발생 시 현재 쿠키에 가지고 있는 리프레쉬 토큰으로 `POST /api/users/auth/refresh` 요청
 * 3. Unauthorized Error 발생 시 사용자는 다시 로그인을 해야 액세스 토큰을 발급받을 수 있다.
 */
async function checkAndRefreshAccessToken(): Promise<void> {
  try {
    await me();
  } catch (e) {
    if (e instanceof ApiError && e.response.status === 401) {
      try {
        const { accessToken, user } = await refresh();
        setAccessToken(accessToken);
        setUser(user);
        await me();
      } catch (innerError) {
        throw e;
      }
    }
    throw e;
  }
}
