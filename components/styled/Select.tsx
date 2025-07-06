import React, { useState, ReactNode, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { theme } from './theme';
import { ChevronDownIcon } from './Icons';

interface SelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  children: ReactNode;
  disabled?: boolean;
}

interface SelectItemProps {
  value: string;
  children: ReactNode;
}

const SelectContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SelectTrigger = styled.button<{ isOpen: boolean; disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 2.5rem;
  padding: 0 0.75rem;
  background: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-size: 0.875rem;
  color: ${theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px ${theme.colors.primary}33;
  }
  
  &:hover:not(:disabled) {
    border-color: ${theme.colors.secondary};
  }
  
  ${props => props.disabled && css`
    background: ${theme.colors.surface};
    opacity: 0.5;
    cursor: not-allowed;
  `}
  
  .chevron {
    transition: transform 0.2s ease-in-out;
    transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  }
`;

const SelectContent = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 50;
  margin-top: 0.25rem;
  background: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.lg};
  max-height: 200px;
  overflow-y: auto;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-8px)'};
  transition: all 0.2s ease-in-out;
`;

const SelectItem = styled.div<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  ${props => props.isSelected ? css`
    background: ${theme.colors.primary};
    color: white;
  ` : css`
    color: ${theme.colors.text};
    
    &:hover {
      background: ${theme.colors.surface};
    }
  `}
`;

const Placeholder = styled.span`
  color: ${theme.colors.textSecondary};
`;

export const Select: React.FC<SelectProps> = ({ 
  value, 
  onValueChange, 
  placeholder = "선택하세요", 
  children, 
  disabled 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemSelect = (itemValue: string) => {
    onValueChange(itemValue);
    setIsOpen(false);
  };

  // Extract items from children
  const items = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<SelectItemProps> =>
      React.isValidElement(child) && child.type === SelectItem
  );

  const selectedItem = items.find(item => item.props.value === value);

  return (
    <SelectContainer ref={containerRef}>
      <SelectTrigger
        isOpen={isOpen}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        {selectedItem ? (
          selectedItem.props.children
        ) : (
          <Placeholder>{placeholder}</Placeholder>
        )}
        <ChevronDownIcon size={16} className="chevron" />
      </SelectTrigger>
      
      <SelectContent isOpen={isOpen}>
        {items.map((item) => (
          <SelectItem
            key={item.props.value}
            isSelected={item.props.value === value}
            onClick={() => handleItemSelect(item.props.value)}
          >
            {item.props.children}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectContainer>
  );
};

export const SelectItem: React.FC<SelectItemProps> = ({ value, children }) => {
  // This component is used as a data structure, the actual rendering is handled by Select
  return <>{children}</>;
};