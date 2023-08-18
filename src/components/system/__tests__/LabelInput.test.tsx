import React from 'react';

import { render, screen } from '@testing-library/react';

import { LabelInput } from '@/components/system/LabelInput';

describe('LabelInput', () => {
  it('label 옵션에 텍스트를 전달하면 해당 텍스트를 보여준다', () => {
    render(<LabelInput label="라벨" />);

    expect(screen.getByText(/라벨/)).toBeInTheDocument();
  });

  it('required 옵션을 true로 전달하면 *을 보여준다', () => {
    render(<LabelInput label="라벨" required />);

    expect(
      screen.getByRole('img', { name: '필수 입력 표시' }),
    ).toBeInTheDocument();
  });
});
