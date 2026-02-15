import styled from 'styled-components';
import { forwardRef, InputHTMLAttributes } from 'react';
import { FieldWrapper } from './field/FieldWrapper';
import { FieldError } from './field/FieldError';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const CheckboxRow = styled.label<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  user-select: none;
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
`;

const HiddenCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  pointer-events: none;
`;

const CheckIcon = styled.svg`
  width: 14px;
  height: 14px;
  display: block;
`;

const LabelText = styled.span`
  color: var(--text);
`;

const Box = styled.span<{ $error?: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 2px solid
    ${({ $error }) => ($error ? 'var(--error)' : 'var(--primary)')};
  background: transparent;
  display: grid;
  place-items: center;
  transition: 0.15s ease;

  svg {
    opacity: 0;
    transition: 0.15s ease;
  }
`;

const Visual = styled.span<{ $disabled?: boolean; $error?: boolean }>`
  display: inline-flex;
  align-items: center;

  ${CheckboxRow}:focus-within & ${Box} {
    box-shadow: 0 0 0 3px rgba(110, 86, 207, 0.18);
  }

  ${HiddenCheckbox}:checked + & ${Box} svg {
    opacity: 1;
  }

  ${HiddenCheckbox}:disabled + & ${Box} {
    opacity: 0.7;
  }
`;

export const Checkbox = forwardRef<HTMLInputElement, Props>(
  ({ label, error, disabled, ...props }, ref) => {
    return (
      <FieldWrapper>
        <CheckboxRow $disabled={disabled}>
          <HiddenCheckbox
            ref={ref}
            type="checkbox"
            disabled={disabled}
            {...props}
          />

          <Visual $disabled={disabled} $error={!!error}>
            <Box $error={!!error}>
              <CheckIcon viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M20 6L9 17l-5-5"
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </CheckIcon>
            </Box>
          </Visual>

          <LabelText>{label}</LabelText>
        </CheckboxRow>

        {error && <FieldError error={error} />}
      </FieldWrapper>
    );
  },
);

Checkbox.displayName = 'Checkbox';
