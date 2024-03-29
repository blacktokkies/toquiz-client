import type { Panel } from './api/panel';
import type { GetQuestionsParams, Question } from './api/question';

const authQueryKey = {
  signup: () => ['signup'] as const,
  login: () => ['login'] as const,
  logout: () => ['logout'] as const,
  update: () => ['updateMyInfo'] as const,
  resign: () => ['resign'] as const,
} as const;

const panelQueryKey = {
  all: ['panels'] as const,
  lists: () => [...panelQueryKey.all, 'list'] as const,
  create: () => ['createPanel'] as const,
  update: () => ['updatePanel'] as const,
  delete: () => ['deletePanel'] as const,
  details: () => [...panelQueryKey.all, 'detail'] as const,
  detail: (panelId: Panel['sid']) =>
    [...panelQueryKey.details(), panelId] as const,
} as const;

const activeInfoQueryKeys = {
  all: ['activeInfos'] as const,
  details: () => [...activeInfoQueryKeys.all, 'details'],
  detail: (panelId: Panel['sid']) => [
    ...activeInfoQueryKeys.details(),
    panelId,
  ],
};

const questionQuerykey = {
  all: ['questions'] as const,
  lists: () => [...questionQuerykey.all, 'list'] as const,
  list: (panelId: Panel['sid'], sort: GetQuestionsParams['sort'] = undefined) =>
    [...questionQuerykey.lists(), panelId, { sort }] as const,
  create: () => ['createQuestion'] as const,
  like: () => ['likeQuestion'] as const,
};

const answerQueryKeys = {
  all: ['answers'] as const,
  lists: () => [...answerQueryKeys.all, 'list'] as const,
  list: (questionId: Question['id']) =>
    [...answerQueryKeys.lists(), questionId] as const,
  create: () => ['createAnswer'] as const,
};

export const queryKey = {
  auth: authQueryKey,
  panel: panelQueryKey,
  question: questionQuerykey,
  answer: answerQueryKeys,
  activeInfo: activeInfoQueryKeys,
};
