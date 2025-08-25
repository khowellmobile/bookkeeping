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
    };

    const switchToCreateModal = () => {
        setIsModalOpen(false);
        setIsCreateModalOpen(true);
    };

    const switchToLoginModal = () => {
        setIsCreateModalOpen(false);
        setIsModalOpen(true);
    };

    return (
        <>
            <div className={classes.mainContainer}>
                <div className={classes.header}>
                    <h2><strong>Company</strong> Name</h2>
                </div>
                <div className={classes.content}>
                    <div className={classes.contentInfo}>
                        <h1>
                            Rental Bookkeeping
                            <br /> Made Easy
                        </h1>
                        <p>
                            Gain clarity and control over your rental properties with our intuitive bookkeeping app.
                            Effortlessly track income, manage expenses, and generate professional financial reports in
                            minutes. Simplify your landlord life and watch your portfolio grow with confidence.
                        </p>
                    </div>
                    <div className={classes.loginBox}>
                        {isModalOpen && (
                            <LoginModal handleCloseModal={handleCloseModal} switchModal={switchToCreateModal} />
                        )}
                        {isCreateModalOpen && (
                            <CreateUserModal
                                handleCloseModal={handleCloseCreateModal}
                                switchModal={switchToLoginModal}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default SplashPage;
