import emailValidator from 'validator/lib/isEmail';

export type Validator = (value: string) => boolean;

export const isNickname: Validator = (value) => /^.{2,20}$/.test(value.trim());
export const isEmail: Validator = (value) => emailValidator(value);
export const isPassword: Validator = (value) =>
  /^(?=\S*[a-zA-z])(?=\S*[0-9])(?=\S*[$`~!@$!%*#^?&\\(\\)\-_=+])\S{8,20}$/.test(
    value,
  );
export const isPanelTitle: Validator = (value) =>
  /^.{3,40}$/.test(value.trim());
