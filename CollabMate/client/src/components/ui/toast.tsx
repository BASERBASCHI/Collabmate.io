import * as React from "react";
import { cn } from "@/lib/utils";

const ToastContext = React.createContext<{
  toast: (props: { title: string; description?: string; variant?: "default" | "destructive" }) => void;
}>({
  toast: () => {},
});

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<Array<{
    id: string;
    title: string;
    description?: string;
    variant?: "default" | "destructive";
  }>>([]);

  const toast = React.useCallback((props: { title: string; description?: string; variant?: "default" | "destructive" }) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...props, id }]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(({ id, title, description, variant = "default" }) => (
          <div
            key={id}
            className={cn(
              "rounded-lg border p-4 shadow-lg max-w-sm",
              variant === "destructive"
                ? "border-red-200 bg-red-50 text-red-900"
                : "border-gray-200 bg-white text-gray-900"
            )}
          >
            <div className="font-medium">{title}</div>
            {description && <div className="text-sm opacity-80">{description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};