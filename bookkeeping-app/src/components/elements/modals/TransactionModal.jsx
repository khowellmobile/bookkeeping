import { useState } from "react";
import classes from "./TransactionModal.module.css";

import AccountDropdown from "../dropdowns/AccountDropdown.jsx";
import PayeeDropdown from "../dropdowns/PayeeDropdown.jsx";

const TransactionModal = ({ vals, handleCloseModal }) => {
    const [transDate, setTransDate] = useState(vals[0]);
    const [transPayee, setTransPayee] = useState(vals[1]); // State variable most likely not needed here
    const [transAccount, setTransAccount] = useState(vals[2]); // State variable most likely not needed here
    const [transMemo, setTransMemo] = useState(vals[3]);
    const [transAmount, setTransAmount] = useState(vals[4]);

    const handleDateChange = (event) => {
        setTransDate(event.target.value);
    };

    const handleMemoChange = (event) => {
        setTransMemo(event.target.value);
    };

    const handleAmountChange = (event) => {
        setTransAmount(event.target.value);
    };
    return (
        <div className={classes.modalOverlay}>
            <div className={classes.mainContainer}>
                <div className={classes.dateCluster}>
                    <input type="date" value={transDate} onChange={handleDateChange} />
                </div>
                <div className={classes.dropdownCluster}>
                    <p>Payee</p>
                    <PayeeDropdown initalVal={transPayee}/>
                </div>
                <div className={classes.dropdownCluster}>
                    <p>Account</p>
                    <AccountDropdown initalVal={transAccount}/>
                </div>
                <div className={classes.textCluster}>
                    <p>Memo</p>
                    <input type="text" value={transMemo} onChange={handleMemoChange} />
                </div>
                <div className={classes.textCluster}>
                    <p>Amount</p>
                    <input type="text" value={transAmount} onChange={handleAmountChange} />
                </div>
                <p>{vals[5] == 1 ? "☑️" : "❌"}</p>
                <button className={classes.closeModalButton} onClick={handleCloseModal}>
                    close
                </button>
            </div>
        </div>
    );
};

export default TransactionModal;
