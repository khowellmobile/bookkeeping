import { useState, useContext } from "react";

import classes from "./ProfileInformation.module.css";

import AuthCtx from "../../contexts/AuthCtx";
import penIcon from "../../../assets/pen-icon.svg";

const ProfileInformation = () => {
    const { ctxUpdateUser, ctxUserData } = useContext(AuthCtx);

    const [profileData, setProfileData] = useState(ctxUserData);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const changeProf = () => {
        const mutatedData = profileData;
        delete mutatedData.password;
        delete mutatedData.passwordConfirm;
        ctxUpdateUser(profileData);
    };

    const capitilizeFirst = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    return (
        <div className={classes.mainContainer}>
            <div className={classes.header}>
                <div className={classes.leftHeader}>
                    <div className={classes.profileIcon} />
                    <div className={classes.headerText}>
                        <p>
                            {capitilizeFirst(profileData.first_name)} {capitilizeFirst(profileData.last_name)}
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
                            name="first_name"
                            value={capitilizeFirst(profileData.first_name)}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={classes.cluster}>
                        <p>Last name</p>
                        <input
                            type="text"
                            name="last_name"
                            value={capitilizeFirst(profileData.last_name)}
                            onChange={handleInputChange}
                        />
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
                    <button onClick={changeProf}>
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
