import classes from "./CreateUserModal.module.css";

import { useState, useContext, useEffect } from "react";

import AuthCtx from "../../contexts/AuthCtx";

const CreateUserModal = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [reqObj, setReqObj] = useState({
        chars: false,
        num: false,
        specChar: false,
    });

    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        setReqObj({
            chars: password.length >= 8,
            num: /\d/.test(password),
            specChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~` ]/.test(password),
        });
    }, [password]);

    const createAccount = (event) => {
        event.preventDefault();
        if (
            !(password.length >= 8 && /\d/.test(password) && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~` ]/.test(password))
        ) {
            setErrorMsg("Password does not meant requirments");
        } else if (password !== passwordConfirm) {
            setErrorMsg("Passwords do not match");
        } else {
            setErrorMsg("");
        }
    };

    return (
        <div className={classes.mainContainer}>
            return (
            <div className={classes.modalOverlay}>
                <div className={classes.mainContainer}>
                    <form className={classes.form}>
                        <section className={classes.logo}>
                            <b>H</b>
                        </section>
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
                        <button onClick={createAccount}>Create Account</button>
                        <p>
                            Already Have an Account?
                            <a href="">Login</a>
                        </p>
                    </form>
                </div>
            </div>
            );
        </div>
    );
};

export default CreateUserModal;
