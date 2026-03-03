import { useNavigate } from "react-router-dom";

import classes from "./LogoutModal.module.css";

import { UseAuth } from "../../../hooks/UseAuth";

const LogoutModal = () => {
    const navigate = useNavigate();

    const { logout } = UseAuth();

    const logoutUser = () => {
        logout();
        console.log("logged out user");
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
