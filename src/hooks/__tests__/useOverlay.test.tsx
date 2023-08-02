import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { OverlayController, useOverlay } from '@/hooks/useOverlay';
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

  it('backdrop을 누르면 오버레이가 언마운트된다', async () => {
    renderWithOverlay(<TestComponent />);

    const openButton = screen.getByRole('button', { name: /open/ });
    await userEvent.click(openButton);

    const overlay = screen.getByText(/오버레이/);
    const backdrop = screen.getByRole('dialog');
    await userEvent.click(backdrop);

    expect(overlay).not.toBeInTheDocument();
  });
});

describe('OverlayController', () => {
  const handleClose = vi.fn();

  it('overlay를 누르면 close 함수가 호출되지 않는다', async () => {
    render(
      <OverlayController
        createOverlayContent={() => <div>오버레이</div>}
        close={handleClose}
      />,
    );

    const overlay = screen.getByText(/오버레이/);
    await userEvent.click(overlay);

    expect(handleClose).not.toHaveBeenCalled();
  });

  it('backdrop을 누르면 close 함수가 호출된다', async () => {
    render(
      <OverlayController
        createOverlayContent={() => <>오버레이</>}
        close={handleClose}
      />,
    );

    const backdrop = screen.getByRole('dialog');
    await userEvent.click(backdrop);

    expect(handleClose).toHaveBeenCalled();
  });
});
