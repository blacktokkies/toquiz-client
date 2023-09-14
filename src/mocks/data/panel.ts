import type { Panel } from '@/lib/api/panel';

import { faker } from '@faker-js/faker';

import { mockUser } from './auth';

export const createMockPanelId = (): Panel['sid'] => faker.datatype.uuid();
export const createMockPanel = (): Panel => ({
  sid: createMockPanelId(),
  title: faker.music.songName(),
  description: faker.lorem.sentences().slice(0, 50),
  author: {
    id: mockUser.id,
    nickname: mockUser.nickname,
  },
  createdAt: new Date().toDateString(),
  updatedAt: new Date().toDateString(),
});
export const createMockPanleList = (size: number): Panel[] =>
  [...Array(size).keys()].map(createMockPanel);

export const myPanelList: Panel[] = createMockPanleList(30);
