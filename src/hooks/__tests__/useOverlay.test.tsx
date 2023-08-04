import React from 'react';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useOverlay } from '@/hooks/useOverlay';
import { renderWithOverlay } from '@/lib/test-utils/overlay';

describe('useOverlay', () => {
  function TestComponent(): JSX.Element {
    const overlay = useOverlay();
    return (
      <>
        <button
          type="button"
          onClick={() => {
            overlay.open(() => <div>오버레이</div>);
          }}
        >
          open
        </button>
        <button
          type="button"
          onClick={() => {
            overlay.close();
          }}
        >
          close
        </button>
      </>
    );
  }

  it('open 함수가 실행되면 오버레이가 마운트된다', async () => {
    renderWithOverlay(<TestComponent />);

    const openButton = screen.getByRole('button', { name: /open/ });
    await userEvent.click(openButton);

    expect(screen.getByText(/오버레이/)).toBeInTheDocument();
  });

  it('close 함수가 실행되면 오버레이가 언마운트된다', async () => {
    renderWithOverlay(<TestComponent />);

    const closeButton = screen.getByRole('button', { name: /close/ });
    await userEvent.click(closeButton);

    expect(screen.queryByText(/오버레이/)).not.toBeInTheDocument();
  });
});
