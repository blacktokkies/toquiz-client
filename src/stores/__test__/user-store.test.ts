import type { UserState } from '@/stores/user-store';

import {
  initialUserState,
  getUserState,
  setUserState,
  updateUserState,
  clearUserState,
} from '@/stores/user-store';

describe('userStore', () => {
  it('초기값으로 초기화된다', () => {
    expect(getUserState()).toEqual(initialUserState);
  });

  it('setUserState를 호출하면 사용자 상태를 변경한다', () => {
    const newUser: UserState = {
      email: 'test@email.com',
      nickname: 'testnickname',
      createdAt: new Date().toString(),
    };

    setUserState(newUser);

    expect(getUserState()).toEqual(newUser);
  });

  it('updateUserState를 호출하면 사용자 상태를 일부 변경한다', () => {
    const partialUser: Partial<UserState> = {
      email: 'test@email.com',
    };

    updateUserState(partialUser);

    expect(getUserState()).toEqual({ ...initialUserState, ...partialUser });
  });

  it('clearUserState를 호출하면 사용자 상태를 초기화한다', () => {
    const newUser: UserState = {
      email: 'test@email.com',
      nickname: 'testnickname',
      createdAt: new Date().toString(),
    };

    setUserState(newUser);
    clearUserState();

    expect(getUserState()).toEqual(initialUserState);
  });
});
