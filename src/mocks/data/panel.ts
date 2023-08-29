import type { Panel } from '@/lib/api/panel';

import { faker } from '@faker-js/faker';

import { myAccount } from './auth';

export const createMockPanel = (): Panel => ({
  sid: faker.datatype.uuid(),
  title: faker.music.songName(),
  description: faker.lorem.sentences().slice(0, 50),
  author: {
    id: myAccount.id,
    nickname: myAccount.nickname,
  },
  createdAt: new Date().toDateString(),
  updatedAt: new Date().toDateString(),
});

export const createMockPanleList = (size: number): Panel[] =>
  [...Array(size).keys()].map(createMockPanel);

export const myPanelList: Panel[] = createMockPanleList(30);
