import { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";
import classes from "./BaseAddModal.module.css";

const BaseModal = ({ children, handleCloseModal, hasUnsavedChanges, title, handleSaveClick }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCancelClose = () => {
        if (hasUnsavedChanges) {
            setIsModalOpen(true);
        } else {
            handleCloseModal();
        }
    };

    const onConfirm = () => {
        setIsModalOpen(false);
        handleCloseModal();
    };

    const onCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            {isModalOpen && (
                <ConfirmationModal
                    text={{
                        msg: "You have unsaved changes. Are you sure you want to discard them?",
                        confirm_txt: "Discard Changes",
                        cancel_txt: "Keep Editing",
                    }}
                    onConfirm={onConfirm}
                    onCancel={onCancel}
                />
            )}

            <div className={classes.modalOverlay}>
                <div className={classes.mainContainer}>
                    <section className={classes.top}>
                        <h2>{title}</h2>
                        <div className={classes.seperatorH} />
                        {children}
                    </section>
                    <section className={classes.buttons}>
                        <button onClick={handleSaveClick}>Save & Close</button>
                        <button onClick={handleCancelClose}>Close</button>
                    </section>
                </div>
            </div>
        </>
    );
};

export default BaseModal;
