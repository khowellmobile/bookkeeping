import classes from "./LoginModal.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { UseAuth } from "../../../hooks/UseAuth";

const LoginModal = ({ handleCloseModal, switchModal }) => {
    const { login, requestPswdReset } = UseAuth();

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const pswdResetClick = async () => {
        if (!email || email.trim().length == 0) {
            setMessage("Ensure a proper email is entered before resetting password.");
            return;
        }

        const responseMsg = await requestPswdReset(email);
        setMessage(responseMsg.message);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const responseMsg = await login(email, password);
        setMessage(responseMsg.message);

        if (responseMsg.success) {
            console.log("success");
            navigate("/app/home");
        }
    };

    return (
        <div className={classes.mainContainer}>
            <form className={classes.form} onSubmit={handleLogin}>
                <section className={classes.logo}>
                    <b>H</b>
                </section>
                <section className={classes.header}>
                    <b>Welcome Back</b>
                    <p>Please enter your details</p>
                </section>
                {message && (
                    <section className={classes.messages}>
                        <p>{message}</p>
                    </section>
                )}
                <section className={classes.inputs}>
                    <div className={classes.formCluster}>
                        <input
                            type="text"
                            className={classes.formInput}
                            value={email}
                            id="email"
                            name="email"
                            placeholder=""
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            data-testid="input-email"
                        />
                        <p className={classes.formLabel}>Email</p>
                    </div>
                    <div className={classes.formCluster}>
                        <input
                            type="password"
                            className={classes.formInput}
                            value={password}
                            id="password"
                            name="password"
                            placeholder=""
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            data-testid="input-password"
                        />
                        <p className={classes.formLabel}>Password</p>
                    </div>
                </section>
                <p>
                    Forgot your password?<a onClick={pswdResetClick}>Password Reset</a>
                </p>
                <button type="submit">Login</button>
                <p>
                    Dont have an Account?
                    <a onClick={switchModal}>Sign Up</a>
                </p>
            </form>
        </div>
    );
};

export default LoginModal;
