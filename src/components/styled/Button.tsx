import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { theme } from './theme';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
}

const getButtonStyles = (variant: string = 'primary') => {
  switch (variant) {
    case 'primary':
      return css`
        background: ${theme.colors.primary};
        color: white;
        border: 1px solid ${theme.colors.primary};
        &:hover:not(:disabled) {
          background: ${theme.colors.primaryHover};
          border-color: ${theme.colors.primaryHover};
        }
      `;
    case 'secondary':
      return css`
        background: ${theme.colors.secondary};
        color: white;
        border: 1px solid ${theme.colors.secondary};
        &:hover:not(:disabled) {
          background: #374151;
          border-color: #374151;
        }
      `;
    case 'outline':
      return css`
        background: transparent;
        color: ${theme.colors.text};
        border: 1px solid ${theme.colors.border};
        &:hover:not(:disabled) {
          background: ${theme.colors.surface};
          border-color: ${theme.colors.secondary};
        }
      `;
    case 'ghost':
      return css`
        background: transparent;
        color: ${theme.colors.text};
        border: 1px solid transparent;
        &:hover:not(:disabled) {
          background: ${theme.colors.surface};
        }
      `;
    case 'destructive':
      return css`
        background: ${theme.colors.error};
        color: white;
        border: 1px solid ${theme.colors.error};
        &:hover:not(:disabled) {
          background: #dc2626;
          border-color: #dc2626;
        }
      `;
    default:
      return css``;
  }
};

const getSizeStyles = (size: string = 'md') => {
  switch (size) {
    case 'sm':
      return css`
        height: 2rem;
        padding: 0 0.75rem;
        font-size: 0.875rem;
        border-radius: ${theme.borderRadius.sm};
      `;
    case 'md':
      return css`
        height: 2.5rem;
        padding: 0 1rem;
        font-size: 0.875rem;
        border-radius: ${theme.borderRadius.md};
      `;
    case 'lg':
      return css`
        height: 3rem;
        padding: 0 1.5rem;
        font-size: 1rem;
        border-radius: ${theme.borderRadius.lg};
      `;
    default:
      return css``;
  }
};

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  outline: none;
  
  ${props => getButtonStyles(props.variant)}
  ${props => getSizeStyles(props.size)}
  
  ${props => props.fullWidth && css`
    width: 100%;
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:focus {
    box-shadow: 0 0 0 2px ${theme.colors.primary}33;
  }
`;