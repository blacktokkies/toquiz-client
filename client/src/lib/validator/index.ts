import emailValidator from 'validator/lib/isEmail';

export type Validator = (value: string) => boolean;

export const isNickname: Validator = (value) => /^.+$/.test(value.trim());
export const isEmail: Validator = (value) => emailValidator(value);
export const isPassword: Validator = (value) =>
  /^(?=\S*[a-zA-z])(?=\S*[0-9])(?=\S*[$`~!@$!%*#^?&\\(\\)\-_=+])\S{8,20}$/.test(
    value,
  );
