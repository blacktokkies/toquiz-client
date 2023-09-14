import type { Question } from '@/lib/api/question';

import { faker } from '@faker-js/faker';

export const createMockQuestionId = (() => {
  let id = 0;
  return () => id++;
})();
export const createMockQuestion = (): Question => ({
  id: createMockQuestionId(),
  content: faker.lorem.sentences().slice(0, 200),
  answerNum: faker.datatype.number(5),
  likeNum: faker.datatype.number(10),
  authorId: '익명 사용자 토큰',
  createdAt: new Date().toString(),
  updatedAt: new Date().toString(),
});
export const createMockQuestionList = (size: number): Question[] =>
  [...Array(size).keys()].map(createMockQuestion);

export let mockQuestionList: Question[] = createMockQuestionList(30 * 3);
export const initMockQuestionList = (): void => {
  mockQuestionList = createMockQuestionList(30 * 3);
};
