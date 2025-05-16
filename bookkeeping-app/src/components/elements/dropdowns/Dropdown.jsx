import classes from "./Dropdown.module.css";

import { useState } from "react";

const Dropdown = () => {
    const [activeClient, setActiveClient] = useState("None Selected");
    const [isExpanded, setIsExpanded] = useState(false);

    const clients = [
        "Chase",
        "Uber",
        "Google",
        "Tesla",
        "Apple",
        "Microsoft",
        "Amazon",
        "Innovative Solutions",
        "Global Tech Enterprises",
        "JP Morgan Chase",
        "Chase",
        "Uber",
        "Google",
        "Tesla",
        "Apple",
        "Microsoft",
        "Amazon",
        "Innovative Solutions",
        "Global Tech Enterprises",
        "JP Morgan Chase",
    ];

    const clickClientHandler = (val) => {
        setActiveClient(val);
        setIsExpanded(false);
    };

    return (
        <div className={classes.mainContainer}>
            <div className={classes.display}>
                <p>{activeClient}</p>
            </div>
            <div className={classes.arrow} onClick={() => setIsExpanded((preVal) => !preVal)}>
                <p>{isExpanded ? "△" : "▽"}</p>
            </div>
            {isExpanded && (
                <div className={classes.anchor}>
                    <div className={classes.dropDownContent}>
                        <p>Find Client</p>
                        <input type="text" placeholder="Search..." spellCheck="false"></input>
                        <p>All Clients</p>
                        <div className={classes.separatorH}></div>
                        <div className={classes.clientListing}>
                            {clients.map((val, index) => {
                                return (
                                    <p key={index} onClick={() => clickClientHandler(val)}>
                                        {val}
                                    </p>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dropdown;
