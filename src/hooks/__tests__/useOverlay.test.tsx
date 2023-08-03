import React from 'react';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useOverlay } from '@/hooks/useOverlay';
import { renderWithOverlay } from '@/lib/test-utils/overlay';

describe('useOverlay', () => {
  function TestComponent(): JSX.Element {
    const overlay = useOverlay();
    return (
      <button
        type="button"
        onClick={() => {
          overlay.open(() => <div>오버레이</div>);
        }}
      >
        open
      </button>
    );
  }

  it('open 함수가 실행되면 오버레이가 마운트된다', async () => {
    renderWithOverlay(<TestComponent />);

    const openButton = screen.getByRole('button', { name: /open/ });
    await userEvent.click(openButton);

    expect(screen.getByText(/오버레이/)).toBeInTheDocument();
  });

  it('오버레이 바깥을 누르면 오버레이가 언마운트된다', async () => {
    renderWithOverlay(<TestComponent />);

    const openButton = screen.getByRole('button', { name: /open/ });
    await userEvent.click(openButton);

    const overlay = screen.getByText(/오버레이/);
    await userEvent.click(document.body);

    expect(overlay).not.toBeInTheDocument();
  });
});
