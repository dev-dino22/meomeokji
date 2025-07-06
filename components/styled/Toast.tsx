import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import styled from '@emotion/styled';
import { keyframes, css } from '@emotion/react';
import { theme } from './theme';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: Toast['type'], duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

const slideInRight = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOutRight = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  pointer-events: none;
`;

const getToastStyles = (type: Toast['type']) => {
  switch (type) {
    case 'success':
      return css`
        background: ${theme.colors.success};
        color: white;
        border-color: ${theme.colors.success};
      `;
    case 'error':
      return css`
        background: ${theme.colors.error};
        color: white;
        border-color: ${theme.colors.error};
      `;
    case 'warning':
      return css`
        background: ${theme.colors.warning};
        color: white;
        border-color: ${theme.colors.warning};
      `;
    case 'info':
    default:
      return css`
        background: ${theme.colors.blue};
        color: white;
        border-color: ${theme.colors.blue};
      `;
  }
};

const ToastItem = styled.div<{ type: Toast['type']; isRemoving: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: ${theme.borderRadius.md};
  border: 1px solid;
  box-shadow: ${theme.shadows.lg};
  font-size: 0.875rem;
  font-weight: 500;
  max-width: 350px;
  pointer-events: auto;
  
  ${props => getToastStyles(props.type)}
  
  animation: ${props => props.isRemoving ? slideOutRight : slideInRight} 0.3s ease-out;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0;
  margin-left: auto;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
  }
`;

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast['type'] = 'info', duration = 4000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, duration);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} type={toast.type} isRemoving={false}>
            {toast.message}
            <CloseButton onClick={() => removeToast(toast.id)}>
              ✕
            </CloseButton>
          </ToastItem>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};