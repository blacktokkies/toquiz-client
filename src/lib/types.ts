export type NonNullableKeys<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
};
