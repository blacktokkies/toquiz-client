import type { Question } from '@/lib/api/question';

import { faker } from '@faker-js/faker';

let id = 0;
export const createMockQuestion = (): Question => ({
  id: id++,
  content: faker.lorem.sentences().slice(0, 200),
  answerNum: faker.datatype.number(5),
  likeNum: faker.datatype.number(10),
  authorId: '익명 사용자 토큰',
  createdAt: new Date().toString(),
  updatedAt: new Date().toString(),
});

export const createMockQuestionList = (size: number): Question[] =>
  [...Array(size).keys()].map(createMockQuestion);

export const mockQuestionList: Question[] = createMockQuestionList(30 * 3);
