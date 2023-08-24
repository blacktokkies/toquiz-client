import { me, refresh } from '@/lib/api/auth';
import { ApiError, setAccessToken } from '@/lib/apiClient';
import { setUserState } from '@/stores/user-store';

/**
 * ## 액세스 토큰 검증 및 재발급
 * 1. 현재 인메모리에 가지고 있는 액세스 토큰으로 `내 정보 가져오기 API` 요청
 * 2. Unauthorized Error 발생 시 현재 쿠키에 가지고 있는 리프레쉬 토큰으로 `리프레쉬 API` 요청
 * 3. Unauthorized Error 발생 시 사용자는 다시 로그인을 해야 액세스 토큰을 발급받을 수 있다.
 */
async function checkAndRefreshAccessToken(): Promise<void> {
  try {
    await me();
  } catch (e) {
    if (e instanceof ApiError && e.response.status === 401) {
      const { accessToken, ...user } = await refresh();
      setAccessToken(accessToken);
      setUserState(user);
      await me();
      return;
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

/**
 * ## 토큰 재발급 시도
 * 액세스 토큰이 인메모리에 저장되므로 처음으로 애플리케이션이 실행될 때에는
 * 액세스 토큰이 없는 것이 보장된다.
 * 따라서 단순히 리프레쉬 토큰을 사용하여 액세스 토큰 발급을 시도할 때 사용할 수 있다.
 */
export async function tryRefreshToken(): Promise<void> {
  const { accessToken, ...user } = await refresh();
  setAccessToken(accessToken);
  setUserState(user);
}
