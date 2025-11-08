// src/client/components/toast/Toast.jsx
import { useEffect, useState } from 'react';
import { useToastStore } from '../../store/toastStore';

const TOAST_ICONS = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️'
};

const TOAST_COLORS = {
  success: 'from-green-300 to-green-400',
  error: 'from-red-300 to-red-400',
  warning: 'from-yellow-300 to-yellow-400',
  info: 'from-blue-300 to-blue-400'
};

export default function Toast({ toast }) {
  const [progress, setProgress] = useState(100);
  const [isExiting, setIsExiting] = useState(false);
  const removeToast = useToastStore(s => s.removeToast);

  const { id, type, message, duration, dismissible } = toast;

  // Progress bar animation
  useEffect(() => {
    if (!duration) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => removeToast(id), 300);
  };

  return (
    <div
      className={`
        toast-item
        ${isExiting ? 'toast-exit' : 'toast-enter'}
        relative mb-3 w-full max-w-md rounded-2xl border-4 border-black 
        bg-gradient-to-r ${TOAST_COLORS[type]}
        shadow-[8px_8px_0_rgba(0,0,0,0.25)]
        overflow-hidden
      `}
    >
      <div className="flex items-start gap-3 p-4">
        {/* Icon */}
        <div className="text-3xl flex-shrink-0 mt-0.5">
          {TOAST_ICONS[type]}
        </div>

        {/* Message */}
        <div className="flex-1 min-w-0">
          <div className="font-bold text-black break-words">
            {message}
          </div>
        </div>

        {/* Close button */}
        {dismissible && (
          <button
            onClick={handleClose}
            className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-black bg-white hover:bg-gray-100 transition-colors flex items-center justify-center font-bold"
            aria-label="Close"
          >
            ×
          </button>
        )}
      </div>

      {/* Progress bar */}
      {duration && (
        <div className="h-2 bg-black/20">
          <div
            className="h-full bg-black/40 transition-all ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
