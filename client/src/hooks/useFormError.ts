import type { ChangeEvent, ChangeEventHandler } from 'react';

import { useState, useMemo } from 'react';

export interface FormInputConfig {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  validate?: (value: string) => boolean;
  errorMessage?: string;
}

export interface FormInputProps {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

interface UseFormErrorParams<T extends string> {
  form: Record<T, FormInputConfig>;
}

interface UseFormErrorReturn<T extends string> {
  handleChangeWithValidation: Partial<
    Record<T, ChangeEventHandler<HTMLInputElement>>
  >;
  errors: Partial<Record<T, string | null>>;
}

export const useFormError = <T extends string>({
  form,
}: UseFormErrorParams<T>): UseFormErrorReturn<T> => {
  const [errors, setErrors] = useState<Partial<Record<T, string | null>>>({});

  const handleChangeWithValidation = useMemo(() => {
    const handlers: Partial<Record<T, ChangeEventHandler<HTMLInputElement>>> =
      {};

    const inputNames = Object.keys(form) as T[];
    inputNames.forEach((inputName) => {
      const inputConfig = form[inputName];
      const { validate, onChange } = inputConfig;
      const handleValidation = (value: string): void => {
        if (!validate) return;

        const isValid = validate(value);
        const errorMessage = isValid
          ? null
          : inputConfig.errorMessage ?? '유효한 입력값이 아닙니다.';

        if (errors[inputName] !== errorMessage)
          setErrors((prev) => ({ ...prev, [inputName]: errorMessage }));
      };

      handlers[inputName] = (e) => {
        onChange?.(e);
        handleValidation(e.currentTarget.value);
      };
    });
    return handlers;
  }, [form, errors]);
  return { handleChangeWithValidation, errors };
};
