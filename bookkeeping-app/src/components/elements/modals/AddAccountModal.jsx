import { useState } from "react";
import classes from "./AddAccountModal.module.css";

import upChevIcon from "../../../assets/chevron-up-icon.svg";
import downChevIcon from "../../../assets/chevron-down-icon.svg";

const AddAccountModal = ({ setPageAccounts, handleCloseModal }) => {
    const [accountName, setAccountName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [accountType, setAccountType] = useState("");
    const [initialBalance, setInitialBalance] = useState("");
    const [accountDescription, setAccountDescription] = useState("");

    const [isExpanded, setIsExpanded] = useState(false);

    const accountTypes = ["Asset", "Bank", "Equity", "Liability"];

    const handleSaveClick = () => {
        addAccount();
        handleCloseModal();
    };

    const addAccount = async () => {
        const accessToken = localStorage.getItem("accessToken");

        const accountToAdd = {
            name: accountName,
            type: accountType.toLowerCase(),
            initial_balance: initialBalance,
            description: accountDescription,
            account_number: accountNumber,
        };

        try {
            const response = await fetch("http://127.0.0.1:8000/api/accounts/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(accountToAdd),
            });

            if (!response.ok) {
                console.log(response);
            }

            /* setPageTrans((prev) => [...prev, transactionsToAdd]); */
            console.log("Account sent (check your Django backend)");
        } catch (error) {
            console.error("Error sending Account Info:", error);
        }
    };

    const clickTypeHandler = (type) => {
        setAccountType(type);
        setIsExpanded(false);
    };

    return (
        <div className={classes.modalOverlay}>
            <div className={classes.mainContainer}>
                <section className={classes.top}>
                    <h2>New Account Creation</h2>
                    <div className={classes.seperatorH} />
                    <div className={classes.inputCluster}>
                        <p className={classes.label}>Account Name</p>
                        <input
                            type="text"
                            placeholder="Enter account name (e.g., Checking, Savings, Credit Card)"
                            value={accountName}
                            onChange={(e) => setAccountName(e.target.value)}
                        />
                    </div>
                    <div className={classes.inputCluster}>
                        <p className={classes.label}>Account Number</p>
                        <input
                            type="text"
                            placeholder="Enter account number (optional)"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                        />
                    </div>
                    <div className={classes.inputCluster}>
                        <p className={classes.label}>Account Type</p>
                        <div className={classes.accountTypeDiv} onClick={() => setIsExpanded((prev) => !prev)}>
                            {accountType ? (
                                <p>{accountType}</p>
                            ) : (
                                <p className={classes.placeholder}>Select account type</p>
                            )}

                            <img src={isExpanded ? upChevIcon : downChevIcon} className={classes.icon} />
                        </div>
                        <div className={`${classes.anchor} ${isExpanded ? "" : classes.noDisplay}`}>
                            <div className={classes.dropdown}>
                                {accountTypes.map((type, index) => {
                                    return (
                                        <p key={index} onClick={() => clickTypeHandler(type)}>
                                            {type}
                                        </p>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className={classes.inputCluster}>
                        <p className={classes.label}>Initial Balance</p>
                        <input
                            type="text"
                            placeholder="Enter starting balance (e.g., 0.00)"
                            value={initialBalance}
                            onChange={(e) => setInitialBalance(e.target.value)}
                        />
                    </div>
                    <textarea
                        value={accountDescription}
                        onChange={(e) => setAccountDescription(e.target.value)}
                    ></textarea>
                </section>
                <section className={classes.buttons}>
                    <button onClick={handleSaveClick}>Save & Close</button>
                    <button onClick={handleCloseModal}>Close</button>
                </section>
            </div>
        </div>
    );
};

export default AddAccountModal;
