// src/client/components/toast/ToastContainer.jsx
import { createPortal } from 'react-dom';
import { useToastStore } from '../../store/toastStore';
import Toast from './Toast';

export default function ToastContainer() {
  const toasts = useToastStore(s => s.toasts);

  if (toasts.length === 0) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center p-4"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="pointer-events-auto flex flex-col items-center w-full max-w-md">
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </div>
    </div>,
    document.body
  );
}
