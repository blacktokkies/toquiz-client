import type { Answer } from '@/lib/api/answer';
import type { Panel } from '@/lib/api/panel';
import type { Question } from '@/lib/api/question';
import type { StompSubscription } from '@stomp/stompjs';

import { Client } from '@stomp/stompjs';

export class SocketClient extends Client {
  subscribePanel(
    panelId: Panel['sid'],
    callback: (event: SocketEvent) => void,
  ): StompSubscription {
    return super.subscribe(`/sub/panels/${panelId}`, (message) => {
      const event = JSON.parse(message.body) as SocketEvent;
      callback(event);
    });
  }

  publishToPanel<T extends SocketEvent>(panelId: Panel['sid'], event: T): void {
    super.publish({
      destination: `/pub/panels/${panelId}`,
      body: JSON.stringify(event),
    });
  }
}

export type SocketEvent =
  | CreateQuestionEvent
  | LikeQuestionEvent
  | CreateAnswerEvent;
export interface CreateQuestionEvent {
  eventType: 'CREATE_QUESTION';
  data: Question;
}
export interface LikeQuestionEvent {
  eventType: 'LIKE_QUESTION';
  data: {
    questionId: Question['id'];
    likeNum: Question['likeNum'];
  };
}
export interface CreateAnswerEvent {
  eventType: 'CREATE_ANSWER';
  data: {
    questionId: Question['id'];
    answer: Answer;
  };
}
