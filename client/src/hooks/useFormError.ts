import type {
  ChangeEvent,
  ChangeEventHandler,
  FormEvent,
  FormEventHandler,
} from 'react';

import { useCallback, useRef, useState, useMemo } from 'react';

export interface FormInputConfig<T extends string> {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  validate?: (
    value: string,
    refs: Partial<Record<T, HTMLInputElement>>,
  ) => boolean;
  errorMessage?: string;
}

export interface FormInputProps {
  onChange: ChangeEventHandler<HTMLInputElement>;
  ref: (ref: HTMLInputElement) => void;
}

interface UseFormErrorParams<T extends string> {
  form: Record<T, FormInputConfig<T>>;
  onSubmit?: FormEventHandler<HTMLFormElement>;
}

type HandleSubmit<T extends string> = (
  onSubmit: (data: Record<T, string>, e: FormEvent<HTMLFormElement>) => void,
) => FormEventHandler<HTMLFormElement>;

interface UseFormErrorReturn<T extends string> {
  inputProps: Partial<Record<T, FormInputProps>>;
  handleSubmit: HandleSubmit<T>;
  errors: Partial<Record<T, string | null>>;
}

const DEFAULT_ERROR_MESSAGE = '유효한 입력값이 아닙니다.';
export const useFormError = <T extends string>({
  form,
  onSubmit,
}: UseFormErrorParams<T>): UseFormErrorReturn<T> => {
  const [errors, setErrors] = useState<Partial<Record<T, string | null>>>({});

  const inputRefs = useRef<Partial<Record<T, HTMLInputElement>>>({});

  const inputProps = useMemo(() => {
    const props: Partial<Record<T, FormInputProps>> = {};

    const inputNames = Object.keys(form) as T[];
    inputNames.forEach((inputName) => {
      const inputConfig = form[inputName];
      const { validate, onChange, errorMessage } = inputConfig;
      const handleValidation = (value: string): void => {
        if (!validate) return;

        const isValid = validate(value, inputRefs.current);
        const error = isValid ? null : errorMessage ?? DEFAULT_ERROR_MESSAGE;

        if (errors[inputName] !== error)
          setErrors((prev) => ({ ...prev, [inputName]: error }));
      };

      props[inputName] = {
        onChange: (e) => {
          onChange?.(e);
          handleValidation(e.currentTarget.value);
        },
        ref: (ref) => {
          inputRefs.current[inputName] = ref;
        },
      };
    });
    return props;
  }, [form, errors]);

  const handleSubmit = useCallback(
    (
        onSubmit: (
          data: Record<T, string>,
          e: FormEvent<HTMLFormElement>,
        ) => void,
      ) =>
      (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const formDataRecord = Object.fromEntries(formData) as Record<
          T,
          string
        >;
        const formDataEntries = Object.entries(formDataRecord) as Array<
          [T, string]
        >;

        let isValidAll = true;
        formDataEntries.forEach(([name, value]) => {
          const { validate, errorMessage } = form[name];
          const isValid = validate?.(value, inputRefs.current);
          if (isValid === false) isValidAll = false;

          const error = isValid ? null : errorMessage ?? DEFAULT_ERROR_MESSAGE;
          if (errors[name] !== error)
            setErrors((prev) => ({ ...prev, [name]: error }));
        });

        if (isValidAll) {
          const data = formDataEntries.reduce(
            (acc, [value, name]) => ({ ...acc, [value]: name }),
            {},
          ) as Record<T, string>;
          onSubmit?.(data, e);
        }
      },
    [errors, form],
  );

  return { inputProps, errors, handleSubmit };
};
