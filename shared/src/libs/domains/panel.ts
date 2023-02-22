export interface Panel {
  id: string;
  userId: string;
  title: string;
  description: string;
  isArchived: boolean;
  scrapNum: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
