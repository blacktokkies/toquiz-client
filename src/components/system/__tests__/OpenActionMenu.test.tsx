import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { OpenActionMenu } from '@/components/system/OpenActionMenu';

describe('OpenActionMenu', () => {
  function TestComponent1(): JSX.Element {
    return (
      <OpenActionMenu open={() => <>액션 메뉴</>}>영역 내부</OpenActionMenu>
    );
  }

  it('OpenActionMenu 내부를 누르면 open에 전달한 액션 메뉴가 열린다', async () => {
    render(<TestComponent1 />);

    await userEvent.click(screen.getByText(/영역 내부/));

    expect(screen.getByText(/액션 메뉴/)).toBeInTheDocument();
  });

  it('액션 메뉴 안쪽을 누르면 액션 메뉴가 닫히지 않는다', async () => {
    render(<TestComponent1 />);

    await userEvent.click(screen.getByText(/영역 내부/));

    const actionMenu = screen.getByText(/액션 메뉴/);
    await userEvent.click(actionMenu);

    expect(screen.getByText(/액션 메뉴/)).toBeInTheDocument();
  });

  it('액션 메뉴 바깥쪽을 누르면 액션 메뉴가 닫힌다', async () => {
    render(<TestComponent1 />);

    await userEvent.click(screen.getByText(/영역 내부/));
    await userEvent.click(document.body);

    expect(screen.queryByText(/액션 메뉴/)).not.toBeInTheDocument();
  });

  function TestComponent2(): JSX.Element {
    return (
      <OpenActionMenu
        open={({ close }) => (
          <>
            <button type="button" onClick={close}>
              close
            </button>
            액션 메뉴
          </>
        )}
      >
        영역 내부
      </OpenActionMenu>
    );
  }

  it('액션 메뉴에 전달된 close 함수가 실행되면 액션 메뉴가 닫힌다', async () => {
    render(<TestComponent2 />);
    await userEvent.click(screen.getByText(/영역 내부/));

    const closeButton = screen.getByRole('button', { name: 'close' });
    await userEvent.click(closeButton);

    expect(screen.queryByText(/액션 메뉴/)).not.toBeInTheDocument();
  });
});
