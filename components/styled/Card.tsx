import styled from '@emotion/styled';
import { theme } from './theme';

export const Card = styled.div`
  background: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.sm};
  overflow: hidden;
`;

export const CardHeader = styled.div`
  padding: ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

export const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${theme.colors.text};
  margin: 0 0 0.5rem 0;
  line-height: 1.25;
`;

export const CardDescription = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.5;
`;

export const CardContent = styled.div`
  padding: ${theme.spacing.lg};
`;

export const CardFooter = styled.div`
  padding: ${theme.spacing.lg};
  border-top: 1px solid ${theme.colors.border};
  background: ${theme.colors.surface};
  
  &:first-child {
    border-top: none;
    background: transparent;
  }
`;