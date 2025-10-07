import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import classes from "./PasswordResetPage.module.css";

const PasswordResetPage = () => {
    const { uid, token } = useParams();

    const navigate = useNavigate();

    const [message, setMessage] = useState();
    const [isSuccess, setIsSuccess] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [reqObj, setReqObj] = useState({
        chars: false,
        num: false,
        specChar: false,
    });

    const RESET_ENDPOINT = "http://127.0.0.1:8000/api/auth/users/reset_password_confirm/";

    useEffect(() => {
        if (!uid || !token) {
            setMessage("Missing token. Please return to create account and try again.");
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

    return (
        <div className={classes.mainContainer}>
            <div className={classes.modal}>
                <h2>Password Reset</h2>
                <div className={classes.inputs}>
                    <div className={classes.formCluster}>
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
                    {isExpanded && (
                        <div className={classes.anchor}>
                            <div className={classes.passwordReqs}>
                                <span>
                                    <div className={`${reqObj.chars ? classes.true : classes.false}`}>
                                        {reqObj.chars ? "✔" : "x"}
                                    </div>
                                    <p>8 or More Characters</p>
                                </span>
                                <span>
                                    <div className={`${reqObj.num ? classes.true : classes.false}`}>
                                        {reqObj.num ? "✔" : "x"}
                                    </div>
                                    <p>Number</p>
                                </span>
                                <span>
                                    <div className={`${reqObj.specChar ? classes.true : classes.false}`}>
                                        {reqObj.specChar ? "✔" : "x"}
                                    </div>
                                    <p>Special Character</p>
                                </span>
                            </div>
                        </div>
                    )}
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
                <button>{isSuccess ? "Return to Login" : "Confirm Password"}</button>
            </div>
        </div>
    );
};

export default PasswordResetPage;
