import { createContext, useContext, useState, useCallback, useEffect } from "react";

import ToastNotification from "../elements/utilities/ToastNotification";

const ToastCtx = createContext(null);

export const ToastCtxProvider = ({ children }) => {
    const [toastQueue, setToastQueue] = useState([]);

    const [toast, setToast] = useState({
        text: "",
        type: "",
        isVisible: false,
        duration: 0,
    });

    // Controls showing toast
    useEffect(() => {
        if (!toast.isVisible && toastQueue.length > 0) {
            const nextToast = toastQueue[0];
            setToast({
                text: nextToast.text,
                type: nextToast.type,
                isVisible: true,
                duration: nextToast.duration,
            });
        }
    }, [toast.isVisible, toastQueue, setToast]);

    // controls hiding and removing toast
    useEffect(() => {
        if (toast.isVisible) {
            const timer = setTimeout(() => {
                setToast((prev) => ({ ...prev, isVisible: false }));
                setToastQueue((prev) => prev.slice(1));
            }, toast.duration + 750);

            return () => clearTimeout(timer);
        }
    }, [toast.isVisible, toast.duration, setToast, setToastQueue]);

    const showToast = useCallback((text, type = "success", duration = 3000) => {
        setToastQueue((prev) => [
            ...prev,
            {
                text: text,
                type: type,
                duration: duration,
            },
        ]);
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
