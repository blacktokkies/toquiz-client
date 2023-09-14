import type { Answer } from '@/lib/api/answer';

import { faker } from '@faker-js/faker';

export const createMockAnswerId = (() => {
  let id = 0;
  return () => id++;
})();
export const createMockAnswer = (): Answer => ({
  id: createMockAnswerId(),
  content: faker.lorem.sentence(),
  createdAt: new Date().toString(),
  updatedAt: new Date().toString(),
});

export const createMockAnswerList = (size: number): Answer[] =>
  [...Array(size).keys()].map(createMockAnswer);

export let mockAnswerList: Answer[] = createMockAnswerList(30 * 3);
export const initMockAnswerList = (): void => {
  mockAnswerList = createMockAnswerList(30 * 3);
};
