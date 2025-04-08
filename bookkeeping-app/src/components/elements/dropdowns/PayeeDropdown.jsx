import classes from "./PayeeDropdown.module.css";

import { useState, useEffect, useRef } from "react";

const PayeeDropdown = ({ initalVal }) => {
    const [activePayee, setActivePayee] = useState(initalVal);
    const [isExpanded, setIsExpanded] = useState(false);

    const dropdownRef = useRef(null);

    const payees = [
        "Paul Blart",
        "Starbucks",
        "Michaels Law Firm",
        "Uber",
        "Google",
        "Tesla",
        "Apple",
        "Microsoft",
        "Amazon",
        "Innovative Solutions",
        "Global Tech Enterprises",
        "JP Morgan Chase",
        "Chase Bank",
        "Bank of America",
        "Wells Fargo",
        "Costco",
        "Best Buy",
        "Target",
        "Home Depot",
        "Walmart",
        "Airbnb",
        "Netflix",
        "PayPal",
        "Visa",
        "MasterCard",
        "American Express",
        "Spotify",
        "Apple Music",
        "T-Mobile",
        "Verizon",
    ];

    const clickPayeeHandler = (val) => {
        setActivePayee(val);
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
                <p>{activePayee}</p>
            </div>
            <div className={classes.arrow} onClick={() => setIsExpanded((preVal) => !preVal)}>
                <p>{isExpanded ? "△" : "▽"}</p>
            </div>
            {isExpanded && (
                <div className={classes.anchor}>
                    <div className={classes.dropDownContent}>
                        <p>Find Payee</p>
                        <input type="text" placeholder="Search..." spellCheck="false"></input>
                        <p>All Payees</p>
                        <div className={classes.separatorH}></div>
                        <div className={classes.clientListing}>
                            {payees.map((val, index) => {
                                return (
                                    <p key={index} onClick={() => clickPayeeHandler(val)}>
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

export default PayeeDropdown;
