import React from 'react';
import styled from 'styled-components';

const Label = styled.label`
  font-size: 14px;
  color: var(--secondary-text);
`;

export const FieldLabel = ({ label }: { label?: string }) => {
  return <Label>{label}</Label>;
};
