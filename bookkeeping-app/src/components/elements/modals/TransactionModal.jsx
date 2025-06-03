import { useState } from "react";
import classes from "./TransactionModal.module.css";

import AccountDropdown from "../dropdowns/AccountDropdown.jsx";
import EntityDropdown from "../dropdowns/EntityDropdown.jsx";

const TransactionModal = ({ vals, setPageTrans, handleCloseModal }) => {
    const [transDate, setTransDate] = useState(vals.date);
    const [transPayee, setTransPayee] = useState(vals.entity);
    const [transAccount, setTransAccount] = useState(vals.account);
    const [transMemo, setTransMemo] = useState(vals.memo);
    const [transAmount, setTransAmount] = useState(vals.amount);

    const [editedTransaction, setEditedTransaction] = useState({});

    const handleDateChange = (event) => {
        setTransDate(event.target.value);
        setEditedTransaction((prev) => ({ ...prev, date: event.target.value }));
    };

    const handlePayeeChange = (entity) => {
        setTransPayee(entity.id);
        setEditedTransaction((prev) => ({ ...prev, entity_id: entity.id }));
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

    const handleDeleteClick = () => {
        setEditedTransaction((prev) => ({ ...prev, is_deleted: true }));
        updateTransaction(true);
    };

    const updateTransaction = async (shouldDelete) => {
        const accessToken = localStorage.getItem("accessToken");
        let data;

        if (shouldDelete) {
            data = { is_deleted: true };
        } else {
            data = editedTransaction;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/transactions/${vals.id}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(data),
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
                        <p>Payee</p>
                        <EntityDropdown initalVal={transPayee} onChange={handlePayeeChange} />
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
                    <button onClick={() => updateTransaction(false)}>Save & Close</button>
                    <button onClick={handleCloseModal}>Close</button>
                    <button onClick={handleDeleteClick}>Delete</button>
                </div>
            </div>
        </div>
    );
};

export default TransactionModal;
