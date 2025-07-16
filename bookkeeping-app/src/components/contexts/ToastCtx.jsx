import { createContext, useContext, useState, useCallback } from "react";

import ToastNotification from "../elements/misc/ToastNotification";

const ToastCtx = createContext(null);

export const ToastCtxProvider = ({ children }) => {
    const [toast, setToast] = useState({
        text: "",
        type: "success",
        isVisible: false,
        duration: 0,
    });

    const showToast = useCallback((text, type = "success", duration = 3000) => {
        setToast({ text, type, isVisible: true, duration: duration });

        const timer = setTimeout(() => {
            setToast((prev) => ({ ...prev, isVisible: false }));
        }, duration + 750);

        return () => clearTimeout(timer);
    }, []);

    const hideToast = useCallback(() => {
        setToast((prev) => ({ ...prev, isVisible: false }));
    }, []);

    const contextValue = { showToast, hideToast };

    return (
        <ToastCtx.Provider value={contextValue}>
            {children}
            {toast.isVisible && <ToastNotification text={toast.text} type={toast.type} duration={toast.duration} />}
        </ToastCtx.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastCtx);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};
