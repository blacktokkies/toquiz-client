export type Validator = (value: string) => boolean;

export const isNickname: Validator = (value) => /^.+$/.test(value.trim());
