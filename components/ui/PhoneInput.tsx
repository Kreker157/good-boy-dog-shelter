'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FieldWrapper } from './field/FieldWrapper';
import { FieldLabel } from './field/FieldLabel';
import { FieldError } from './field/FieldError';

type Country = 'SK' | 'CZ';
type Prefix = '+421' | '+420';

type Props = {
  label?: string;

  country: Prefix;
  onCountryChange: (c: Prefix) => void;

  numberValue: string;
  onNumberChange: (v: string) => void;

  error?: string;
  placeholder?: string;
  disabled?: boolean;
};

const Row = styled.div`
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 12px;
  align-items: center;
`;

const FlagBtn = styled.button<{ $error?: boolean; $disabled?: boolean }>`
  height: 56px;
  width: 56px;
  border-radius: 16px;
  border: 1px solid ${({ $error }) => ($error ? 'var(--error)' : 'transparent')};
  background: var(--secondary);
  display: grid;
  place-items: center;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
  transition: 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ $error }) =>
      $error ? 'var(--error)' : 'var(--primary)'};
  }
`;

const PhoneField = styled.div<{ $error?: boolean; $disabled?: boolean }>`
  height: 56px;
  border-radius: 16px;
  background: var(--secondary);
  border: 1px solid ${({ $error }) => ($error ? 'var(--error)' : 'transparent')};
  display: grid;
  grid-template-columns: 58px 1fr;
  overflow: hidden;
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};

  &:focus-within {
    border-color: ${({ $error }) =>
      $error ? 'var(--error)' : 'var(--primary)'};
  }
`;

const PrefixInput = styled.input`
  border: 0;
  outline: none;
  background: transparent;
  padding: 16px 0 16px 16px;
  font-size: 16px;
  color: var(--text-secondary);
`;

const NumberInput = styled.input<{ $hasValue?: boolean }>`
  border: 0;
  outline: none;
  background: transparent;
  padding: 16px 16px 16px 0;
  font-size: 16px;
  color: ${({ $hasValue }) =>
    $hasValue ? 'var(--text-secondary)' : 'var(--placeholder)'};
  &::placeholder {
    color: var(--placeholder);
    font-size: 16px;
    font-weight: 400;
  }
`;

const Menu = styled.div`
  position: absolute;
  z-index: 50;
  margin-top: 8px;
  width: 220px;
  border-radius: 14px;
  background: white;
  border: 1px solid var(--border);
  overflow: hidden;
`;

const MenuItem = styled.button`
  width: 100%;
  border: 0;
  background: transparent;
  cursor: pointer;
  padding: 12px 12px;
  display: flex;
  align-items: center;
  gap: 10px;

  &:hover {
    background: var(--hover-background);
  }
`;

const MenuText = styled.span<{ $placeholder?: boolean }>`
  font-size: 14px;
  color: ${({ $placeholder }) =>
    $placeholder ? 'var(--placeholder)' : 'var(--text-secondary)'};
`;

function countryFromPrefix(prefix: Prefix): Country {
  return prefix === '+421' ? 'SK' : 'CZ';
}

function prefixFromCountry(country: Country): Prefix {
  return country === 'SK' ? '+421' : '+420';
}

const flagSrc: Record<Country, string> = {
  SK: '/icons/slovakia.png',
  CZ: '/icons/czech-republic.png',
};

export function PhoneInput({
  label,
  country,
  onCountryChange,
  numberValue,
  onNumberChange,
  error,
  placeholder = '123 321 123',
  disabled,
}: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const selectedCountry = useMemo(() => countryFromPrefix(country), [country]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <FieldWrapper>
      {label && <FieldLabel label={label} />}

      <div ref={wrapRef} style={{ position: 'relative' }}>
        <Row>
          <FlagBtn
            type="button"
            $error={!!error}
            $disabled={disabled}
            aria-label={t('donation.phone.countryAria')}
            onClick={() => !disabled && setOpen((v) => !v)}
          >
            <Image
              src={flagSrc[selectedCountry]}
              alt={selectedCountry}
              width={20}
              height={20}
              style={{ borderRadius: 4 }}
            />
          </FlagBtn>

          <PhoneField $error={!!error} $disabled={disabled}>
            <PrefixInput value={country} disabled />
            <NumberInput
              disabled={disabled}
              value={numberValue}
              placeholder={placeholder}
              inputMode="numeric"
              $hasValue={!!numberValue}
              onChange={(e) => {
                const next = e.target.value.replace(/[^\d ]/g, '');
                onNumberChange(next);
              }}
            />
          </PhoneField>
        </Row>

        {open && !disabled && (
          <Menu role="menu" aria-label={t('donation.phone.menuAria')}>
            {(['SK', 'CZ'] as const).map((c) => (
              <MenuItem
                type="button"
                key={c}
                onClick={() => {
                  onCountryChange(prefixFromCountry(c));
                  setOpen(false);
                }}
              >
                <Image
                  src={flagSrc[c]}
                  alt={c}
                  width={20}
                  height={20}
                  style={{ borderRadius: 4 }}
                />
                <MenuText $placeholder={false}>
                  {c === 'SK' ? t('slovakia') : t('czechRepublic')}
                </MenuText>
              </MenuItem>
            ))}
          </Menu>
        )}
      </div>

      {error && <FieldError error={error} />}
    </FieldWrapper>
  );
}
