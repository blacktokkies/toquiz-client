import type { Panel } from 'shared';

import { faker } from '@faker-js/faker';

export const createPanelList = (size = 20): Panel[] =>
  new Array(size).fill(undefined).map((_, idx) => ({
    id: `${idx}`,
    userId: 'userId',
    title: faker.music.songName(),
    description: `${idx} 설명`,
    isArchived: faker.datatype.boolean(),
    scrapNum: faker.datatype.number({ min: 0, max: 100 }),
    createdAt: new Date(),
    deletedAt: null,
    updatedAt: new Date(),
  }));

// TODO: myPanelsData로 이름 수정하기
export const myPanelsData: Panel[] = createPanelList(20 * 3);
