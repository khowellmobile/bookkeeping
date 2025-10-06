import { useState, useEffect } from "react";

import classes from "./CreateUserModal.module.css";

const CreateUserModal = ({ handleCloseModal, switchModal }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [reqObj, setReqObj] = useState({
        chars: false,
        num: false,
        specChar: false,
    });
    const [waitingOnEmail, setWaitingOnEmail] = useState(false);

    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        setReqObj({
            chars: password.length >= 8,
            num: /\d/.test(password),
            specChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password),
        });
    }, [password]);

    const createAccount = async (event) => {
        event.preventDefault();
        if (
            !(password.length >= 8 && /\d/.test(password) && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password))
        ) {
            setErrorMsg("Password does not meant requirments");
            return;
        } else if (password !== passwordConfirm) {
            setErrorMsg("Passwords do not match");
            return;
        } else {
            setErrorMsg("");
        }

        try {
            const response = await fetch("http://localhost:8000/api/auth/users/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    username: email,
                    password: password,
                    re_password: passwordConfirm,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Account creation failed:", errorData);

                if (errorData.email) {
                    setErrorMsg(`Email: ${errorData.email.join(" ")}`);
                } else if (errorData.password) {
                    setErrorMsg(`Password: ${errorData.password.join(" ")}`);
                } else if (errorData.re_password) {
                    setErrorMsg(`Confirm Password: ${errorData.re_password.join(" ")}`);
                } else if (errorData.non_field_errors) {
                    setErrorMsg(errorData.non_field_errors.join(" "));
                } else if (errorData.detail) {
                    setErrorMsg(errorData.detail);
                } else {
                    setErrorMsg("Account creation failed. Please try again.");
                }
                return;
            }

            const data = await response.json();
            setWaitingOnEmail(true);
            return data;
        } catch (error) {
            console.error("Network or unexpected error during account creation:", error);
            setErrorMsg("A network error occurred. Please try again later.");
        }
    };

    return (
        <div className={classes.mainContainer}>
            <form className={classes.form}>
                <section className={classes.logo}>
                    <b>H</b>
                </section>

                {!waitingOnEmail ? (
                    <>
                        <section className={classes.header}>
                            <b>Create Account</b>
                            <p>Please enter your details</p>
                        </section>
                        {errorMsg && (
                            <section className={classes.errors}>
                                <p>{errorMsg}</p>
                            </section>
                        )}
                        <section className={classes.inputs}>
                            <div className={classes.formCluster}>
                                <input
                                    type="text"
                                    className={classes.formInput}
                                    value={email}
                                    name="email"
                                    placeholder=""
                                    required
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <p className={classes.formLabel}>Email</p>
                            </div>
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
                        </section>
                    </>
                ) : (
                    <p>A confirmation email has been sent to {email}. Please return to login!</p>
                )}

                <button onClick={waitingOnEmail ? switchModal : createAccount}>
                    {waitingOnEmail ? "Back to Login" : "Create Account"}
                </button>
                {!waitingOnEmail && (
                    <p>
                        Already Have an Account?
                        <a onClick={switchModal}>Login</a>
                    </p>
                )}
            </form>
        </div>
    );
};

export default CreateUserModal;
