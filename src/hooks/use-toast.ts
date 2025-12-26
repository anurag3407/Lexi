"use client";

import { useState, useCallback } from "react";

export type ToastVariant = "default" | "destructive";

export interface Toast {
    id: string;
    title?: string;
    description?: string;
    variant?: ToastVariant;
}

interface ToastState {
    toasts: Toast[];
}

let toastListeners: ((state: ToastState) => void)[] = [];
let toastState: ToastState = { toasts: [] };

function dispatch(action: { type: string; toast?: Toast; id?: string }) {
    switch (action.type) {
        case "ADD_TOAST":
            if (action.toast) {
                toastState = {
                    toasts: [...toastState.toasts, action.toast],
                };
            }
            break;
        case "DISMISS_TOAST":
            toastState = {
                toasts: toastState.toasts.filter((t) => t.id !== action.id),
            };
            break;
        case "REMOVE_TOAST":
            toastState = {
                toasts: toastState.toasts.filter((t) => t.id !== action.id),
            };
            break;
    }
    toastListeners.forEach((listener) => listener(toastState));
}

export function toast({
    title,
    description,
    variant = "default",
}: Omit<Toast, "id">) {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { id, title, description, variant };

    dispatch({ type: "ADD_TOAST", toast: newToast });

    // Auto dismiss after 5 seconds
    setTimeout(() => {
        dispatch({ type: "REMOVE_TOAST", id });
    }, 5000);

    return id;
}

export function useToast() {
    const [state, setState] = useState<ToastState>(toastState);

    useState(() => {
        toastListeners.push(setState);
        return () => {
            toastListeners = toastListeners.filter((l) => l !== setState);
        };
    });

    const dismiss = useCallback((id: string) => {
        dispatch({ type: "DISMISS_TOAST", id });
    }, []);

    return {
        toasts: state.toasts,
        toast,
        dismiss,
    };
}
