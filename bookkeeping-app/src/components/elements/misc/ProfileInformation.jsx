import { useState, useContext, useEffect } from "react";

import classes from "./ProfileInformation.module.css";

import AuthCtx from "../../contexts/AuthCtx";
import penIcon from "../../../assets/pen-icon-grey.svg";
import saveIcon from "../../../assets/save-icon-grey.svg";

const ProfileInformation = () => {
    const { ctxUpdateUser, ctxUserData, ctxUpdatePwd } = useContext(AuthCtx);

    const [pwdMsg, setPwdMsg] = useState("");
    const [profileData, setProfileData] = useState(ctxUserData);
    const [passwordData, setPasswordData] = useState({
        password_current: "",
        password_new: "",
        password_confirm: "",
    });
    const [initalData, setInitialData] = useState(ctxUserData);
    const [inputState, setInputState] = useState({
        first_name: false,
        last_name: false,
        email: false,
        password: false,
    });
    const [isExpanded, setIsExpanded] = useState(false);
    const [reqObj, setReqObj] = useState({
        chars: false,
        num: false,
        specChar: false,
    });

    const disabledStyle = {
        backgroundColor: "var(--border-color)",
    };

    useEffect(() => {
        setReqObj({
            chars: passwordData.password_new.length >= 8,
            num: /\d/.test(passwordData.password_new),
            specChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(passwordData.password_new),
        });
    }, [passwordData.password_new]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePwdInput = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const changeInputStateAndSave = (name) => {
        setInputState((prev) => {
            const newState = { ...prev, [name]: !prev[name] };
            if (prev[name] === true && newState[name] === false) {
                updateBackendProfile();
            }
            return newState;
        });
    };

    const updateBackendProfile = () => {
        if (JSON.stringify(profileData) === JSON.stringify(initalData)) {
            return;
        }

        const dataToSend = {
            first_name: profileData.first_name,
            last_name: profileData.last_name,
            email: profileData.email,
        };

        ctxUpdateUser(dataToSend);
        setInitialData((prev) => ({ ...prev, ...dataToSend }));
    };

    const changePasswordState = () => {
        setInputState((prev) => {
            const newState = { ...prev, password: !prev["password"] };
            if (prev["password"] == true && newState["password"] === false) {
                updatePwd();
                console.log("CHCEK");
            }
            return newState;
        });
    };

    const updatePwd = () => {
        if (passwordData.password_new !== passwordData.password_confirm) {
            setPwdMsg("New password must match password confirmation.");
            return;
        }

        const pwd = passwordData.password_new;
        const passesReqs = pwd.length >= 8 && /\d/.test(pwd) && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(pwd);
        if (!passesReqs) {
            setPwdMsg("New password must pass length, digit, and symbol requirements.");
            return;
        }

        ctxUpdatePwd(passwordData.password_current, passwordData.password_new, passwordData.password_confirm);
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
                        <span>
                            <input
                                type="text"
                                name="first_name"
                                style={!inputState.first_name ? disabledStyle : null}
                                value={capitilizeFirst(profileData.first_name)}
                                onChange={handleInputChange}
                                disabled={!inputState.first_name}
                            />
                            <div onClick={() => changeInputStateAndSave("first_name")}>
                                <img
                                    src={!inputState.first_name ? penIcon : saveIcon}
                                    className={classes.icon}
                                    alt="pen icon"
                                />
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
                            <div onClick={() => changeInputStateAndSave("last_name")}>
                                <img
                                    src={!inputState.last_name ? penIcon : saveIcon}
                                    className={classes.icon}
                                    alt="pen icon"
                                />
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
                            <div onClick={() => changeInputStateAndSave("email")}>
                                <img
                                    src={!inputState.email ? penIcon : saveIcon}
                                    className={classes.icon}
                                    alt="pen icon"
                                />
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
                <div className={classes.pwdFields}>
                    <div className={classes.newPwdClusters}>
                        <div className={classes.cluster}>
                            <p>Current password</p>
                            <span>
                                <input
                                    type="password"
                                    name="password_current"
                                    value={profileData.password}
                                    style={!inputState.password ? disabledStyle : null}
                                    onChange={handlePwdInput}
                                    disabled={!inputState.password}
                                />
                                <div onClick={() => changePasswordState("password")}>
                                    <img
                                        src={!inputState.password ? penIcon : saveIcon}
                                        className={classes.icon}
                                        alt="pen icon"
                                    />
                                </div>
                            </span>
                        </div>
                    </div>
                    {inputState.password && (
                        <div className={classes.newPwdClusters}>
                            <div className={classes.cluster}>
                                <p>New password</p>
                                <span>
                                    <input
                                        type="password"
                                        name="password_new"
                                        style={{ borderRadius: "0.25rem" }}
                                        value={profileData.password}
                                        onChange={handlePwdInput}
                                        onFocus={() => setIsExpanded(true)}
                                        onBlur={() => setIsExpanded(false)}
                                    />
                                    {isExpanded && (
                                        <div className={classes.anchor}>
                                            <div className={classes.passwordReqs}>
                                                <span>
                                                    <div className={`${reqObj.chars ? classes.true : classes.false}`}>
                                                        {reqObj.chars ? "✔" : "x"}
                                                    </div>
                                                    <p>8 or More Characters</p>
                                                </span>
                                                <span>
                                                    <div className={`${reqObj.num ? classes.true : classes.false}`}>
                                                        {reqObj.num ? "✔" : "x"}
                                                    </div>
                                                    <p>Number</p>
                                                </span>
                                                <span>
                                                    <div
                                                        className={`${reqObj.specChar ? classes.true : classes.false}`}
                                                    >
                                                        {reqObj.specChar ? "✔" : "x"}
                                                    </div>
                                                    <p>Special Character</p>
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </span>
                            </div>
                            <div className={classes.cluster}>
                                <p>Confirm new password</p>
                                <span>
                                    <input
                                        type="password"
                                        name="password_confirm"
                                        style={{ borderRadius: "0.25rem" }}
                                        value={profileData.passwordConfirm}
                                        onChange={handlePwdInput}
                                    />
                                </span>
                            </div>
                        </div>
                    )}
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
