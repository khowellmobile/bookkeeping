import classes from "./AccountEntryDropdown.module.css";

import BkpgContext from "../../contexts/BkpgContext";

import { useState, useContext, useEffect, useRef } from "react";

const AccountEntryDropdown = ({ scrollRef, onChange }) => {
    const { ctxAccountList } = useContext(BkpgContext);

    const [searchTerm, setSearchTerm] = useState("");
    const [filteredAccounts, setFilteredAccounts] = useState(ctxAccountList);
    const [isExpanded, setIsExpanded] = useState(false);

    const [isOffScreenBottom, setIsOffScreenBottom] = useState();
    const [pxScroll, setPxScroll] = useState(0);

    const inputRef = useRef();

    let style = isOffScreenBottom
        ? { bottom: `calc(1.5rem + ${pxScroll}px + 1px)` }
        : { top: `calc(1.5rem - ${pxScroll}px)` };

    const checkOffScreen = () => {
        try {
            const r = inputRef.current;

            if (r) {
                const rectR = r.getBoundingClientRect();
                const windowHeight = window.innerHeight || document.documentElement.clientHeight;
                const isOffScreenBottom = rectR.bottom + 320 > windowHeight;
                setIsOffScreenBottom(isOffScreenBottom);
            }
        } catch (error) {
            console.log(error, "Safe to ignore");
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (scrollRef.current) {
                setIsExpanded(false);
                setPxScroll(scrollRef.current.scrollTop);
            } else {
                console.log("scrollRef.current is null");
            }
        };

        const scrollableDiv = scrollRef.current;
        if (scrollableDiv) {
            scrollableDiv.addEventListener("scroll", handleScroll);
        }
    }, []);

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
        onChange(account);
        inputRef.current = account.name;
    };

    const handleBlur = () => {
        setTimeout(() => {
            setIsExpanded(false);
        }, 150);
    };

    return (
        <div className={classes.mainContainer} onFocus={() => checkOffScreen()}>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsExpanded(true);
                }}
                onFocus={() => setIsExpanded(true)}
                onBlur={handleBlur}
                ref={inputRef}
            />
            <div className={`${classes.anchor} ${isExpanded ? "" : classes.noDisplay}`}>
                <div className={classes.dropDownContent} style={style}>
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
        </div>
    );
};

export default AccountEntryDropdown;
