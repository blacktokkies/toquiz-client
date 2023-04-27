import type { Panel } from 'shared';

import { faker } from '@faker-js/faker';

export const myPanelData: Panel[] = new Array(20)
  .fill(undefined)
  .map((_, idx) => ({
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
