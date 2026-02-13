import styled from 'styled-components';

const ErrorText = styled.span`
  font-size: 12px;
  color: var(--error);
`;

export const FieldError = ({ error }: { error?: string }) => {
  return <ErrorText>{error}</ErrorText>;
};
