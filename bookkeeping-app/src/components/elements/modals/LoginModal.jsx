import classes from "./LoginModal.module.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginModal = ({ handleCloseModal }) => {
    const navigate = useNavigate();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch("http://127.0.0.1:8000/api/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username: email, password: password }),
            });
            const data = await response.json();
            if (response.ok) {
                console.log("Login successful:", data);
                navigate("/home");
            } else if (response.status === 401) {
                console.error("Login failed:", data);
            } else {
                console.error("Login error:", data);
            }
        } catch (error) {
            console.error("Error during login:", error);
        }
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
                    {errorMsg && (
                        <section className={classes.errors}>
                            <p>Login failed please try again</p>
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
