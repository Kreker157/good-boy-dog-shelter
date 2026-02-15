'use client';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const ErrorText = styled.span`
  font-size: 12px;
  color: var(--error);
`;

export const FieldError = ({ error }: { error?: string }) => {
  const { t } = useTranslation();
  return <ErrorText>{error ? t(error) : ''}</ErrorText>;
};
