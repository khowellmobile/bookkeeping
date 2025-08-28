import { useContext, useState } from "react";
import classes from "./TransactionModal.module.css";

import TransactionsCtx from "../../contexts/TransactionsCtx.jsx";

import AccountDropdown from "../dropdowns/AccountDropdown.jsx";
import EntityDropdown from "../dropdowns/EntityDropdown.jsx";
import ConfirmationModal from "./ConfirmationModal.jsx";
import Input from "../misc/Input.jsx";

const TransactionModal = ({ vals, handleCloseModal }) => {
    const { ctxUpdateTransaction } = useContext(TransactionsCtx);

    const [inputFields, setInputFields] = useState({
        date: vals.date,
        entity: vals.entity,
        account: vals.account,
        amount: vals.amount,
        type: vals.type,
        memo: vals.memo,
    });
    const [editedTransaction, setEditedTransaction] = useState({});

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleValueChange = (event) => {
        const name = event.target.name;
        const newValue = event.target.value;

        if (name == "debit" || name == "credit") {
            setInputFields((prev) => ({
                ...prev,
                amount: checkAmount(newValue),
                type: name,
            }));
            setEditedTransaction((prev) => ({ ...prev, type: name, amount: newValue }));
        } else {
            setInputFields((prev) => ({
                ...prev,
                [name]: newValue,
            }));
            setEditedTransaction((prev) => ({ ...prev, [name]: name == "memo" ? checkText(newValue) : newValue }));
        }
    };

    const handleAccountClick = (account) => {
        setInputFields((prev) => ({
            ...prev,
            account: account,
        }));
        setEditedTransaction((prev) => ({ ...prev, account: account }));
    };

    const handlePayeeChange = (entity) => {
        setInputFields((prev) => ({
            ...prev,
            entity: entity,
        }));
        setEditedTransaction((prev) => ({ ...prev, entity: entity }));
    };

    const handleDeleteClick = () => {
        setEditedTransaction((prev) => ({ ...prev, is_deleted: true }));
        ctxUpdateTransaction({ id: vals.id, is_deleted: true });
        handleCloseModal();
    };

    const handleUpdateClick = () => {
        console.log(editedTransaction);
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

    const checkText = (val) => {
        if (typeof val !== "string") {
            return "";
        }

        const sanitizedVal = val
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#x27;")
            .replace(/\//g, "&#x2F;");

        return sanitizedVal;
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
                        <input type="date" name="date" value={inputFields.date} onChange={handleValueChange} />
                    </div>
                    <div className={`${classes.cluster} ${classes.dropdownCluster}`}>
                        <p>Account</p>
                        <AccountDropdown initalVal={inputFields.account} onChange={handleAccountClick} />
                    </div>
                    <div>
                        <div className={`${classes.cluster} ${classes.dropdownCluster}`}>
                            <p>Payee</p>
                            <EntityDropdown initalVal={inputFields.entity} onChange={handlePayeeChange} />
                        </div>
                        <div className={`${classes.cluster} ${classes.amountCluster}`}>
                            <p>Amount</p>
                            <div>
                                <div>Debit</div>
                                <Input
                                    type="text"
                                    name="debit"
                                    className={classes.debit}
                                    value={inputFields.type == "debit" ? inputFields.amount : ""}
                                    onChange={handleValueChange}
                                    customStyle={{ borderLeft: "none", borderRight: "none" }}
                                />
                                <div>Credit</div>
                                <Input
                                    type="text"
                                    name="credit"
                                    className={classes.credit}
                                    value={inputFields.type == "credit" ? inputFields.amount : ""}
                                    onChange={handleValueChange}
                                    customStyle={{ borderLeft: "none" }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={`${classes.cluster} ${classes.memoCluster}`}>
                        <p>Memo</p>
                        <Input type="text" name="memo" value={inputFields.memo} onChange={handleValueChange} />
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
