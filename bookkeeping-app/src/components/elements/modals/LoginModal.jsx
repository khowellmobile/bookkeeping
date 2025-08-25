import classes from "./LoginModal.module.css";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import AuthCtx from "../../contexts/AuthCtx";

const LoginModal = ({ handleCloseModal, switchModal }) => {
    const { setCtxAccessToken } = useContext(AuthCtx);

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const handleLogin = (event) => {
        event.preventDefault();

        fetch("http://localhost:8000/api/auth/jwt/create/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: email,
                password: password,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((errorData) => {
                        console.error("Login failed:", errorData);
                        setErrorMsg("Login failed please try again");
                        throw new Error("Login failed");
                    });
                }
                return response.json();
            })
            .then((data) => {
                const { access } = data;
                localStorage.setItem("accessToken", access);
                setCtxAccessToken(access);
                navigate("/home");
                handleCloseModal();
            })
            .catch((error) => {
                console.error("Login failed:", error);
                setErrorMsg("Login failed please try again");
            });
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
                            value={password}
                            id="password"
                            name="password"
                            placeholder=""
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <p className={classes.formLabel}>Password</p>
                    </div>
                </section>
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
