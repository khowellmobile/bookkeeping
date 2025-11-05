import classes from "./ToastNotification.module.css";

import successIcon from "../../../assets/success-filled-icon.svg";
import warningIcon from "../../../assets/warning-filled-icon.svg";
import errorIcon from "../../../assets/error-filled-icon.svg";
import closeIcon from "../../../assets/cancel-icon.svg";
import { useEffect, useState } from "react";

const ToastNotification = ({ text, type, duration = 3000 }) => {
    const [isOnScreen, setIsOnSCreen] = useState(false);

    useEffect(() => {
        const transitionTimer = setTimeout(() => {
            handleOpen();
        }, 10);

        // Keep the main timer as is
        const hideTimer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => {
            clearTimeout(transitionTimer);
            clearTimeout(hideTimer);
        };
    }, []);

    const colors = {
        success: "rgb(138, 241, 124)",
        warning: "rgb(253, 213, 32)",
        error: "rgb(255, 49, 49)",
    };

    const icons = {
        success: successIcon,
        warning: warningIcon,
        error: errorIcon,
    };

    const toastStyle = {
        right: isOnScreen ? "0rem" : "-21.25rem",
    };

    const colorStyle = {
        backgroundColor: colors[type],
    };

    const handleOpen = () => {
        setIsOnSCreen(true);
    };

    const handleClose = () => {
        setIsOnSCreen(false);
    };

    return (
        <div className={classes.toaster}>
            <div className={classes.toast} style={toastStyle}>
                <img className={classes.close} src={closeIcon} alt="close icon" onClick={handleClose} />
                <div className={classes.colorDisplay} style={colorStyle} />
                <img className={classes.icon} src={icons[type]} alt={`${type} icon`} />
                <div className={classes.textDisplay}>
                    <p>{type.charAt(0).toUpperCase() + type.slice(1)}</p>
                    <p>{text}</p>
                </div>
            </div>
        </div>
    );
};

export default ToastNotification;
