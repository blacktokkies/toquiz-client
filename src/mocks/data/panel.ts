import type { MyActiveInfo, Panel } from '@/lib/api/panel';
import type { Question } from '@/lib/api/question';

import { faker } from '@faker-js/faker';

import { myAccount } from '@/mocks/data/auth';

import { mockQuestionList } from './question';

let id = 0;
export const createMockPanel = (): Panel => ({
  id: id++,
  author: myAccount.email,
  title: faker.music.songName(),
  description: faker.lorem.sentences().slice(0, 50),
  createdAt: new Date().toDateString(),
  updatedAt: new Date().toDateString(),
});

export const createMockPanleList = (size: number): Panel[] =>
  [...Array(size).keys()].map(createMockPanel);

export const myPanelList: Panel[] = createMockPanleList(30);

export const myActiveInfoMock: MyActiveInfo = {
  createdIds: [1, 2, 3],
  likedIds: mockQuestionList.reduce<Array<Question['id']>>((acc, cur) => {
    if (acc.length === 10 || cur.likeNum === 0) return acc;
    return [...acc, cur.id];
  }, []),
};
