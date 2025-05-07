import { useEffect, useState } from "react";
import classes from "./TransactionModal.module.css";

import AccountDropdown from "../dropdowns/AccountDropdown.jsx";
import EntityDropdown from "../dropdowns/EntityDropdown.jsx";

const TransactionModal = ({ vals, setPageTrans, handleCloseModal }) => {
    const [transDate, setTransDate] = useState(vals.date);
    const [transPayee, setTransPayee] = useState(vals.payee);
    const [transAccount, setTransAccount] = useState(vals.account);
    const [transMemo, setTransMemo] = useState(vals.memo);
    const [transAmount, setTransAmount] = useState(vals.amount);

    const [editedTransaction, setEditedTransaction] = useState({ account_id: vals.account.id });

    const handleDateChange = (event) => {
        setTransDate(event.target.value);
        setEditedTransaction((prev) => ({ ...prev, date: event.target.value }));
    };

    const handlePayeeChange = (payeeName) => {
        setTransPayee(payeeName);
        setEditedTransaction((prev) => ({ ...prev, payee: payeeName }));
    };

    const handleMemoChange = (event) => {
        setTransMemo(event.target.value);
        setEditedTransaction((prev) => ({ ...prev, memo: event.target.value }));
    };

    const handleAmountChange = (event) => {
        setTransAmount(event.target.value);
        setEditedTransaction((prev) => ({ ...prev, amount: event.target.value }));
    };

    const handleAccountClick = (account) => {
        setTransAccount(account.id);
        setEditedTransaction((prev) => ({ ...prev, account_id: account.id }));
    };

    const updateTransaction = async () => {
        const accessToken = localStorage.getItem("accessToken");

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/transactions/${vals.id}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(editedTransaction),
            });

            if (!response.ok) {
                console.log("Error:", response.error);
                return;
            }

            const updatedData = await response.json();

            setPageTrans((prevTransactions) =>
                prevTransactions.map((transaction) => {
                    if (transaction.id === vals.id) {
                        return updatedData;
                    } else {
                        return transaction;
                    }
                })
            );

            handleCloseModal();
        } catch (error) {
            console.error("Error editing transaction:", error);
        }
    };

    return (
        <div className={classes.modalOverlay}>
            <div className={classes.mainContainer}>
                <h2>Edit Transaction</h2>
                <div className={classes.seperatorH} />
                <div className={`${classes.cluster} ${classes.dateCluster}`}>
                    <input type="date" value={transDate} onChange={handleDateChange} />
                </div>
                <div className={`${classes.cluster} ${classes.dropdownCluster}`}>
                    <p>Account</p>
                    <AccountDropdown initalVal={transAccount} onChange={handleAccountClick} />
                </div>
                <div>
                    <div className={`${classes.cluster} ${classes.dropdownCluster}`}>
                        {/* NEED TO ADD FULLY WORKING PAYEE DROPDOWN */}
                        <p>Payee</p>
                        <EntityDropdown initalVal={transPayee} />
                    </div>
                    <div className={`${classes.cluster} ${classes.amountCluster}`}>
                        <p>Amount</p>
                        <input type="text" value={transAmount} onChange={handleAmountChange} />
                    </div>
                </div>
                <div className={`${classes.cluster} ${classes.memoCluster}`}>
                    <p>Memo</p>
                    <input type="text" value={transMemo} onChange={handleMemoChange} />
                </div>
                <p>{vals.is_reconciled ? "☑️" : "❌"}</p>
                <div className={classes.buttons}>
                    <button onClick={updateTransaction}>Save & Close</button>
                    <button onClick={handleCloseModal}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default TransactionModal;
