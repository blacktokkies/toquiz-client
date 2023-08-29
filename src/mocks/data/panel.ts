import type { Panel } from '@/lib/api/panel';

import { faker } from '@faker-js/faker';

export const createMockPanel = (): Panel => ({
  sid: faker.datatype.uuid(),
  title: faker.music.songName(),
  description: faker.lorem.sentences().slice(0, 50),
  author: {
    id: 0,
    nickname: '개발 닉네임',
  },
  createdAt: new Date().toDateString(),
  updatedAt: new Date().toDateString(),
});

export const createMockPanleList = (size: number): Panel[] =>
  [...Array(size).keys()].map(createMockPanel);

export const myPanelList: Panel[] = createMockPanleList(30);
