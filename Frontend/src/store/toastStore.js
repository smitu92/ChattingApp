// src/client/store/toastStore.js
import { create } from 'zustand';

/**
 * Toast Store - Manages toast notifications
 * 
 * Usage:
 *   import { useToastStore } from './store/toastStore';
 *   const addToast = useToastStore(s => s.addToast);
 *   addToast({ type: 'success', message: 'Saved!' });
 */

let toastId = 0;

export const useToastStore = create((set) => ({
  toasts: [],

  /**
   * Add a new toast
   * @param {Object} toast - Toast configuration
   * @param {string} toast.type - 'success' | 'error' | 'warning' | 'info'
   * @param {string} toast.message - Toast message
   * @param {number} [toast.duration] - Auto-dismiss duration (ms). Default: 3000 for success, null for others
   * @param {boolean} [toast.dismissible] - Can be manually closed. Default: true
   */
  addToast: (toast) => {
    const id = ++toastId;
    
    const newToast = {
      id,
      type: toast.type || 'info',
      message: toast.message,
      duration: toast.duration !== undefined 
        ? toast.duration 
        : (toast.type === 'success' ? 3000 : null),
      dismissible: toast.dismissible !== undefined ? toast.dismissible : true,
      createdAt: Date.now()
    };

    set((state) => ({
      toasts: [...state.toasts, newToast]
    }));

    // Auto-dismiss if duration is set
    if (newToast.duration) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter(t => t.id !== id)
        }));
      }, newToast.duration);
    }

    return id;
  },

  /**
   * Remove a toast by ID
   */
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter(t => t.id !== id)
    }));
  },

  /**
   * Remove all toasts
   */
  clearAllToasts: () => {
    set({ toasts: [] });
  }
}));
