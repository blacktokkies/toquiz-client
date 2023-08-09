import type { Panel } from '@/lib/api/panel';

import { faker } from '@faker-js/faker';

export const createMockPanel = (): Panel => ({
  id: faker.datatype.uuid(),
  userId: 'userId',
  title: faker.music.songName(),
  description: faker.lorem.sentence(),
  isArchived: faker.datatype.boolean(),
  scrapNum: faker.datatype.number({ min: 0, max: 100 }),
  createdAt: new Date().toDateString(),
  updatedAt: new Date().toDateString(),
});

export const createMockPanleList = (size: number): Panel[] =>
  [...Array(size).keys()].map(createMockPanel);

// TODO: myPanelsData로 이름 수정하기
export const myPanelsData: Panel[] = createMockPanleList(60);
