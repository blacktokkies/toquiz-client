import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { useForm } from '@/hooks/useForm';

const handleChange = vi.fn();
const isValid = vi.fn();
const handleSubmit = vi.fn();

function TestComponent(): JSX.Element {
  const { inputProps, errors, hasError, formProps } = useForm({
    inputConfigs: {
      test: {
        onChange: handleChange,
        validate: isValid,
        errorMessage: '에러 메시지',
      },
    },
    formConfig: {
      onSubmit: handleSubmit,
    },
  });

  return (
    <form aria-label="테스트 폼" {...formProps}>
      <input aria-label="테스트 인풋" {...inputProps.test} />
      <div>{errors.test}</div>
      <div>{hasError && '유효하지 않은 input이 있다'}</div>
    </form>
  );
}

describe('useForm', () => {
  it('사용자가 값을 입력할 때마다 해당 input의 onChange와 validate 함수가 실행된다', () => {
    const { input } = setup();
    fireEvent.change(input, { target: { value: '1' } });
    fireEvent.change(input, { target: { value: '2' } });

    expect(handleChange).toHaveBeenCalledTimes(2);
    expect(isValid).toHaveBeenCalledTimes(2);
  });

  describe('input의 validate 함수가 실행되어', () => {
    it('true를 반환하면 errors[인풋이름]은 null을 저장한다', () => {
      isValid.mockImplementation(() => true);
      const { input } = setup();
      fireEvent.change(input, { target: { value: '값' } });

      expect(screen.queryByText(/에러 메시지/)).not.toBeInTheDocument();
    });

    it('false를 반환하면 errors[인풋이름]은 에러 메시지를 저장한다.', () => {
      isValid.mockImplementation(() => false);
      const { input } = setup();
      fireEvent.change(input, { target: { value: '값' } });

      expect(screen.getByText(/에러 메시지/)).toBeInTheDocument();
    });
  });

  describe('hasError는', () => {
    it('모든 input에 에러가 없으면 false이다', () => {
      isValid.mockImplementation(() => true);
      const { input } = setup();
      fireEvent.change(input, { target: { value: '값' } });

      expect(
        screen.queryByText(/유효하지 않은 input이 있다/),
      ).not.toBeInTheDocument();
    });

    it('input 중 하나라도 에러가 있으면 true이다', () => {
      isValid.mockImplementation(() => false);
      const { input } = setup();
      fireEvent.change(input, { target: { value: '값' } });

      expect(
        screen.getByText(/유효하지 않은 input이 있다/),
      ).toBeInTheDocument();
    });
  });

  describe('onSubmit은', () => {
    it('모든 input에 validation 오류가 없으면 onSubmit은 실행된다', () => {
      isValid.mockImplementation(() => true);
      const { form } = setup();
      fireEvent.submit(form);

      expect(handleSubmit).toHaveBeenCalled();
    });

    it('input 중 하나라도 validation 오류가 있으면 실행되지 않는다', () => {
      isValid.mockImplementation(() => false);
      const { form } = setup();
      fireEvent.submit(form);

      expect(handleSubmit).not.toHaveBeenCalled();
    });
  });
});

function setup(): {
  input: HTMLElement;
  form: HTMLElement;
} {
  render(<TestComponent />);

  const input = screen.getByRole('textbox', { name: '테스트 인풋' });
  const form = screen.getByRole('form', { name: '테스트 폼' });

  return { input, form };
}
