import { useNavigate } from "react-router-dom";

import classes from "./LogoutModal.module.css";

import { useAuth } from "../../../hooks/useAuth";

const LogoutModal = () => {
    const navigate = useNavigate();

    const { logout } = useAuth();

    const logoutUser = () => {
        logout();
        navigate("/");
    };

    return (
        <div className={classes.modalOverlay}>
            <div className={classes.mainContainer}>
                <h2>You password has been changed.</h2>
                <p>Please login again to confirm password change.</p>
                <button onClick={logoutUser}>Back to Login</button>
            </div>
        </div>
    );
};

export default LogoutModal;
