import { useState } from "react";

import classes from "./ProfileInformation.module.css";

import penIcon from "../../../assets/pen-icon.svg";

const ProfileInformation = () => {
    const [profileData, setProfileData] = useState({
        firstName: "John",
        lastName: "Smith",
        email: "jsmith@gmail.com",
        // Initialize password fields as empty or with appropriate default values
        password: "",
        passwordConfirm: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className={classes.mainContainer}>
            <div className={classes.header}>
                <div className={classes.leftHeader}>
                    <div className={classes.profileIcon} />
                    <div className={classes.headerText}>
                        <p>
                            {profileData.firstName} {profileData.lastName}
                        </p>
                        <p>HA Bookkeeper</p>
                    </div>
                </div>
                <div className={classes.rightHeader}></div>
            </div>
            <section className={classes.name}>
                <p>Full name</p>
                <div className={classes.fields}>
                    <div className={classes.cluster}>
                        <p>First name</p>
                        <input
                            type="text"
                            name="firstName"
                            value={profileData.firstName}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={classes.cluster}>
                        <p>Last name</p>
                        <input type="text" name="lastName" value={profileData.lastName} onChange={handleInputChange} />
                    </div>
                </div>
            </section>
            <section className={classes.email}>
                <div>
                    <p>Contact email</p>
                    <p>Manage your accounts email</p>
                </div>
                <div className={classes.fields}>
                    <div className={classes.cluster}>
                        <p>Email</p>
                        <input type="text" name="email" value={profileData.email} onChange={handleInputChange} />
                    </div>
                    <button>
                        <img src={penIcon} className={classes.icon} alt="pen icon" /> Change Email
                    </button>
                </div>
            </section>
            <section className={classes.password}>
                <div>
                    <p>Password</p>
                    <p>Change your password</p>
                </div>
                <div className={classes.fields}>
                    <div className={classes.cluster}>
                        <p>Password</p>
                        <input
                            type="password"
                            name="password"
                            value={profileData.password}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={classes.cluster}>
                        <p>Password confirm</p>
                        <input
                            type="password"
                            name="passwordConfirm"
                            value={profileData.passwordConfirm}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </section>
            <section className={classes.tools}>
                <div>
                    <p>Account Options</p>
                    <p>Manage your account settings</p>
                </div>
            </section>
        </div>
    );
};

export default ProfileInformation;
