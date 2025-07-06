import styled from '@emotion/styled';
import { theme } from './theme';

export const Card = styled.div`
  background: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.sm};
`;

export const CardHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

export const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${theme.colors.text};
  margin: 0;
`;

export const CardContent = styled.div`
  padding: 1.5rem;
`;