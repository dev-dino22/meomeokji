import React, { createContext, useContext, useState } from 'react';
import styled from '@emotion/styled';
import { theme } from './theme';

interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

const TabsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const TabsListContainer = styled.div`
  display: flex;
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.md};
  padding: 0.25rem;
  margin-bottom: 1rem;
`;

const TabsTriggerContainer = styled.button<{ isActive: boolean }>`
  flex: 1;
  padding: 0.5rem 1rem;
  border: none;
  background: ${props => props.isActive ? theme.colors.background : 'transparent'};
  color: ${props => props.isActive ? theme.colors.text : theme.colors.textSecondary};
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background: ${props => props.isActive ? theme.colors.background : theme.colors.border};
  }
`;

export function Tabs({ value, onValueChange, children }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <TabsContainer>
        {children}
      </TabsContainer>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function TabsList({ children, style }: TabsListProps) {
  return <TabsListContainer style={style}>{children}</TabsListContainer>;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
}

export function TabsTrigger({ value, children }: TabsTriggerProps) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('TabsTrigger must be used within Tabs');
  }

  const { value: activeValue, onValueChange } = context;
  const isActive = activeValue === value;

  return (
    <TabsTriggerContainer
      isActive={isActive}
      onClick={() => onValueChange(value)}
    >
      {children}
    </TabsTriggerContainer>
  );
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
}

export function TabsContent({ value, children }: TabsContentProps) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('TabsContent must be used within Tabs');
  }

  const { value: activeValue } = context;
  
  if (activeValue !== value) {
    return null;
  }

  return <div>{children}</div>;
}