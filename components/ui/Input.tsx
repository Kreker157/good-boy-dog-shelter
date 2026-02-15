import { forwardRef, InputHTMLAttributes } from 'react';
import styled from 'styled-components';
import { FieldWrapper } from './field/FieldWrapper';
import { FieldLabel } from './field/FieldLabel';
import { FieldError } from './field/FieldError';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const StyledInput = styled.input<{ $error?: boolean }>`
  width: 100%;
  height: 56px;
  padding: 16px 8px;
  border-radius: 16px;
  background: var(--secondary);
  border: 1px solid ${({ $error }) => ($error ? 'var(--error)' : 'transparent')};
  color: var(--text-secondary);
  font-size: 16px;
  font-weight: 500;

  &:focus {
    outline: none;
    border-color: ${({ $error }) =>
      $error ? 'var(--error)' : 'var(--primary)'};
  }

  &::placeholder {
    color: var(--placeholder);
    font-size: 16px;
    font-weight: 400;
  }

  &[type='number'] {
    -moz-appearance: textfield;
  }
  &[type='number']::-webkit-outer-spin-button,
  &[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, ...props }, ref) => {
    return (
      <FieldWrapper>
        {label && <FieldLabel label={label} />}
        <StyledInput ref={ref} $error={!!error} {...props} />
        {error && <FieldError error={error} />}
      </FieldWrapper>
    );
  },
);

Input.displayName = 'Input';
