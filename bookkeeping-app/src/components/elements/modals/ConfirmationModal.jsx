import Button from "../utilities/Button";
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
                    <Button
                        onClick={onConfirm}
                        text={text.confirm_txt}
                        customStyle={{ width: "calc(50% - 0.25rem)" }}
                    />
                    <Button onClick={onCancel} text={text.cancel_txt} customStyle={{ width: "calc(50% - 0.25rem)" }} />
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
