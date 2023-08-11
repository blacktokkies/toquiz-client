import React, { useRef } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useInsideClick } from '@/hooks/useInsideClick';

const handleInsideClick = vi.fn();

function TestComponent(): JSX.Element {
  const target = useRef<HTMLDivElement>(null);

  useInsideClick(target, handleInsideClick);
  return <div ref={target}>타겟</div>;
}

describe('useInsideClick', () => {
  it('target 내부를 클릭하면 onInsideClick 함수가 호출된다', async () => {
    render(<TestComponent />);

    await userEvent.click(screen.getByText(/타겟/));
    expect(handleInsideClick).toHaveBeenCalled();
  });

  it('target 외부를 클릭하면 onInsideClick 함수가 호출되지 않는다', async () => {
    render(<TestComponent />);

    await userEvent.click(document.body);
    expect(handleInsideClick).not.toHaveBeenCalled();
  });
});
