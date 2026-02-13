import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const FieldWrapper = ({ children }: { children: React.ReactNode }) => {
  return <Wrapper>{children}</Wrapper>;
};
