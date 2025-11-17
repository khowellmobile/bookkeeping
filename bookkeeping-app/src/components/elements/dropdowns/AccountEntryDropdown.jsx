import { useState, useContext, useEffect, useRef } from "react";

import classes from "./AccountEntryDropdown.module.css";

import AccountsCtx from "../../contexts/AccountsCtx";
import AddAccountModal from "../modals/AddAccountModal";
import Button from "../utilities/Button";

const AccountEntryDropdown = ({ vals, scrollRef, onChange, hasLeftBorder = false }) => {
    const { ctxAccountList } = useContext(AccountsCtx);

    const [searchTerm, setSearchTerm] = useState("");
    const [filteredAccounts, setFilteredAccounts] = useState(ctxAccountList);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        // Needs fix from issue #217 in github
        setSearchTerm(vals && vals.account.id ? vals.account.name : "");
    }, [ctxAccountList, vals]);

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

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const clickAccountHandler = (account) => {
        setIsExpanded(false);
        setSearchTerm(account.name);
        onChange(account);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const handleBlur = () => {
        setTimeout(() => {
            setIsExpanded(false);
        }, 150);
    };

    return (
        <>
            {isModalOpen && <AddAccountModal handleCloseModal={handleCloseModal} />}

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
                    style={hasLeftBorder ? { borderLeft: "1px dashed var(--border-color)" } : {}}
                />
                {isExpanded && (
                    <div className={`${classes.anchor} ${isExpanded ? "" : classes.noDisplay}`} role="dropdown-anchor">
                        <div className={classes.dropDownContent} style={style}>
                            <div className={classes.dropdownHeader}>
                                <p>All Accounts</p>
                                <Button onClick={() => setIsModalOpen(true)} text={"Add Account"} />
                            </div>
                            <div className={classes.separatorH}></div>
                            <div className={classes.accountListing}>
                                {filteredAccounts && filteredAccounts.length > 0 ? (
                                    filteredAccounts.map((account, index) => (
                                        <p key={index} onClick={() => clickAccountHandler(account)}>
                                            {account.name}
                                        </p>
                                    ))
                                ) : (
                                    <p>No matching accounts found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default AccountEntryDropdown;
