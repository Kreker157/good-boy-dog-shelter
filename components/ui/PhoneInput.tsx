import { forwardRef } from 'react';
import styled from 'styled-components';
import { FieldWrapper } from './field/FieldWrapper';
import { FieldLabel } from './field/FieldLabel';
import { FieldError } from './field/FieldError';

interface Props {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

const PhoneRow = styled.div`
  display: flex;
  gap: 8px;
`;

const CountrySelect = styled.select`
  padding: 14px;
  border-radius: 12px;
  background: var(--background);
`;

const PhoneField = styled.input<{ $error?: boolean }>`
  flex: 1;
  padding: 14px 16px;
  border-radius: 12px;
  font-size: 14px;
  border: 1px solid ${({ $error }) => ($error ? 'var(--error)' : 'transparent')};
  background: white;
`;

export const PhoneInput = forwardRef<HTMLInputElement, Props>(
  ({ label, value, onChange, error }, ref) => {
    return (
      <FieldWrapper>
        {label && <FieldLabel label={label} />}

        <PhoneRow>
          <CountrySelect>
            <option value="+421">SK +421</option>
            <option value="+420">CZ +420</option>
          </CountrySelect>

          <PhoneField
            ref={ref}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder="123 321 123"
            $error={!!error}
          />
        </PhoneRow>

        {error && <FieldError error={error} />}
      </FieldWrapper>
    );
  },
);

PhoneInput.displayName = 'PhoneInput';
