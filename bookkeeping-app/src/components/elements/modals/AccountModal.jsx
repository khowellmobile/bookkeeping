import classes from "./AccountModal.module.css";

import BkpgContext from "../../contexts/BkpgContext";
import { useContext, useState } from "react";

import upChevIcon from "../../../assets/chevron-up-icon.svg";
import downChevIcon from "../../../assets/chevron-down-icon.svg";

const AccountModal = ({ account, handleCloseModal }) => {
    const { setCtxAccountList } = useContext(BkpgContext);

    const [accountName, setAccountName] = useState(account.name);
    const [accountType, setAccountType] = useState(account.type.charAt(0).toUpperCase() + account.type.slice(1));
    const [accountInitBalance, setAccountInitBalance] = useState(account.initial_balance);
    const [accountDescription, setAccountDescription] = useState(account.description);
    const [editedAccount, setEditedAccount] = useState({ id: account.id });
    const [isExpanded, setIsExpanded] = useState(false);

    const accountTypes = ["Asset", "Bank", "Equity", "Liability"];

    const handleNameChange = (event) => {
        setAccountName(event.target.value);
        setEditedAccount((prev) => ({ ...prev, name: event.target.value }));
    };

    const clickTypeHandler = (type) => {
        setAccountType(type);
        setEditedAccount((prev) => ({ ...prev, type: type.toLowerCase() }));
        setIsExpanded(false);
    };

    const handleInitBalanceChange = (event) => {
        setAccountInitBalance(event.target.value);
        setEditedAccount((prev) => ({ ...prev, initial_balance: event.target.value }));
    };

    const handleDescChange = (event) => {
        setAccountDescription(event.target.value);
        setEditedAccount((prev) => ({ ...prev, description: event.target.value }));
    };

    const updateAccount = async () => {
        const accessToken = localStorage.getItem("accessToken");

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/accounts/${account.id}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(editedAccount),
            });

            if (!response.ok) {
                console.log("Error:", response.error);
                return;
            }

            const updatedData = await response.json();

            setCtxAccountList((prevAccounts) =>
                prevAccounts.map((acc) => {
                    if (acc.id === account.id) {
                        return updatedData;
                    } else {
                        return acc;
                    }
                })
            );

            handleCloseModal();
        } catch (error) {
            console.error("Error editing account:", error);
        }
    };

    return (
        <div className={classes.modalOverlay}>
            <div className={classes.mainContainer}>
                <h2>Edit Account</h2>
                <div className={classes.seperatorH} />
                <div className={`${classes.inputCluster}`}>
                    <p>Name</p>
                    <input type="text" value={accountName} onChange={handleNameChange} />
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
                <div className={`${classes.inputCluster}`}>
                    <p>Initial Balance</p>
                    <input type="text" value={accountInitBalance} onChange={handleInitBalanceChange} />
                </div>

                <div className={`${classes.inputCluster}`}>
                    <p>Description</p>
                    <input type="text" value={accountDescription} onChange={handleDescChange} />
                </div>
                <div className={classes.buttons}>
                    <button onClick={updateAccount}>Save & Close</button>
                    <button onClick={handleCloseModal}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default AccountModal;
