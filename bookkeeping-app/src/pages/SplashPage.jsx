import classes from "./SplashPage.module.css";

import LoginModal from "../components/elements/modals/LoginModal";

import { useState } from "react";

const SplashPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(true);

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            {isModalOpen && <LoginModal handleCloseModal={handleCloseModal} />}

            <div className={classes.mainContainer}>
                <p>Splash</p>
                <button className={classes.loginButton}>Login</button>
            </div>
        </>
    );
};

export default SplashPage;
