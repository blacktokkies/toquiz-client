import React from 'react';

import { render, screen } from '@testing-library/react';

import { Panel } from '@/pages/Panel';

describe('패널 페이지', () => {
  it('헤더를 보여준다', () => {
    render(<Panel />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });
});
