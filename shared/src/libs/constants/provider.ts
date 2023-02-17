export const PROVIDER = {
  LOCAL: 'LOCAL',
  KAKAO: 'KAKAO',
  GOOGLE: 'GOOGLE'
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type PROVIDER = (typeof PROVIDER)[keyof typeof PROVIDER];
