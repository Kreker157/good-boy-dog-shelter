import { forwardRef, SelectHTMLAttributes } from 'react';
import styled from 'styled-components';
import { FieldWrapper } from './field/FieldWrapper';
import { FieldLabel } from './field/FieldLabel';
import { FieldError } from './field/FieldError';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

const StyledSelect = styled.select<{ $error?: boolean }>`
  width: 100%;
  padding: 16px 8px;
  border-radius: 16px;
  border: 1px solid ${({ $error }) => ($error ? 'var(--error)' : 'transparent')};
  background: var(--secondary);
  transition: 0.2s ease;
  appearance: none;

  &:focus {
    outline: none;
    border-color: ${({ $error }) =>
      $error ? 'var(--error)' : 'var(--primary)'};
  }
`;

export const Select = forwardRef<HTMLSelectElement, Props>(
  ({ label, error, children, ...props }, ref) => {
    return (
      <FieldWrapper>
        {label && <FieldLabel label={label} />}
        <StyledSelect ref={ref} $error={!!error} {...props}>
          {children}
        </StyledSelect>
        {error && <FieldError error={error} />}
      </FieldWrapper>
    );
  },
);

Select.displayName = 'Select';
