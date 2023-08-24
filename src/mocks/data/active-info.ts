import type { MyActiveInfo } from '@/lib/api/active-Info';
import type { Question } from '@/lib/api/question';

import { mockQuestionList } from '@/mocks/data/question';

export const myActiveInfoMock: MyActiveInfo = {
  createdIds: [1, 2, 3],
  likedIds: mockQuestionList.reduce<Array<Question['id']>>((acc, cur) => {
    if (acc.length === 10 || cur.likeNum === 0) return acc;
    return [...acc, cur.id];
  }, []),
};
