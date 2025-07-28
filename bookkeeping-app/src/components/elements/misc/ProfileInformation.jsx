import { useState, useContext, useEffect } from "react";

import classes from "./ProfileInformation.module.css";

import AuthCtx from "../../contexts/AuthCtx";
import penIcon from "../../../assets/pen-icon-grey.svg";

const ProfileInformation = () => {
    const { ctxUpdateUser, ctxUserData } = useContext(AuthCtx);

    const [profileData, setProfileData] = useState(ctxUserData);
    const [inputState, setInputState] = useState({
        first_name: false,
        last_name: false,
        email: false,
    });

    const disabledStyle = {
        backgroundColor: "var(--border-color)",
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const changeInputState = (name) => {
        setInputState((prev) => ({
            ...prev,
            [name]: !prev[name],
        }));
    };

    const changeProf = () => {
        const mutatedData = profileData;
        delete mutatedData.password;
        delete mutatedData.passwordConfirm;
        ctxUpdateUser(profileData);
    };

    useEffect(() => {
        if (JSON.stringify(profileData) !== JSON.stringify(ctxUserData)) {
            changeProf();
        }
    }, [profileData, ctxUserData]);

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
                        <span>
                            <input
                                type="text"
                                name="first_name"
                                style={!inputState.first_name ? disabledStyle : null}
                                value={capitilizeFirst(profileData.first_name)}
                                onChange={handleInputChange}
                                disabled={!inputState.first_name}
                            />
                            <div onClick={() => changeInputState("first_name")}>
                                <img src={penIcon} className={classes.icon} alt="pen icon" />
                            </div>
                        </span>
                    </div>
                    <div className={classes.cluster}>
                        <p>Last name</p>
                        <span>
                            <input
                                type="text"
                                name="last_name"
                                style={!inputState.last_name ? disabledStyle : null}
                                value={capitilizeFirst(profileData.last_name)}
                                onChange={handleInputChange}
                                disabled={!inputState.last_name}
                            />
                            <div onClick={() => changeInputState("last_name")}>
                                <img src={penIcon} className={classes.icon} alt="pen icon" />
                            </div>
                        </span>
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
                        <span>
                            <input
                                type="text"
                                name="email"
                                value={profileData.email}
                                style={!inputState.email ? disabledStyle : null}
                                onChange={handleInputChange}
                                disabled={!inputState.email}
                            />
                            <div onClick={() => changeInputState("email")}>
                                <img src={penIcon} className={classes.icon} alt="pen icon" />
                            </div>
                        </span>
                    </div>
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
                        <span>
                            <input
                                type="password"
                                name="password"
                                value={profileData.password}
                                onChange={handleInputChange}
                            />
                            <div>
                                <img src={penIcon} className={classes.icon} alt="pen icon" />
                            </div>
                        </span>
                    </div>
                    <div className={classes.cluster}>
                        <p>Password confirm</p>
                        <span>
                            <input
                                type="password"
                                name="passwordConfirm"
                                value={profileData.passwordConfirm}
                                onChange={handleInputChange}
                            />
                            <div>
                                <img src={penIcon} className={classes.icon} alt="pen icon" />
                            </div>
                        </span>
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
