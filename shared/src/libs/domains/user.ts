export interface User {
  id: string;
  username: string;
  password: string;
  nickname: string;
  provider: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
