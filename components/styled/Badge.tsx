import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { theme } from './theme';

interface BadgeProps {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success';
  size?: 'sm' | 'md';
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
    case 'success':
      return css`
        background: ${theme.colors.success};
        color: white;
        border: 1px solid ${theme.colors.success};
      `;
    default:
      return css``;
  }
};

export const Badge = styled.span<BadgeProps>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: ${props => props.size === 'sm' ? '0.125rem 0.5rem' : '0.25rem 0.75rem'};
  font-size: ${props => props.size === 'sm' ? '0.75rem' : '0.875rem'};
  font-weight: 500;
  border-radius: ${theme.borderRadius.full};
  white-space: nowrap;
  
  ${props => getVariantStyles(props.variant)}
`;