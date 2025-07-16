import classes from "./ToastNotification.module.css";

const ToastNotification = ({ text, type }) => {
    const handleOpen = () => {};

    const handleClose = () => {};

    return (
        <div className={classes.mainContainer}>
            <div className={classes.colorDisplay}></div>
            <div className={classes.textDisplay}>
                <p>{type}</p>
                <p>{text}</p>
            </div>
        </div>
    );
};

export default ToastNotification;
