// src/client/hooks/useToast.js
import { useToastStore } from '../store/toastStore';

/**
 * Easy-to-use toast hook
 * 
 * Usage:
 *   const toast = useToast();
 *   toast.success('Message sent!');
 *   toast.error('Failed to send');
 *   toast.warning('Storage almost full');
 *   toast.info('New feature available');
 */
export function useToast() {
  const addToast = useToastStore(s => s.addToast);

  return {
    success: (message, options = {}) => {
      return addToast({
        type: 'success',
        message,
        ...options
      });
    },

    error: (message, options = {}) => {
      return addToast({
        type: 'error',
        message,
        ...options
      });
    },

    warning: (message, options = {}) => {
      return addToast({
        type: 'warning',
        message,
        ...options
      });
    },

    info: (message, options = {}) => {
      return addToast({
        type: 'info',
        message,
        ...options
      });
    },

    // Direct access to store methods
    remove: useToastStore.getState().removeToast,
    clearAll: useToastStore.getState().clearAllToasts
  };
}

// ✅ Also export a non-hook version for use outside components
export const toast = {
  success: (message, options = {}) => {
    return useToastStore.getState().addToast({
      type: 'success',
      message,
      ...options
    });
  },

  error: (message, options = {}) => {
    return useToastStore.getState().addToast({
      type: 'error',
      message,
      ...options
    });
  },

  warning: (message, options = {}) => {
    return useToastStore.getState().addToast({
      type: 'warning',
      message,
      ...options
    });
  },

  info: (message, options = {}) => {
    return useToastStore.getState().addToast({
      type: 'info',
      message,
      ...options
    });
  }
};
