import classes from "./ConfirmationModal.module.css";

const ConfirmationModal = ({ text, onConfirm, onCancel }) => {
    return (
        <div className={classes.modalOverlay}>
            <div className={classes.mainContainer}>
                <div className={classes.headerContainer}>
                    <h3>Warning!</h3>
                </div>
                <div className={classes.messageContainer}>
                    <p>{text.msg}</p>
                </div>
                <div className={classes.buttonContainer}>
                    <button onClick={onConfirm}>{text.confirm_txt}</button>
                    <button onClick={onCancel}>{text.cancel_txt}</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
