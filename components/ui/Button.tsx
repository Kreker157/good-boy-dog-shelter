import styled from 'styled-components';
import { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
  size?: Size;
  children: React.ReactNode;
}

type Variant = 'primary' | 'secondary';
type Size = 'xl' | 'lg' | 'md' | 'sm';

const StyledButton = styled.button<{
  $variant: Variant;
  $fullWidth?: boolean;
  $size?: Size;
}>`
  border-radius: 8px;
  font-weight: 500;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  border: none;
  cursor: pointer;
  ${({ $variant }) =>
    $variant === 'primary'
      ? `
    background-color: var(--primary);
    color: var(--text-primary);`
      : `
    background-color: var(--secondary);
    color: var(--text-secondary);`}
  ${({ $size }) => {
    switch ($size) {
      case 'xl':
        return `
        padding: 16px 32px;
        font-size: 16px;
        height: 56px;
      `;
      case 'lg':
        return `
        padding: 12px 24px;
        font-size: 16px;
        height: 48px;
      `;
      case 'md':
        return `
        padding: 4px 16px;
        font-size: 16px;
        height: 32px;
      `;
      case 'sm':
        return `
        padding: 2px 8px;
        font-size: 14px;
        height: 24px;
      `;
      default:
        return '';
    }
  }};
`;

export const Button = ({
  variant = 'primary',
  fullWidth = false,
  size = 'md',
  children,
  ...props
}: Props) => {
  return (
    <StyledButton
      $variant={variant}
      $fullWidth={fullWidth}
      $size={size}
      {...props}
    >
      {children}
    </StyledButton>
  );
};
