import AccountEntryDropdown from "../dropdowns/AccountEntryDropdown";
import EntityEntryDropdown from "../dropdowns/EntityEntryDropdown";
import classes from "./InputEntryItems.module.css";

import { useState } from "react";

const JournalEntryItem = ({ vals, index, onFocus, onItemChange, scrollRef }) => {
    const handleAccountChange = (account) => {
        console.log(account, "ACCOUNT");
        onItemChange(index, "account", account);
    };

    const handleAmountChange = (event) => {
        const inputStr = event.target.value;
        const type = event.target.name;
        onItemChange(index, type, inputStr);
    };

    const handleMemoChange = (event) => {
        const newValue = event.target.value;
        onItemChange(index, "memo", newValue);
    };

    return (
        // tabIndex for making the component able to be tabbed through
        <div className={`${classes.mainContainer} ${classes.journalGridTemplate}`} onFocus={onFocus} tabIndex={0}>
            <AccountEntryDropdown vals={vals} scrollRef={scrollRef} onChange={handleAccountChange} />
            <input
                type="text"
                name="debit"
                value={vals.type == "debit" ? vals.amount : ""}
                onChange={handleAmountChange}
            />
            <input
                type="text"
                name="credit"
                value={vals.type == "credit" ? vals.amount : ""}
                onChange={handleAmountChange}
            />
            <input type="text" value={vals.memo} onChange={handleMemoChange} />
        </div>
    );
};

const TransactionEntryItem = ({ vals, index, onFocus, onItemChange, scrollRef }) => {
    const [inputFields, setInputFields] = useState({
        date: vals.date,
        entity: vals.entity,
        account: vals.account,
        memo: vals.memo,
        amount: vals.memo,
        type: vals.type,
        is_reconciled: false,
    });

    const valueChange = (event) => {
        const name = event.target.name;
        const newValue = event.target.value;

        if (name == "debit" || name == "credit") {
            setInputFields((prev) => ({
                ...prev,
                amount: checkAmount(newValue),
                type: name,
            }));
        } else {
            setInputFields((prev) => ({
                ...prev,
                [name]: newValue,
            }));
        }
    };

    const handleEntityChange = (entity) => {
        setInputFields((prev) => ({
            ...prev,
            entity: entity,
        }));
    };

    const handleAccountChange = (account) => {
        setInputFields((prev) => ({
            ...prev,
            account: account,
        }));
    };

    const handleBlur = () => {
        onItemChange(index, inputFields);
    };

    const checkAmount = (val) => {
        if (!isNaN(parseFloat(val))) {
            return val;
        } else {
            return "";
        }
    };

    return (
        // tabIndex for making the component able to be tabbed through
        <div
            className={`${classes.mainContainer} ${classes.transactionGridTemplate}`}
            onFocus={onFocus}
            onBlur={handleBlur}
            tabIndex={0}
        >
            <input type="text" name="date" value={inputFields.date} onChange={valueChange} />
            <EntityEntryDropdown scrollRef={scrollRef} onChange={handleEntityChange} />
            <AccountEntryDropdown scrollRef={scrollRef} onChange={handleAccountChange} />
            <input type="text" name="memo" value={inputFields.memo} onChange={valueChange} />
            <input
                type="text"
                name="debit"
                value={inputFields.type == "debit" ? inputFields.amount : ""}
                onChange={valueChange}
            />
            <input
                type="text"
                name="credit"
                value={inputFields.type == "credit" ? inputFields.amount : ""}
                onChange={valueChange}
            />
        </div>
    );
};

export { JournalEntryItem, TransactionEntryItem };
