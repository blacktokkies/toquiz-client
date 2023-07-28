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

/**
 * ## 사용자가 로그인했는지 검사
 * `checkAndRefreshAccessToken` 결과로 오류가 발생한다면
 * 액세스 토큰과 리프레쉬 토큰 모두 유효하지 않으므로
 * 사용자를 로그인한 상태로 볼 수 없다
 * @returns 사용자가 로그인했는지 여부
 */
export async function isUserLoggedIn(): Promise<boolean> {
  try {
    await checkAndRefreshAccessToken();
  } catch (e) {
    return false;
  }
  return true;
}
