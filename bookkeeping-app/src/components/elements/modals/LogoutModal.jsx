import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import classes from "./LogoutModal.module.css";

import AuthCtx from "../../contexts/AuthCtx";

const LogoutModal = () => {
    const navigate = useNavigate();

    const { logoutUser } = useContext(AuthCtx);

    const logout = () => {
        logoutUser();
        navigate("/");
    };

    return (
        <div className={classes.modalOverlay}>
            <div className={classes.mainContainer}>
                <h2>You password has been changed.</h2>
                <p>Please login again to confirm password change.</p>
                <button onClick={logout}>Back to Login</button>
            </div>
        </div>
    );
};

export default LogoutModal;
