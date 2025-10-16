import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import classes from "./PasswordResetPage.module.css";
import PwdPopup from "../components/elements/utilities/PwdPopup";

const PasswordResetPage = () => {
    const { uid, token } = useParams();

    const navigate = useNavigate();

    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [reqObj, setReqObj] = useState({
        chars: false,
        num: false,
        specChar: false,
    });

    const baseUrl = import.meta.env.VITE_BASE_URL;
    const RESET_ENDPOINT = `${baseUrl}/api/auth/users/reset_password_confirm/`;

    useEffect(() => {
        if (!uid || !token) {
            setMessage("Missing token. Please return to login and try again.");
            console.log("Error: Missing uid or token in URL.");
            return;
        }
    }, []);

    useEffect(() => {
        setReqObj({
            chars: password.length >= 8,
            num: /\d/.test(password),
            specChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password),
        });
    }, [password]);

    const confirmPassword = async () => {
        if (
            !(password.length >= 8 && /\d/.test(password) && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password))
        ) {
            setMessage("Password does not meant requirments");
            return;
        } else if (password !== passwordConfirm) {
            setMessage("Passwords do not match");
            return;
        } else {
            setMessage("");
        }

        try {
            const response = await fetch(RESET_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ uid, token, new_password: password, re_new_password: passwordConfirm }),
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
                <h2>Password Reset</h2>
                <div className={classes.inputs}>
                    {message && <p>{message}</p>}
                    <div className={classes.formCluster}>
                        <PwdPopup topOffset={"1.5rem"} leftOffset={"-15.5rem"} pwd={password} isShown={isExpanded} />
                        <input
                            type="password"
                            className={classes.formInput}
                            value={password}
                            name="password"
                            placeholder=""
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setIsExpanded(true)}
                            onBlur={() => setIsExpanded(false)}
                        />
                        <p className={classes.formLabel}>Password</p>
                    </div>
                    <div className={classes.formCluster}>
                        <input
                            type="password"
                            className={classes.formInput}
                            value={passwordConfirm}
                            name="password"
                            placeholder=""
                            required
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                        />
                        <p className={classes.formLabel}>Confirm Password</p>
                    </div>
                </div>
                <button onClick={isSuccess ? navToLogin : confirmPassword}>
                    {isSuccess ? "Return to Login" : "Confirm Password"}
                </button>
            </div>
        </div>
    );
};

export default PasswordResetPage;
