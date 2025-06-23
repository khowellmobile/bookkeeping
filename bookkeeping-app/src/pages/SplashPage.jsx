import classes from "./SplashPage.module.css";

import LoginModal from "../components/elements/modals/LoginModal";
import CreateUserModal from "../components/elements/modals/CreateUserModal";

import { useState } from "react";

const SplashPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
    }

    const switchToCreateModal = () => {
        setIsModalOpen(false);
        setIsCreateModalOpen(true);
    }

    const switchToLoginModal = () => {
        setIsCreateModalOpen(false);
        setIsModalOpen(true);
    }

    return (
        <>
            {isModalOpen && <LoginModal handleCloseModal={handleCloseModal} switchModal={switchToCreateModal}/>}
            {isCreateModalOpen && <CreateUserModal handleCloseModal={handleCloseCreateModal} switchModal={switchToLoginModal}/>}

            <div className={classes.mainContainer}>
                <p>Splash</p>
                <button className={classes.loginButton}>Login</button>
            </div>
        </>
    );
};

export default SplashPage;
