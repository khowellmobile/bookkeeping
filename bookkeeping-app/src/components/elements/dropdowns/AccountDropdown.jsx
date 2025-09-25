import { useState, useEffect, useRef, useContext } from "react";

import classes from "./AccountDropdown.module.css";

import AccountsCtx from "../../contexts/AccountsCtx";
import upChevIcon from "../../../assets/chevron-up-icon.svg";
import downChevIcon from "../../../assets/chevron-down-icon.svg";

const AccountDropdown = ({ initalVal, onChange }) => {
    const { ctxAccountList } = useContext(AccountsCtx);

    const [activeAccount, setActiveAccount] = useState(initalVal || { name: "" });
    const [isExpanded, setIsExpanded] = useState(false);
    const dropdownRef = useRef(null);

    const clickAccountHandler = (account) => {
        setActiveAccount(account);
        setIsExpanded(false);
        onChange(account);
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

    /* Ensures activeAccount stays consistent with passed value */
    useEffect(() => {
        setActiveAccount(initalVal);
    }, [initalVal]);

    return (
        <div className={classes.mainContainer} ref={dropdownRef}>
            <div className={classes.display} onClick={() => setIsExpanded((preVal) => !preVal)}>
                <p>{activeAccount.name}</p>
            </div>
            <div className={classes.arrow} onClick={() => setIsExpanded((preVal) => !preVal)}>
                <img src={isExpanded ? upChevIcon : downChevIcon} className={classes.icon} />
            </div>
            {isExpanded && (
                <div className={classes.anchor}>
                    <div className={classes.dropDownContent}>
                        <p>Find Account</p>
                        <input type="text" placeholder="Search..." spellCheck="false"></input>
                        <p>All Accounts</p>
                        <div className={classes.separatorH}></div>
                        <div className={classes.accountListing}>
                            {ctxAccountList &&
                                ctxAccountList.map((account, index) => {
                                    return (
                                        <p key={index} onClick={() => clickAccountHandler(account)}>
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
