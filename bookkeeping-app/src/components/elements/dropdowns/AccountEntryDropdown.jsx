import classes from "./AccountEntryDropdown.module.css";

import BkpgContext from "../../contexts/BkpgContext";

import { useState, useContext, useEffect, useRef } from "react";

const AccountEntryDropdown = ({ onChange }) => {
    const { ctxAccountList } = useContext(BkpgContext);

    const [selectedValue, setSelectedValue] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredAccounts, setFilteredAccounts] = useState(ctxAccountList);
    const [isExpanded, setIsExpanded] = useState(false);

    const inputRef = useRef();

    useEffect(() => {
        if (ctxAccountList) {
            const filtered = ctxAccountList.filter((account) =>
                account.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredAccounts(filtered);
        }
    }, [searchTerm, ctxAccountList]);

    const clickAccountHandler = (account) => {
        setIsExpanded(false);
        setSearchTerm(account.name); 
        if (inputRef.current) {
            inputRef.current.blur();
        }
    };

    return (
        <div className={classes.mainContainer}>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsExpanded(true); // Keep dropdown open while typing
                }}
                onFocus={() => setIsExpanded(true)} // Open on focus as before
                ref={inputRef}
                placeholder="Search Accounts..."
            />
            {isExpanded && (
                <div className={classes.anchor}>
                    <div className={classes.dropDownContent}>
                        <p>All Accounts</p>
                        <div className={classes.separatorH}></div>
                        <div className={classes.accountListing}>
                            {filteredAccounts && filteredAccounts.length > 0 ? ( // Use filteredAccounts
                                filteredAccounts.map((account, index) => (
                                    <p key={index} onClick={() => clickAccountHandler(account)}>
                                        {account.name}
                                    </p>
                                ))
                            ) : (
                                <p>No matching accounts found.</p> // Show message if no matches
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountEntryDropdown;
