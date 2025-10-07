import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import classes from "./AccountActivatePage.module.css";

const AccountActivatePage = () => {
    const { uid, token } = useParams();

    const navigate = useNavigate();

    const [message, setMessage] = useState();
    const [isSuccess, setIsSuccess] = useState(false);

    const ACTIVATION_ENDPOINT = "http://127.0.0.1:8000/api/auth/users/activation/";

    useEffect(() => {
        if (!uid || !token) {
            setMessage("Missing token. Please return to create account and try again.");
            console.log("Error: Missing uid or token in URL.");
            return;
        }
    }, []);

    const activateAccount = async () => {
        try {
            const response = await fetch(ACTIVATION_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ uid, token }),
            });

            if (response.status === 204) {
                setIsSuccess(true);
                setMessage("Success! You can now navigate back to login!");
            } else {
                setMessage("There has been an error please wait a few moments and try again.");
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (e) {
            console.log("Activation Error: " + e);
        }
    };

    const navToLogin = () => {
        navigate("/");
    };

    return (
        <div className={classes.mainContainer}>
            <div className={classes.modal}>
                <h2>Account Activation</h2>
                <div className={classes.centerText}>
                    <p>
                        Please confirm that <strong>"example@gmail.com"</strong> is your email by click the button below
                    </p>
                    {message && <p>{message}</p>}
                </div>
                <button onClick={isSuccess ? navToLogin : activateAccount}>
                    {isSuccess ? "Return to Login" : "Confirm Email"}
                </button>
            </div>
        </div>
    );
};

export default AccountActivatePage;
