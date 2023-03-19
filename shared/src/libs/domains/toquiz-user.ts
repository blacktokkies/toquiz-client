interface Panel {
  panelId: string;
  likes: string[];
  questions: string[];
}

export interface ToquizUser {
  id: string;
  userId: string | null;
  panels: Panel[];
  createdAt: Date;
  updatedAt: Date;
}
