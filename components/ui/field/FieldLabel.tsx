'use client';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: var(--text-title);
`;

const Required = styled.span`
  color: var(--disabled);
`;

export const FieldLabel = ({
  label,
  required = true,
}: {
  label?: string;
  required?: boolean;
}) => {
  const { t } = useTranslation();
  const requiredText = required ? '' : t('optional');

  return (
    <Label>
      {label} {requiredText && <Required>({requiredText})</Required>}
    </Label>
  );
};
