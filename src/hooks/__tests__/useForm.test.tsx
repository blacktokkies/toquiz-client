/* eslint-disable testing-library/no-container, testing-library/no-node-access, @typescript-eslint/no-explicit-any */
import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { useForm } from '@/hooks/useForm';

describe('useForm', () => {
  it('input 값이 변경될 때마다 해당 input의 onChange와 validate 함수가 실행된다', () => {
    const handleChange = vi.fn();
    const isValid = vi.fn();

    function TestComponent(): JSX.Element {
      const { inputProps } = useForm({
        inputConfigs: {
          test: {
            onChange: handleChange,
            validate: isValid,
          },
        },
      });

      return <input {...inputProps.test} />;
    }

    render(<TestComponent />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new' } });

    expect(handleChange).toHaveBeenCalled();
    expect(isValid).toHaveBeenCalled();
  });

  describe('input의 valiate 함수가 실행될 때', () => {
    function TestComponent({
      isValid,
    }: {
      isValid: (...args: any[]) => boolean;
    }): JSX.Element {
      const { inputProps, errors } = useForm({
        inputConfigs: {
          test: {
            validate: isValid,
            errorMessage: '에러 메시지',
          },
        },
      });

      return (
        <>
          <input {...inputProps.test} />
          <div>{errors.test}</div>
        </>
      );
    }
    it('true를 반환하면 errors[input]은 errorMessage를 저장한다', () => {
      const isValid = vi.fn().mockImplementation(() => true);
      render(<TestComponent isValid={isValid} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'new' } });

      expect(screen.queryByText(/에러 메시지/)).not.toBeInTheDocument();
    });

    it('false를 반환하면 errors[input]은 errorMessage를 null을 저장한다.', () => {
      const isValid = vi.fn().mockImplementation(() => false);
      render(<TestComponent isValid={isValid} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'new' } });

      expect(screen.getByText(/에러 메시지/)).toBeInTheDocument();
    });
  });

  describe('hasError는', () => {
    function TestComponent({
      isValid,
    }: {
      isValid: (...args: any[]) => boolean;
    }): JSX.Element {
      const { inputProps, hasError } = useForm({
        inputConfigs: {
          test: {
            validate: isValid,
            errorMessage: '에러 메시지',
          },
        },
      });

      return (
        <>
          <input {...inputProps.test} />
          {hasError && '유효하지 않은 input이 있다'}
        </>
      );
    }

    it('input에 validation 오류가 없으면 false이다', () => {
      const isValid = vi.fn().mockImplementation(() => true);
      render(<TestComponent isValid={isValid} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'new' } });

      expect(
        screen.queryByText(/유효하지 않은 input이 있다/),
      ).not.toBeInTheDocument();
    });

    it('input 중 하나라도 validation 오류가 있으면 true이다', () => {
      const isValid = vi.fn().mockImplementation(() => false);
      render(<TestComponent isValid={isValid} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'new' } });

      expect(
        screen.getByText(/유효하지 않은 input이 있다/),
      ).toBeInTheDocument();
    });
  });

  describe('onSubmit은', () => {
    const handleSubmit = vi.fn();
    function TestComponent({
      isValid,
    }: {
      isValid: (...args: any[]) => boolean;
    }): JSX.Element {
      const { inputProps, formProps } = useForm({
        inputConfigs: {
          test: {
            validate: isValid,
          },
        },
        formConfig: {
          onSubmit: handleSubmit,
        },
      });

      return (
        <form {...formProps}>
          <input {...inputProps.test} />
        </form>
      );
    }

    it('input 중 하나라도 validation 오류가 있으면 실행되지 않는다', () => {
      const isValid = vi.fn().mockImplementation(() => false);
      const { container } = render(<TestComponent isValid={isValid} />);

      const form = container.getElementsByTagName('form')[0];
      fireEvent.submit(form);

      expect(handleSubmit).not.toHaveBeenCalled();
    });

    it('모든 input에 validation 오류가 없으면 onSubmit은 실행된다', () => {
      const isValid = vi.fn().mockImplementation(() => true);
      const { container } = render(<TestComponent isValid={isValid} />);

      const form = container.getElementsByTagName('form')[0];
      fireEvent.submit(form);

      expect(handleSubmit).toHaveBeenCalled();
    });
  });
});
