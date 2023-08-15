import type { Panel } from '@/lib/api/panel';

import { faker } from '@faker-js/faker';

import { myAccount } from '@/mocks/data/auth';

let id = 0;
export const createMockPanel = (): Panel => ({
  id: id++,
  author: myAccount.email,
  title: faker.music.songName(),
  description: faker.music.genre().slice(0, 50),
  createdAt: new Date().toDateString(),
  updatedAt: new Date().toDateString(),
});

export const createMockPanleList = (size: number): Panel[] =>
  [...Array(size).keys()].map(createMockPanel);

export const myPanelList: Panel[] = createMockPanleList(30);
