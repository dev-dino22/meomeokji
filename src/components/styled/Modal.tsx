import React from 'react';
import styled from '@emotion/styled';
import { theme } from './theme';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.xl};
  max-width: 32rem;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${theme.colors.border};
  
  h2 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: ${theme.colors.text};
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <Overlay isOpen={isOpen} onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        {title && (
          <ModalHeader>
            <h2>{title}</h2>
          </ModalHeader>
        )}
        <ModalBody>
          {children}
        </ModalBody>
      </ModalContent>
    </Overlay>
  );
}