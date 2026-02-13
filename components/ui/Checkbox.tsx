import styled from 'styled-components';
import { forwardRef, InputHTMLAttributes } from 'react';
import { FieldWrapper } from './field/FieldWrapper';
import { FieldError } from './field/FieldError';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  cursor: pointer;
`;

const StyledCheckbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: var(--primary);
`;

export const Checkbox = forwardRef<HTMLInputElement, Props>(
  ({ label, error, ...props }, ref) => {
    return (
      <FieldWrapper>
        <CheckboxRow>
          <StyledCheckbox ref={ref} type="checkbox" {...props} />
          {label}
        </CheckboxRow>

        {error && <FieldError error={error} />}
      </FieldWrapper>
    );
  },
);

Checkbox.displayName = 'Checkbox';
