import React, { useRef } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useOutsideClick } from '@/hooks/useOutsideClick';

const handleOutsideClick = vi.fn();

function TestComponent(): JSX.Element {
  const target = useRef<HTMLDivElement>(null);

  useOutsideClick(target, handleOutsideClick);
  return <div ref={target}>타겟</div>;
}

describe('useOutsideClick', () => {
  it('target 내부를 클릭하면 onOutsideClick 함수가 호출되지 않는다', async () => {
    render(<TestComponent />);

    await userEvent.click(screen.getByText(/타겟/));
    expect(handleOutsideClick).not.toHaveBeenCalled();
  });

  it('target 외부를 클릭하면 onOutsideClick 함수가 호출된다', async () => {
    render(<TestComponent />);

    await userEvent.click(document.body);
    expect(handleOutsideClick).toHaveBeenCalled();
  });
});
