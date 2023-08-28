import type { Answer } from '@/lib/api/answer';

import { faker } from '@faker-js/faker';

let id = 0;
export const createMockAnswer = (): Answer => ({
  id: id++,
  content: faker.lorem.sentence(),
  createdAt: new Date().toString(),
  updatedAt: new Date().toString(),
});

export const createMockAnswerList = (size: number): Answer[] =>
  [...Array(size).keys()].map(createMockAnswer);

export const mockAnswerList: Answer[] = createMockAnswerList(30 * 3);
