import { act, renderHook } from '@testing-library/react';

import { useUserStore } from '@/hooks/stores/useUserStore';
import { initialUserState, type UserState } from '@/store/user-store';

describe('useUserStore', () => {
  it('초기값으로 초기화된다', () => {
    const { result } = renderHook(() =>
      useUserStore(({ email, nickname, createdAt }) => ({
        email,
        nickname,
        createdAt,
      })),
    );

    expect(result.current).toEqual(initialUserState);
  });

  it('setUser를 호출하면 사용자 상태를 변경한다', () => {
    const { result } = renderHook(() =>
      useUserStore(({ email, nickname, createdAt, setUser }) => ({
        email,
        nickname,
        createdAt,
        setUser,
      })),
    );

    const newUser: UserState = {
      email: 'test@email.com',
      nickname: 'testnickname',
      createdAt: new Date().toString(),
    };

    act(() => {
      result.current.setUser(newUser);
    });

    expect(result.current.email).toBe(newUser.email);
    expect(result.current.nickname).toBe(newUser.nickname);
    expect(result.current.createdAt).toBe(newUser.createdAt);
  });

  it('updateUser를 호출하면 사용자 상태를 일부 변경한다', () => {
    const { result } = renderHook(() =>
      useUserStore(({ email, nickname, createdAt, updateUser }) => ({
        email,
        nickname,
        createdAt,
        updateUser,
      })),
    );

    const partialUser: Partial<UserState> = {
      email: 'test@email.com',
    };
    const updatedUser: UserState = { ...initialUserState, ...partialUser };

    act(() => {
      result.current.updateUser(partialUser);
    });

    expect(result.current.email).toBe(updatedUser.email);
    expect(result.current.nickname).toBe(updatedUser.nickname);
    expect(result.current.createdAt).toBe(updatedUser.createdAt);
  });

  it('clearUser를 호출하면 사용자 상태를 변경한다', () => {
    const { result } = renderHook(() =>
      useUserStore(({ email, nickname, createdAt, setUser, clearUser }) => ({
        email,
        nickname,
        createdAt,
        setUser,
        clearUser,
      })),
    );

    const newUser: UserState = {
      email: 'test@email.com',
      nickname: 'testnickname',
      createdAt: new Date().toString(),
    };

    act(() => {
      result.current.setUser(newUser);
    });

    act(() => {
      result.current.clearUser();
    });

    expect(result.current.email).toBe(initialUserState.email);
    expect(result.current.nickname).toBe(initialUserState.nickname);
    expect(result.current.createdAt).toBe(initialUserState.createdAt);
  });
});
