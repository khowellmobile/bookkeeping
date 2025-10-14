import DisplaySettings from "../components/elements/misc/DisplaySettings";
import ProfileInformation from "../components/elements/misc/ProfileInformation";
import classes from "./SettingsPage.module.css";

import { useState } from "react";

const SettingsPage = () => {
    const [activeGroup, setACtiveGroup] = useState("General");

    const settingGroups = ["General", "Audio", "Display", "Security", "Accessibility", "Profile"];

    return (
        <div className={classes.mainContainer}>
            <div className={classes.groupList}>
                {settingGroups.map((group, index) => (
                    <div className={classes.settingGroup} key={index} onClick={() => setACtiveGroup(group)}>
                        <p>{group}</p>
                    </div>
                ))}
            </div>
            <div className={classes.groupContent}>
                <section className={classes.contentHeader}>
                    <h2>{activeGroup}</h2>
                </section>
                <section className={classes.content}>
                    {activeGroup == "Profile" && <ProfileInformation />}
                    {activeGroup == "Display" && <DisplaySettings />}
                </section>
            </div>
        </div>
    );
};

export default SettingsPage;
