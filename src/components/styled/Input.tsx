import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { theme } from './theme';

interface InputProps {
  fullWidth?: boolean;
  error?: boolean;
}

export const Input = styled.input<InputProps>`
  height: 2.5rem;
  padding: 0 0.75rem;
  font-size: 0.875rem;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.background};
  color: ${theme.colors.text};
  transition: all 0.2s ease-in-out;
  outline: none;
  
  ${props => props.fullWidth && css`
    width: 100%;
  `}
  
  ${props => props.error && css`
    border-color: ${theme.colors.error};
  `}
  
  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px ${theme.colors.primary}33;
  }
  
  &::placeholder {
    color: ${theme.colors.textSecondary};
  }
  
  &:disabled {
    background: ${theme.colors.surface};
    color: ${theme.colors.textSecondary};
    cursor: not-allowed;
  }
`;