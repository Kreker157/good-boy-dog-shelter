'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { FieldWrapper } from './field/FieldWrapper';
import { FieldLabel } from './field/FieldLabel';
import { FieldError } from './field/FieldError';

export type SelectOption = {
  value: string;
  label: string;
};

interface Props {
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
}

const Trigger = styled.button<{ $error?: boolean; $disabled?: boolean }>`
  width: 100%;
  height: 56px;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid ${({ $error }) => ($error ? 'var(--error)' : 'transparent')};
  background: var(--secondary);
  transition: 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
  color: var(--placeholder);
  font-size: 16px;
  font-weight: 400;

  &:focus {
    outline: none;
    border-color: ${({ $error }) =>
      $error ? 'var(--error)' : 'var(--primary)'};
  }
`;

const ValueText = styled.span<{ $placeholder?: boolean }>`
  color: ${({ $placeholder }) =>
    $placeholder ? 'var(--placeholder)' : 'var(--text-secondary)'};
`;

const Arrow = styled.span`
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 7px solid var(--text-secondary);
`;

const Menu = styled.div`
  position: absolute;
  z-index: 50;
  margin-top: 8px;
  width: 100%;
  max-height: 250px;
  border-radius: 14px;
  background: white;
  border: 1px solid var(--border);
  overflow: auto;
`;

const MenuItem = styled.button<{ $active?: boolean }>`
  width: 100%;
  max-height: 200px;
  border: 0;
  background: ${({ $active }) =>
    $active ? 'var(--hover-background)' : 'transparent'};
  cursor: pointer;
  padding: 12px 12px;
  display: flex;
  align-items: center;
  color: var(--text-secondary);

  &:hover {
    background: var(--hover-background);
  }
`;

const MenuText = styled.span`
  font-size: 14px;
  color: var(--text-secondary);
`;

export function Select({
  label,
  error,
  required,
  disabled,
  value,
  onChange,
  options,
  placeholder = '—',
}: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const selectedLabel = useMemo(() => {
    const found = options?.find((o) => o.value === value);
    return found?.label ?? '';
  }, [options, value]);

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
      {label && <FieldLabel label={label} required={required} />}

      <div ref={wrapRef} style={{ position: 'relative' }}>
        <Trigger
          type="button"
          $error={!!error}
          $disabled={disabled}
          onClick={() => !disabled && setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-disabled={disabled}
        >
          <ValueText $placeholder={!value}>
            {value ? selectedLabel : placeholder}
          </ValueText>
          <Arrow />
        </Trigger>

        {open && !disabled && (
          <Menu role="listbox">
            <MenuItem
              type="button"
              $active={!value}
              onClick={() => {
                onChange('');
                setOpen(false);
              }}
            >
              <MenuText>{placeholder}</MenuText>
            </MenuItem>

            {options.map((opt) => (
              <MenuItem
                key={opt.value}
                type="button"
                $active={opt.value === value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                <MenuText>{opt.label}</MenuText>
              </MenuItem>
            ))}
          </Menu>
        )}
      </div>

      {error && <FieldError error={error} />}
    </FieldWrapper>
  );
}
