import { CheckCircle2, Info, X, AlertCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export function ToastContainer() {
  const { toasts, dismissToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-20 md:bottom-6 inset-x-4 md:inset-x-auto md:end-6 z-[70] flex flex-col gap-2 pointer-events-none"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium transition-all max-w-md ${
            toast.tone === 'error'
              ? 'bg-[#FFF5F5] border-[#F5C2C7] text-[#D92D39]'
              : toast.tone === 'info'
                ? 'bg-white border-[#EAE5DF] text-[#202020]'
                : 'bg-[#3D1023] border-[#581C32] text-white'
          }`}
        >
          {toast.tone === 'error' ? (
            <AlertCircle className="w-4 h-4 shrink-0" />
          ) : toast.tone === 'info' ? (
            <Info className="w-4 h-4 shrink-0 text-[#581C32]" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#C5A572]" />
          )}
          <span className="flex-1 leading-snug">{toast.text}</span>
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            aria-label="Close notification"
            className="opacity-70 hover:opacity-100 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
