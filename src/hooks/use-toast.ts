
'use client';
import { useState, useCallback } from 'react';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
    console.log('Toast removed:', id);
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id' | 'onClose'>) => {
    const id = Date.now().toString();
    const newToast = { ...toast, id, onClose: removeToast };
    
    setToasts(prev => [...prev, newToast]);
    console.log('Toast added:', newToast);
    
    return id;
  }, [removeToast]);

  const toast = {
    success: (title: string, message?: string, duration?: number) =>
      addToast({ type: 'success', title, message, duration }),
    
    error: (title: string, message?: string, duration?: number) =>
      addToast({ type: 'error', title, message, duration }),
    
    warning: (title: string, message?: string, duration?: number) =>
      addToast({ type: 'warning', title, message, duration }),
    
    info: (title: string, message?: string, duration?: number) =>
      addToast({ type: 'info', title, message, duration }),
  };

  return {
    toasts,
    toast,
    removeToast,
  };
};