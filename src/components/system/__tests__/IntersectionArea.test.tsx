import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { IntersectionArea } from '../IntersectionArea';

const handleIntersection = vi.fn();

describe('IntersectionArea', () => {
  it('사용자가 아래로 스크롤하여 children의 끝이 viewport에 교차되면 onIntersection 콜백을 호출한다', () => {
    render(<IntersectionArea onIntersection={handleIntersection} />);
    fireEvent.scroll(window);

    expect(handleIntersection).toHaveBeenCalledWith(true);
  });
});
