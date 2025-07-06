import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { theme } from './theme';

interface BadgeProps {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
}

const getVariantStyles = (variant: string = 'default') => {
  switch (variant) {
    case 'default':
      return css`
        background: ${theme.colors.primary};
        color: white;
        border: 1px solid ${theme.colors.primary};
      `;
    case 'secondary':
      return css`
        background: ${theme.colors.surface};
        color: ${theme.colors.text};
        border: 1px solid ${theme.colors.border};
      `;
    case 'outline':
      return css`
        background: transparent;
        color: ${theme.colors.text};
        border: 1px solid ${theme.colors.border};
      `;
    case 'destructive':
      return css`
        background: ${theme.colors.error};
        color: white;
        border: 1px solid ${theme.colors.error};
      `;
    default:
      return css``;
  }
};

const getSizeStyles = (size: string = 'md') => {
  switch (size) {
    case 'sm':
      return css`
        padding: 0.125rem 0.375rem;
        font-size: 0.75rem;
        border-radius: ${theme.borderRadius.sm};
      `;
    case 'md':
      return css`
        padding: 0.25rem 0.5rem;
        font-size: 0.875rem;
        border-radius: ${theme.borderRadius.md};
      `;
    case 'lg':
      return css`
        padding: 0.375rem 0.75rem;
        font-size: 1rem;
        border-radius: ${theme.borderRadius.lg};
      `;
    default:
      return css``;
  }
};

export const Badge = styled.span<BadgeProps>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 500;
  white-space: nowrap;
  
  ${props => getVariantStyles(props.variant)}
  ${props => getSizeStyles(props.size)}
`;