import React from 'react';

import { render, screen } from '@testing-library/react';

import { Input } from '@/components/system/Input';

describe('Input', () => {
  it('errorMessage 옵션을 전달하면 에러 메시지를 보여준다', () => {
    render(<Input errorMessage="에러 메시지" />);

    expect(screen.getByText(/에러 메시지/)).toBeInTheDocument();
  });
});
