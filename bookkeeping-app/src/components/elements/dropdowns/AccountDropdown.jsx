import classes from "./AccountDropdown.module.css";

import { useState, useEffect, useRef } from "react";

const AccountDropdown = ({ initalVal, onChange, accountList }) => {
    const [activeAccount, setActiveAccount] = useState(initalVal);
    const [isExpanded, setIsExpanded] = useState(false);
    const [accounts, setAccounts] = useState(accountList); // Might not need useState here

    const dropdownRef = useRef(null);

    const clickAccountHandler = (accountName) => {
        setActiveAccount(accountName);
        setIsExpanded(false);
        onChange(accountName);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsExpanded(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className={classes.mainContainer} ref={dropdownRef}>
            <div className={classes.display} onClick={() => setIsExpanded((preVal) => !preVal)}>
                <p>{activeAccount}</p>
            </div>
            <div className={classes.arrow} onClick={() => setIsExpanded((preVal) => !preVal)}>
                <p>{isExpanded ? "△" : "▽"}</p>
            </div>
            {isExpanded && (
                <div className={classes.anchor}>
                    <div className={classes.dropDownContent}>
                        <p>Find Account</p>
                        <input type="text" placeholder="Search..." spellCheck="false"></input>
                        <p>All Accounts</p>
                        <div className={classes.separatorH}></div>
                        <div className={classes.clientListing}>
                            {accounts.map((account, index) => {
                                return (
                                    <p key={index} onClick={() => clickAccountHandler(account.name)}>
                                        {account.name}
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

export default AccountDropdown;
