import AccountEntryDropdown from "../dropdowns/AccountEntryDropdown";
import EntityEntryDropdown from "../dropdowns/EntityEntryDropdown";
import classes from "./InputEntryItems.module.css";

import { useState, useEffect } from "react";

const JournalEntryItem = ({ vals, index, onFocus, onItemChange, scrollRef }) => {
    const [account, setAccount] = useState(vals.account);
    const [debit, setDebit] = useState(vals.amount > 0 ? "" : vals.amount * -1);
    const [credit, setCredit] = useState(vals.amount > 0 ? vals.amount : "");
    const [memo, setMemo] = useState(vals.memo);

    useEffect(() => {
        const newInitialAmount = parseFloat(vals.amount) || 0;
        setAccount(vals.account || "");
        setDebit(newInitialAmount < 0 ? String(newInitialAmount * -1) : "");
        setCredit(newInitialAmount > 0 ? String(newInitialAmount) : "");
        setMemo(vals.memo || "");
    }, [vals]);

    const handleAccountChange = (account) => {
        setAccount(account);
        onItemChange(index, "account", account);
    };

    const handleDebitChange = (event) => {
        const inputStr = event.target.value;
        setDebit(inputStr);

        const parsedAmount = parseFloat(inputStr);
        if (!isNaN(parsedAmount) && parsedAmount >= 0) {
            setCredit("");
            onItemChange(index, "amount", -parsedAmount);
        } else if (inputStr === "") {
            onItemChange(index, "amount", 0);
        }
    };

    const handleCreditChange = (event) => {
        const inputStr = event.target.value;
        setCredit(inputStr);

        const parsedAmount = parseFloat(inputStr);
        if (!isNaN(parsedAmount) && parsedAmount >= 0) {
            setDebit("");
            onItemChange(index, "amount", parsedAmount);
        } else if (inputStr === "") {
            onItemChange(index, "amount", 0);
        }
    };

    const handleMemoChange = (event) => {
        const newValue = event.target.value;
        setMemo(newValue);
        onItemChange(index, "memo", newValue);
    };

    return (
        <div className={`${classes.mainContainer} ${classes.journalGridTemplate}`} onFocus={onFocus} tabIndex={0}>
            <AccountEntryDropdown initAccId={7} scrollRef={scrollRef} onChange={handleAccountChange} />
            <input type="text" value={debit} onChange={handleDebitChange} />
            <input type="text" value={credit} onChange={handleCreditChange} />
            <input type="text" value={memo} onChange={handleMemoChange} />
        </div>
    );
};

const TransactionEntryItem = ({ vals, index, onFocus, onItemChange, scrollRef }) => {
    const [date, setDate] = useState(vals.date);
    const [entity, setEntity] = useState(vals.entity);
    const [account, setAccount] = useState(vals.account_name);
    const [memo, setMemo] = useState(vals.memo);
    const [amount, setAmount] = useState(vals.amount);

    const handleDateChange = (event) => {
        const newValue = event.target.value;
        setDate(newValue);
        onItemChange(index, "date", newValue);
    };

    const handleEntityChange = (entity) => {
        setEntity(entity);
        onItemChange(index, "entity", entity);
    };

    const handleAccountChange = (account) => {
        setAccount(account);
        onItemChange(index, "account", account);
    };

    const handleMemoChange = (event) => {
        const newValue = event.target.value;
        setMemo(newValue);
        onItemChange(index, "memo", newValue);
    };

    const handleAmountChange = (event) => {
        const newValue = event.target.value;
        setAmount(newValue);
        onItemChange(index, "amount", newValue);
    };

    return (
        <div className={`${classes.mainContainer} ${classes.transactionGridTemplate}`} onFocus={onFocus} tabIndex={0}>
            <input type="text" value={date} onChange={handleDateChange} />
            <EntityEntryDropdown scrollRef={scrollRef} onChange={handleEntityChange} />
            <AccountEntryDropdown scrollRef={scrollRef} onChange={handleAccountChange} />
            <input type="text" value={memo} onChange={handleMemoChange} />
            <input type="text" value={amount} onChange={handleAmountChange} />
        </div>
    );
};

export { JournalEntryItem, TransactionEntryItem };
