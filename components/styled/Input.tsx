import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { theme } from './theme';

interface InputProps {
  variant?: 'default' | 'error';
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const getSizeStyles = (size: string = 'md') => {
  switch (size) {
    case 'sm':
      return css`
        height: 2rem;
        padding: 0 0.75rem;
        font-size: 0.875rem;
      `;
    case 'md':
      return css`
        height: 2.5rem;
        padding: 0 0.75rem;
        font-size: 0.875rem;
      `;
    case 'lg':
      return css`
        height: 3rem;
        padding: 0 1rem;
        font-size: 1rem;
      `;
    default:
      return css``;
  }
};

export const Input = styled.input<InputProps>`
  display: flex;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.background};
  color: ${theme.colors.text};
  outline: none;
  transition: all 0.2s ease-in-out;
  
  ${props => getSizeStyles(props.size)}
  
  &::placeholder {
    color: ${theme.colors.textSecondary};
  }
  
  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px ${theme.colors.primary}33;
  }
  
  ${props => props.variant === 'error' && css`
    border-color: ${theme.colors.error};
    &:focus {
      border-color: ${theme.colors.error};
      box-shadow: 0 0 0 2px ${theme.colors.error}33;
    }
  `}
  
  &:disabled {
    background: ${theme.colors.surface};
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Textarea = styled.textarea<InputProps>`
  display: flex;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  min-height: 80px;
  padding: 0.75rem;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.background};
  color: ${theme.colors.text};
  outline: none;
  transition: all 0.2s ease-in-out;
  resize: vertical;
  font-size: 0.875rem;
  
  &::placeholder {
    color: ${theme.colors.textSecondary};
  }
  
  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px ${theme.colors.primary}33;
  }
  
  ${props => props.variant === 'error' && css`
    border-color: ${theme.colors.error};
    &:focus {
      border-color: ${theme.colors.error};
      box-shadow: 0 0 0 2px ${theme.colors.error}33;
    }
  `}
  
  &:disabled {
    background: ${theme.colors.surface};
    opacity: 0.5;
    cursor: not-allowed;
  }
`;