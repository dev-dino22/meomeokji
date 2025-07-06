import React, { useState, ReactNode } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { theme } from './theme';

interface TabsProps {
  defaultValue: string;
  children: ReactNode;
  className?: string;
}

interface TabsListProps {
  children: ReactNode;
}

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
}

interface TabsContentProps {
  value: string;
  children: ReactNode;
}

const TabsContext = React.createContext<{
  activeTab: string;
  setActiveTab: (value: string) => void;
}>({
  activeTab: '',
  setActiveTab: () => {},
});

const TabsContainer = styled.div`
  width: 100%;
`;

const TabsList = styled.div`
  display: flex;
  align-items: center;
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.md};
  padding: 0.25rem;
  gap: 0.25rem;
`;

const TabsTrigger = styled.button<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  ${props => props.isActive ? css`
    background: ${theme.colors.background};
    color: ${theme.colors.text};
    box-shadow: ${theme.shadows.sm};
  ` : css`
    background: transparent;
    color: ${theme.colors.textSecondary};
    
    &:hover {
      color: ${theme.colors.text};
      background: ${theme.colors.background}80;
    }
  `}
`;

const TabsContent = styled.div<{ isActive: boolean }>`
  margin-top: 1rem;
  display: ${props => props.isActive ? 'block' : 'none'};
`;

export const Tabs: React.FC<TabsProps> = ({ defaultValue, children, className }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <TabsContainer className={className}>
        {children}
      </TabsContainer>
    </TabsContext.Provider>
  );
};

export const TabsListComponent: React.FC<TabsListProps> = ({ children }) => {
  return <TabsList>{children}</TabsList>;
};

export const TabsTriggerComponent: React.FC<TabsTriggerProps> = ({ value, children }) => {
  const { activeTab, setActiveTab } = React.useContext(TabsContext);
  
  return (
    <TabsTrigger
      isActive={activeTab === value}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </TabsTrigger>
  );
};

export const TabsContentComponent: React.FC<TabsContentProps> = ({ value, children }) => {
  const { activeTab } = React.useContext(TabsContext);
  
  return (
    <TabsContent isActive={activeTab === value}>
      {children}
    </TabsContent>
  );
};

// Export with better names
export { TabsListComponent as TabsList };
export { TabsTriggerComponent as TabsTrigger };
export { TabsContentComponent as TabsContent };