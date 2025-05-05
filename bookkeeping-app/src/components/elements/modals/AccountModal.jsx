import classes from "./AccountModal.module.css";

import { useState } from "react";

const AccountModal = ({ account, handleCloseModal }) => {
    const [accountName, setAccountName] = useState(account.name);
    const [accountType, setAccountType] = useState(account.type);
    const [accountInitBalance, setAccountInitBalance] = useState(account.initial_balance);
    const [accountDescription, setAccountDescription] = useState(account.description);

    const handleNameChange = (event) => {
        setAccountName(event.target.value);
    };

    const handleTypeChange = (event) => {
        setAccountType(event.target.value);
    };

    const handleInitBalanceChange = (event) => {
        setAccountInitBalance(event.target.value);
    };

    const handleDescChange= (event) => {
        setAccountDescription(event.target.value);
    };

    return (
        <div className={classes.modalOverlay}>
            <div className={classes.mainContainer}>
                <h2>Edit Account</h2>
                <div className={classes.seperatorH} />
                <div className={`${classes.cluster}`}>
                    <p>Name</p>
                    <input type="text" value={accountName} onChange={handleNameChange} />
                </div>
                <div className={`${classes.cluster}`}>
                    <p>Type</p>
                    <input type="text" value={accountType} onChange={handleTypeChange} />
                </div>
                <div className={`${classes.cluster}`}>
                    <p>Initial Balance</p>
                    <input type="text" value={accountInitBalance} onChange={handleInitBalanceChange} />
                </div>

                <div className={`${classes.cluster}`}>
                    <p>Description</p>
                    <input type="text" value={accountDescription} onChange={handleDescChange} />
                </div>
                <div className={classes.buttons}>
                    <button>Save & Close</button>
                    <button onClick={handleCloseModal}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default AccountModal;
