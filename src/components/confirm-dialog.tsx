"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogOptions {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "default";
}

interface ConfirmDialogContextType {
    confirm: (options: ConfirmDialogOptions) => Promise<boolean>;
    showToast: (message: string, type?: "success" | "error" | "info") => void;
}

const ConfirmDialogContext = createContext<ConfirmDialogContextType | null>(null);

export function useConfirmDialog() {
    const context = useContext(ConfirmDialogContext);
    if (!context) {
        throw new Error("useConfirmDialog must be used within a ConfirmDialogProvider");
    }
    return context;
}

interface ToastState {
    message: string;
    type: "success" | "error" | "info";
    visible: boolean;
}

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
    const [dialogState, setDialogState] = useState<{
        isOpen: boolean;
        options: ConfirmDialogOptions;
        resolve: ((value: boolean) => void) | null;
    }>({
        isOpen: false,
        options: { message: "" },
        resolve: null,
    });

    const [toast, setToast] = useState<ToastState>({
        message: "",
        type: "info",
        visible: false,
    });

    const confirm = (options: ConfirmDialogOptions): Promise<boolean> => {
        return new Promise((resolve) => {
            setDialogState({
                isOpen: true,
                options,
                resolve,
            });
        });
    };

    const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
        setToast({ message, type, visible: true });
        setTimeout(() => {
            setToast((prev) => ({ ...prev, visible: false }));
        }, 3000);
    };

    const handleConfirm = () => {
        dialogState.resolve?.(true);
        setDialogState((prev) => ({ ...prev, isOpen: false, resolve: null }));
    };

    const handleCancel = () => {
        dialogState.resolve?.(false);
        setDialogState((prev) => ({ ...prev, isOpen: false, resolve: null }));
    };

    const { options } = dialogState;

    return (
        <ConfirmDialogContext.Provider value={{ confirm, showToast }}>
            {children}

            {/* Confirm Dialog Modal */}
            {dialogState.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={handleCancel}
                    />

                    {/* Modal */}
                    <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className={cn(
                            "px-6 py-4 flex items-center gap-3",
                            options.variant === "danger" && "bg-red-50 dark:bg-red-900/20",
                            options.variant === "warning" && "bg-yellow-50 dark:bg-yellow-900/20",
                            !options.variant && "bg-gray-50 dark:bg-zinc-800"
                        )}>
                            {options.variant === "danger" && (
                                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                </div>
                            )}
                            {options.variant === "warning" && (
                                <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                </div>
                            )}
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {options.title || "Confirm Action"}
                            </h3>
                            <button
                                onClick={handleCancel}
                                className="ml-auto p-1 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-4">
                            <p className="text-gray-600 dark:text-gray-300">{options.message}</p>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-gray-50 dark:bg-zinc-800 flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={handleCancel}
                                className="dark:border-zinc-600 dark:text-gray-300"
                            >
                                {options.cancelText || "Cancel"}
                            </Button>
                            <Button
                                onClick={handleConfirm}
                                className={cn(
                                    options.variant === "danger" && "bg-red-600 hover:bg-red-700",
                                    options.variant === "warning" && "bg-yellow-600 hover:bg-yellow-700"
                                )}
                            >
                                {options.confirmText || "Confirm"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast.visible && (
                <div
                    className={cn(
                        "fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[100] px-6 py-3 rounded-xl shadow-lg animate-in slide-in-from-bottom-4 duration-300",
                        toast.type === "success" && "bg-green-600 text-white",
                        toast.type === "error" && "bg-red-600 text-white",
                        toast.type === "info" && "bg-gray-800 text-white"
                    )}
                >
                    {toast.message}
                </div>
            )}
        </ConfirmDialogContext.Provider>
    );
}
