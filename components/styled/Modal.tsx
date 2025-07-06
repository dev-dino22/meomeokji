import React, { ReactNode, useEffect } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { theme } from './theme';
import { XIcon } from './Icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: all 0.2s ease-in-out;
`;

const getSizeStyles = (size: string = 'md') => {
  switch (size) {
    case 'sm':
      return css`
        max-width: 20rem;
      `;
    case 'md':
      return css`
        max-width: 28rem;
      `;
    case 'lg':
      return css`
        max-width: 32rem;
      `;
    case 'xl':
      return css`
        max-width: 48rem;
      `;
    default:
      return css``;
  }
};

const ModalContent = styled.div<{ size?: string; isOpen: boolean }>`
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.xl};
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  transform: ${props => props.isOpen ? 'scale(1)' : 'scale(0.95)'};
  transition: transform 0.2s ease-in-out;
  
  ${props => getSizeStyles(props.size)}
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid ${theme.colors.border};
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${theme.colors.text};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.textSecondary};
  cursor: pointer;
  padding: 0.25rem;
  border-radius: ${theme.borderRadius.sm};
  transition: all 0.2s ease-in-out;
  
  &:hover {
    color: ${theme.colors.text};
    background: ${theme.colors.surface};
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Overlay isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContent size={size} isOpen={isOpen}>
        {title && (
          <ModalHeader>
            <ModalTitle>{title}</ModalTitle>
            <CloseButton onClick={onClose}>
              <XIcon size={20} />
            </CloseButton>
          </ModalHeader>
        )}
        <ModalBody>
          {children}
        </ModalBody>
      </ModalContent>
    </Overlay>
  );
};