import { useContext, useState } from "react";
import classes from "./TransactionModal.module.css";

import TransactionsCtx from "../../contexts/TransactionsCtx.jsx";

import AccountDropdown from "../dropdowns/AccountDropdown.jsx";
import EntityDropdown from "../dropdowns/EntityDropdown.jsx";
import ConfirmationModal from "./ConfirmationModal.jsx";

const TransactionModal = ({ vals, handleCloseModal }) => {
    const { ctxUpdateTransaction } = useContext(TransactionsCtx);

    const [transDate, setTransDate] = useState(vals.date);
    const [transPayee, setTransPayee] = useState(vals.entity);
    const [transAccount, setTransAccount] = useState(vals.account);
    const [transMemo, setTransMemo] = useState(vals.memo);
    const [transDebit, setTransDebit] = useState(vals.amount < 0 ? vals.amount * -1 : "");
    const [transCredit, setTransCredit] = useState(vals.amount > 0 ? vals.amount : "");

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

    const handleDebitChange = (event) => {
        const newAmount = checkAmount(event.target.value);
        setTransDebit(newAmount);
        setTransCredit("");
        setEditedTransaction((prev) => ({ ...prev, amount: newAmount * -1 }));
    };

    const handleCreditChange = (event) => {
        const newAmount = checkAmount(event.target.value);
        setTransCredit(newAmount);
        setTransDebit("");
        setEditedTransaction((prev) => ({ ...prev, amount: newAmount }));
    };

    const handleAccountClick = (account) => {
        setTransAccount(account.id);
        setEditedTransaction((prev) => ({ ...prev, account_id: account.id }));
    };

    const handleDeleteClick = () => {
        setEditedTransaction((prev) => ({ ...prev, is_deleted: true }));
        ctxUpdateTransaction({ id: vals.id, is_deleted: true });
        handleCloseModal();
    };

    const handleUpdateClick = () => {
        ctxUpdateTransaction({ id: vals.id, ...editedTransaction });
        handleCloseModal();
    };

    const checkAmount = (val) => {
        if (val >= 0 && !isNaN(parseFloat(val))) {
            return val;
        } else {
            return "";
        }
    };

    const handleConfirmAction = (action) => {
        if (action == "closeEdit") {
            if (Object.keys(editedTransaction).length !== 0) {
                setIsConfirmModalOpen(true);
            } else {
                handleCloseModal();
            }
        } else if (action == "delete") {
            setIsDeleteModalOpen(true);
        } else {
            console.error("Action not recognized");
        }
    };

    const onConfirm = () => {
        setIsConfirmModalOpen(false);
        handleCloseModal();
    };

    const onCancel = () => {
        setIsConfirmModalOpen(false);
    };

    const onConfirmDelete = () => {
        handleDeleteClick();
        setIsDeleteModalOpen(false);
    };

    const onCancelDelete = () => {
        setIsDeleteModalOpen(false);
    };

    return (
        <>
            {isConfirmModalOpen && (
                <ConfirmationModal
                    text={{
                        msg: "You have unsaved changes. Are you sure you want to discard them?",
                        confirm_txt: "Discard Changes",
                        cancel_txt: "Keep Editing",
                    }}
                    onConfirm={onConfirm}
                    onCancel={onCancel}
                />
            )}

            {isDeleteModalOpen && (
                <ConfirmationModal
                    text={{
                        msg: "Are you sure you wish to delete this transcation?",
                        confirm_txt: "Delete",
                        cancel_txt: "Cancel Deletion",
                    }}
                    onConfirm={onConfirmDelete}
                    onCancel={onCancelDelete}
                />
            )}

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
                            <div>
                                <div>Debit</div>
                                <input
                                    type="text"
                                    className={classes.debit}
                                    value={transDebit}
                                    onChange={handleDebitChange}
                                />
                                <div>Credit</div>
                                <input
                                    type="text"
                                    className={classes.credit}
                                    value={transCredit}
                                    onChange={handleCreditChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={`${classes.cluster} ${classes.memoCluster}`}>
                        <p>Memo</p>
                        <input type="text" value={transMemo} onChange={handleMemoChange} />
                    </div>
                    <p>{vals.is_reconciled ? "☑️" : "❌"}</p>
                    <div className={classes.buttons}>
                        <button onClick={handleUpdateClick}>Save & Close</button>
                        <button onClick={() => handleConfirmAction("closeEdit")}>Close</button>
                        <button onClick={() => handleConfirmAction("delete")}>Delete</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TransactionModal;
