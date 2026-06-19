import { useState, useCallback } from 'react';

export type ToastSeverity = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id:       string;
  message:  string;
  severity: ToastSeverity;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, severity: ToastSeverity = 'info') => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, message, severity }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const closeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, showToast, closeToast };
}
