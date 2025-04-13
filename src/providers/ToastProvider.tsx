import type React from "react";
import { createContext, useCallback, useContext, useState } from "react";
import { Toast, type ToastType } from "../components/Toast/Toast";

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    key: number;
  } | null>(null);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    setToast({ message, type, key: Date.now() });
  }, []);
  return (
    <ToastContext.Provider value={{ showToast }}>
      {toast && (
        <Toast
          key={toast.key}
          message={toast.message}
          type={toast.type}
          onHide={() => setToast(null)}
        />
      )}
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
