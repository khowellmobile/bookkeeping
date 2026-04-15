import { createContext, useContext, useState, useCallback } from "react";

import ConfirmModal from "../components/elements/modals/ConfirmModal";

const ConfirmModalCtx = createContext(null);

export const ConfirmModalCtxProvider = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [cnfmModal, setCnfmModal] = useState({
        textObj: { confirm_txt: "", cancel_txt: "", msg: "" },
        onConfirm: null,
        onCancel: null,
    });

    const close = useCallback(() => setIsVisible(false), []);

    const showConfirmModal = useCallback((textObj, onConfirm, onCancel) => {
        setCnfmModal({
            textObj,
            onConfirm: () => { onConfirm?.(); close(); },
            onCancel: () => { onCancel?.(); close(); },
        });
        setIsVisible(true);
    }, [close]);

    const contextValue = { showConfirmModal };

    return (
        <ConfirmModalCtx.Provider value={contextValue}>
            {children}
            {isVisible && (
                <ConfirmModal text={cnfmModal.textObj} onConfirm={cnfmModal.onConfirm} onCancel={cnfmModal.onCancel} />
            )}
        </ConfirmModalCtx.Provider>
    );
};

export const useConfirmModal = () => {
    const context = useContext(ConfirmModalCtx);
    if (!context) {
        throw new Error("ConfirmModal muse be used within ConfirmModalProvider");
    }
    return context;
};
