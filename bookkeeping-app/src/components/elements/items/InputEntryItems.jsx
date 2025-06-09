import AccountEntryDropdown from "../dropdowns/AccountEntryDropdown";
import EntityEntryDropdown from "../dropdowns/EntityEntryDropdown";
import classes from "./InputEntryItems.module.css";

import { useState, useEffect } from "react";

const JournalEntryItem = ({ vals, index, onFocus, onItemChange, scrollRef }) => {
    const handleAccountChange = (account) => {
        onItemChange(index, "account", account);
    };

    const handleDebitChange = (event) => {
        const inputStr = event.target.value;
        onItemChange(index, "debit", inputStr);
    };

    const handleCreditChange = (event) => {
        const inputStr = event.target.value;
        onItemChange(index, "credit", inputStr);
    };

    const handleMemoChange = (event) => {
        const newValue = event.target.value;
        onItemChange(index, "memo", newValue);
    };

    return (
        <div className={`${classes.mainContainer} ${classes.journalGridTemplate}`} onFocus={onFocus} tabIndex={0}>
            <AccountEntryDropdown vals={vals} scrollRef={scrollRef} onChange={handleAccountChange} />
            <input type="text" value={vals.debit} onChange={handleDebitChange} />
            <input type="text" value={vals.credit} onChange={handleCreditChange} />
            <input type="text" value={vals.memo} onChange={handleMemoChange} />
        </div>
    );
};

const TransactionEntryItem = ({ vals, index, onFocus, onItemChange, scrollRef }) => {
    const handleDateChange = (event) => {
        const newValue = event.target.value;
        onItemChange(index, "date", newValue);
    };

    const handleEntityChange = (entity) => {
        onItemChange(index, "entity", entity);
    };

    const handleAccountChange = (account) => {
        onItemChange(index, "account", account);
    };

    const handleMemoChange = (event) => {
        const newValue = event.target.value;
        onItemChange(index, "memo", newValue);
    };

    const handleAmountChange = (event) => {
        const newValue = event.target.value;
        onItemChange(index, "amount", newValue);
    };

    return (
        <div className={`${classes.mainContainer} ${classes.transactionGridTemplate}`} onFocus={onFocus} tabIndex={0}>
            <input type="text" value={vals.date} onChange={handleDateChange} />
            <EntityEntryDropdown scrollRef={scrollRef} onChange={handleEntityChange} />
            <AccountEntryDropdown scrollRef={scrollRef} onChange={handleAccountChange} />
            <input type="text" value={vals.memo} onChange={handleMemoChange} />
            <input type="text" value={vals.amount} onChange={handleAmountChange} />
        </div>
    );
};

export { JournalEntryItem, TransactionEntryItem };
