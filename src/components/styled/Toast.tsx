import React, { createContext, useContext, useState, useCallback } from 'react';
import styled from '@emotion/styled';
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

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const ToastContainer = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 20rem;
`;

const ToastItem = styled.div<{ type: Toast['type'] }>`
  padding: 0.75rem 1rem;
  border-radius: ${theme.borderRadius.md};
  font-size: 0.875rem;
  font-weight: 500;
  box-shadow: ${theme.shadows.lg};
  animation: slideIn 0.3s ease-out;
  
  ${props => {
    switch (props.type) {
      case 'success':
        return `
          background: ${theme.colors.success};
          color: white;
        `;
      case 'error':
        return `
          background: ${theme.colors.error};
          color: white;
        `;
      case 'warning':
        return `
          background: ${theme.colors.warning};
          color: white;
        `;
      case 'info':
      default:
        return `
          background: ${theme.colors.primary};
          color: white;
        `;
    }
  }}
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast['type'] = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer>
        {toasts.map(toast => (
          <ToastItem
            key={toast.id}
            type={toast.type}
            onClick={() => removeToast(toast.id)}
            style={{ cursor: 'pointer' }}
          >
            {toast.message}
          </ToastItem>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}