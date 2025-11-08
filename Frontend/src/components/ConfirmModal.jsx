// src/client/components/ConfirmModal.jsx
export default function ConfirmModal({ open, onClose, onConfirm, title, message, confirmText = "Delete", cancelText = "Cancel" }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border-4 border-black bg-white shadow-[12px_12px_0_rgba(0,0,0,0.25)] overflow-hidden animate-[scaleIn_0.2s_ease-out]">
        
        {/* Header */}
        <div className="px-4 py-3 border-b-4 border-black bg-gradient-to-r from-red-300 to-orange-300">
          <div className="font-extrabold text-lg">{title}</div>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-700 leading-relaxed">{message}</p>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t-4 border-black bg-gray-100 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border-2 border-black bg-white hover:bg-gray-200 transition-colors font-bold"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-xl border-2 border-black bg-red-400 hover:bg-red-500 text-white transition-colors font-bold shadow-[4px_4px_0_rgba(0,0,0,0.25)] active:shadow-none active:translate-x-1 active:translate-y-1"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
