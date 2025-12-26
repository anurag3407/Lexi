"use client";

import { useToast } from "@/hooks/use-toast";

export function Toaster() {
    const { toasts, dismiss } = useToast();

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`p-4 rounded-lg shadow-lg transition-all duration-300 ${
                        toast.variant === "destructive"
                            ? "bg-red-600 text-white"
                            : "bg-white text-gray-900 border border-gray-200"
                    }`}
                >
                    {toast.title && (
                        <div className="font-semibold">{toast.title}</div>
                    )}
                    {toast.description && (
                        <div className="text-sm mt-1">{toast.description}</div>
                    )}
                    <button
                        onClick={() => dismiss(toast.id)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
}
