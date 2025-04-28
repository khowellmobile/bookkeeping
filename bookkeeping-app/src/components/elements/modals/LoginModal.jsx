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
        setErrorMsg("");
        try {
            const response = await fetch('http://localhost:8000/api/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: email, //
                    password: password,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Login failed:', errorData);
                setErrorMsg("Login failed please try again");
                return;
            }

            const data = await response.json();
            const { access } = data;
            localStorage.setItem('accessToken', access);
            console.log('Login successful, token stored!');
            navigate("/home"); 
            handleCloseModal();
        } catch (error) {
            console.error('Login failed:', error);
            setErrorMsg("Login failed please try again");
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
                        <a href="">Sign Up</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;