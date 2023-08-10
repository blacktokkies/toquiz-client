import type { Panel } from '@/lib/api/panel';

import { faker } from '@faker-js/faker';

import { myAccount } from '@/mocks/data/auth';

export const createMockPanel = (): Panel => ({
  id: faker.datatype.uuid(),
  author: myAccount.email,
  title: faker.music.songName(),
  description: faker.lorem.sentence(),
  createdAt: new Date().toDateString(),
  updatedAt: new Date().toDateString(),
});

export const createMockPanleList = (size: number): Panel[] =>
  [...Array(size).keys()].map(createMockPanel);

export const myPanelList: Panel[] = createMockPanleList(60);
