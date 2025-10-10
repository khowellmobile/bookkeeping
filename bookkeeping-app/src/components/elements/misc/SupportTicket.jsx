import Button from "../utilities/Button";
import classes from "./SupportTicket.module.css";

import { useState } from "react";

const SupportTicket = () => {
    const [subject, setSubject] = useState("");
    const [email, setEmail] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");

    return (
        <div className={classes.mainContainer}>
            <div className={classes.inputCluster}>
                <p>Subject</p>
                <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div className={classes.inputCluster}>
                <p>Email</p>
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className={classes.inputCluster}>
                <p>Category</p>
                <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
            <p>Please describe the issue</p>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            <div className={classes.buttonDiv}>
                <Button text={"Submit"} />
            </div>
        </div>
    );
};

export default SupportTicket;
