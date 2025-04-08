import classes from "./AccountDropdown.module.css";

import { useState, useEffect, useRef } from "react";

const AccountDropdown = ({ initalVal }) => {
    const [activeAccount, setActiveAccount] = useState(initalVal);
    const [isExpanded, setIsExpanded] = useState(false);

    const dropdownRef = useRef(null);

    const accounts = [
        "Cash",
        "Accounts Receivable",
        "Accounts Payable",
        "Sales Revenue",
        "Cost of Goods Sold",
        "Inventory",
        "Bank",
        "Equity",
        "Retained Earnings",
        "Loans Payable",
        "Office Expenses",
        "Salaries Expense",
        "Utilities Expense",
        "Income Tax Expense",
        "Depreciation Expense",
        "Prepaid Expenses",
        "Accrued Liabilities",
        "Sales Tax Payable",
        "Advertising Expense",
        "Interest Expense",
    ];

    const clickAccountHandler = (val) => {
        setActiveAccount(val);
        setIsExpanded(false);
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
                            {accounts.map((val, index) => {
                                return (
                                    <p key={index} onClick={() => clickAccountHandler(val)}>
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

export default AccountDropdown;
