import type { ChangeEvent, FormEvent, MouseEvent } from 'react';

import { useCallback, useRef, useState, useMemo } from 'react';

export interface InputConfig<T extends string> {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  validate?: (
    value: string,
    refs: Partial<Record<T, HTMLInputElement>>,
  ) => boolean;
  errorMessage?: string;
}

export interface FormConfig<T extends string> {
  onSubmit?: (
    data: Record<T, string>,
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>,
  ) => void;
}

export interface InputProps {
  name: string;
  ref: (ref: HTMLInputElement) => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export interface FormProps {
  ref: (ref: HTMLFormElement) => void;
  onSubmit?: (
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>,
  ) => void;
}

const DEFAULT_ERROR_MESSAGE = '유효한 입력값이 아닙니다.';

// TODO: 초기값을 전달받아 초기값과 사용자 입력값이 동일함을 나타내는 불 변수를 반환한다
export const useForm = <T extends string>({
  inputConfigs,
  formConfig = null,
}: {
  inputConfigs: Record<T, InputConfig<T>>;
  formConfig?: FormConfig<T> | null;
}): {
  inputProps: Partial<Record<T, InputProps>>;
  errors: Partial<Record<T, string | null>>;
  hasError: boolean;
  setError: (name: T, error: string | null) => void;
  formProps: Partial<FormProps>;
} => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const inputRefs = useRef<Partial<Record<T, HTMLInputElement>>>({});
  const [errors, setErrors] = useState<Partial<Record<T, string | null>>>({});

  const setError = useCallback(
    (name: T, error: string | null) => {
      if (errors[name] !== error)
        setErrors((prev) => ({ ...prev, [name]: error }));
    },
    [errors],
  );

  const inputProps: Partial<Record<T, InputProps>> = useMemo(() => {
    const names = Object.keys(inputConfigs) as T[];

    return names.reduce((acc, name) => {
      const { validate, onChange, errorMessage } = inputConfigs[name];

      const handleValidationError = (value: string): string | null => {
        const isValid = Boolean(
          !validate || validate(value, inputRefs.current),
        );
        return isValid ? null : errorMessage ?? DEFAULT_ERROR_MESSAGE;
      };

      const props: InputProps = {
        name,
        ref: (ref) => {
          inputRefs.current[name] = ref;
        },
        onChange: (e) => {
          onChange?.(e);
          setError(name, handleValidationError(e.currentTarget.value));
        },
      };

      return {
        ...acc,
        [name]: props,
      };
    }, {});
  }, [inputConfigs, setError]);

  // [NOTE]: input 값의 validation은 사용자가 해당 input에 Change 이벤트를 발생시킬 때,
  // 그리고 모든 input 값의 validation은 사용자가 Form에 Submit 이벤트를 발생시킬 때 실행된다.
  // 따라서, 최초로 렌더링되었을 때 validation은 실행되어있지 않으므로
  // errors는 에러 메시지를 저장하고 있지 않으며 hasError의 초기값은 반드시 false이다.
  // (최초로 렌더링된 input들에 에러 메시지를 띄우지 않기 위함이다)
  const hasError = useMemo(() => {
    const errorMessages = Object.values(errors);
    return errorMessages.some(
      (errorMessage) =>
        typeof errorMessage === 'string' && errorMessage.length > 0,
    );
  }, [errors]);

  const formProps: Partial<FormProps> = useMemo(() => {
    if (formConfig === null) return {};

    const { onSubmit } = formConfig;

    function handleSubmit(
      e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>,
    ): void {
      e.preventDefault();
      if (formRef.current === null) return;

      const formData = new FormData(formRef.current);
      const formDataRecord = Object.fromEntries(formData) as Record<T, string>;
      const formDataEntries = Object.entries(formDataRecord) as Array<
        [T, string]
      >;

      const isValidForm = formDataEntries.reduce((acc, [name, value]) => {
        const { validate, errorMessage } = inputConfigs[name];
        const isValid = Boolean(
          !validate || validate(value, inputRefs.current),
        );
        const error = isValid ? null : errorMessage ?? DEFAULT_ERROR_MESSAGE;
        setError(name, error);
        return acc && isValid;
      }, true);

      if (isValidForm) onSubmit?.(formDataRecord, e);
    }

    return {
      ref: (ref) => {
        formRef.current = ref;
      },
      onSubmit: handleSubmit,
    };
  }, [formConfig, inputConfigs, setError]);

  return { inputProps, errors, hasError, setError, formProps };
};
