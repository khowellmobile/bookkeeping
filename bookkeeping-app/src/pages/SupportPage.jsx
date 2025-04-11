import classes from "./SupportPage.module.css";

import { useState } from "react";

const SupportPage = () => {
    const [activeGroup, setACtiveGroup] = useState("General");

    const supportGroups = ["Q & A", "Email Us", "Submit a Ticket"];

    return (
        <div className={classes.mainContainer}>
            <div className={classes.groupList}>
                {supportGroups.map((group, index) => (
                    <div className={classes.supportGroup} key={index} onClick={() => setACtiveGroup(group)}>
                        <p>{group}</p>
                    </div>
                ))}
            </div>
            <div className={classes.groupContent}>
                <section className={classes.contentHeader}>
                    <h2>{activeGroup}</h2>
                </section>
                <section className={classes.content}></section>
            </div>
        </div>
    );
};

export default SupportPage;
