import classes from "./LoginModal.module.css";

import { useState } from "react";

const LoginModal = ({ handleCloseModal }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (event) => {
        event.preventDefault();
        console.log(email, password);
    };

    return (
        <div className={classes.modalOverlay}>
            <div className={classes.mainContainer}>
                <form className={classes.form} onSubmit={handleLogin}>
                    <section className={classes.logo}>
                        <b>H</b>
                    </section>
                    <section className={classes.header}>
                        <b>Welcome Back</b>
                        <p>Please enter your details</p>
                    </section>
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
                            />
                            <p className={classes.formLabel}>Email</p>
                        </div>
                        <div className={classes.formCluster}>
                            <input
                                type="password"
                                className={classes.formInput}
                                id="password"
                                name="password"
                                placeholder=""
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <p className={classes.formLabel}>Password</p>
                        </div>
                    </section>
                    <button type="submit">Login</button>
                    <p>
                        Dont have an Account?
                        <a href="">Sign Up</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;
