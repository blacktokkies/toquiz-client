import emailValidator from 'validator/lib/isEmail';

export type Validator = (value: string) => boolean;

export const isNickname: Validator = (value) => /^.+$/.test(value.trim());
export const isEmail: Validator = (value) => emailValidator(value);
