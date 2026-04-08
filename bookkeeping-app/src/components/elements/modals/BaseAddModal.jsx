import { useConfirmModal } from "../../../contexts/ConfirmModalCtx";
import classes from "./BaseAddModal.module.css";
import Button from "../utilities/Button";

const BaseModal = ({ children, handleCloseModal, hasUnsavedChanges, title, handleSaveClick }) => {
    const { showConfirmModal } = useConfirmModal();

    const handleCancelClose = () => {
        if (hasUnsavedChanges) {
            showConfirmModal(
                {
                    msg: "You have unsaved changes. Are you sure you want to discard them?",
                    confirm_txt: "Discard Changes",
                    cancel_txt: "Keep Editing",
                },
                handleCloseModal
            );
        } else {
            handleCloseModal();
        }
    };

    return (
        <>
            <div className={classes.modalOverlay}>
                <div className={classes.mainContainer}>
                    <section className={classes.top}>
                        <h2>{title}</h2>
                        <div className={classes.seperatorH} />
                        {children}
                    </section>
                    <section className={classes.buttons}>
                        <Button onClick={handleSaveClick} text={"Save & Close"} />
                        <Button onClick={handleCancelClose} text={"Close"} />
                    </section>
                </div>
            </div>
        </>
    );
};

export default BaseModal;
