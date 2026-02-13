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
  transition: 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ $error }) => ($error ? 'var(--error)' : 'transparent')};
  }

  &::placeholder {
    color: var(--placeholder);
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
