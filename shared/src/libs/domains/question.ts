export interface Question {
  id: string;
  panelId: string;
  toquizUserId: string;
  content: string;
  answerNum: number;
  likeNum: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
