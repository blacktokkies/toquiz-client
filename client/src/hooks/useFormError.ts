import type { ChangeEvent, ChangeEventHandler } from 'react';

import { useRef, useState, useMemo } from 'react';

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
}

interface UseFormErrorReturn<T extends string> {
  inputProps: Partial<Record<T, FormInputProps>>;
  errors: Partial<Record<T, string | null>>;
}

const DEFAULT_ERROR_MESSAGE = '유효한 입력값이 아닙니다.';
export const useFormError = <T extends string>({
  form,
}: UseFormErrorParams<T>): UseFormErrorReturn<T> => {
  const [errors, setErrors] = useState<Partial<Record<T, string | null>>>({});

  const inputRefs = useRef<Partial<Record<T, HTMLInputElement>>>({});

  const inputProps = useMemo(() => {
    const props: Partial<Record<T, FormInputProps>> = {};

    const inputNames = Object.keys(form) as T[];
    inputNames.forEach((inputName) => {
      const inputConfig = form[inputName];
      const { validate, onChange } = inputConfig;
      const handleValidation = (value: string): void => {
        if (!validate) return;

        const isValid = validate(value, inputRefs.current);
        const errorMessage = isValid
          ? null
          : inputConfig.errorMessage ?? DEFAULT_ERROR_MESSAGE;

        if (errors[inputName] !== errorMessage)
          setErrors((prev) => ({ ...prev, [inputName]: errorMessage }));
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
  return { inputProps, errors };
};
