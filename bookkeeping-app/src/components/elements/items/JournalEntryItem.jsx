import classes from "./JournalEntryItem.module.css";

import { useState, useEffect } from "react";

const JournalEntryItem = ({ vals, index, onFocus, onItemChange }) => {
    const [account, setAccount] = useState(vals[0]);
    const [debit, setDebit] = useState(vals[1] === 0 ? "" : vals[1]);
    const [credit, setCredit] = useState(vals[2] === 0 ? "" : vals[2]);
    const [memo, setMemo] = useState(vals[3]);

    useEffect(() => {
        if (account !== vals[0]) {
            onItemChange(index, "account", account);
        }
    }, [account, index, onItemChange, vals]);

    useEffect(() => {
        const parsedDebit = parseFloat(debit) || 0;
        if (parsedDebit !== vals[1]) {
            onItemChange(index, "debit", parsedDebit);
        }
    }, [debit, index, onItemChange, vals]);

    useEffect(() => {
        const parsedCredit = parseFloat(credit) || 0;
        if (parsedCredit !== vals[2]) {
            onItemChange(index, "credit", parsedCredit);
        }
    }, [credit, index, onItemChange, vals]);

    useEffect(() => {
        if (memo !== vals[3]) {
            onItemChange(index, "memo", memo);
        }
    }, [memo, index, onItemChange, vals]);

    const handleAccountChange = (event) => {
        setAccount(event.target.value);
    };

    const handleDebitChange = (event) => {
        const amount = event.target.value;
        let str = "";

        if (parseFloat(amount) < 0) {
            str = `(${amount})`;
        } else if (amount > 0) {
            str = amount;
        }

        setDebit(str);
    };

    const handleCreditChange = (event) => {
        const amount = event.target.value;
        let str = "";

        if (parseFloat(amount) < 0) {
            str = `(${amount})`;
        } else if (amount > 0) {
            str = amount;
        }

        setCredit(str);
    };

    const handleMemoChange = (event) => {
        setMemo(event.target.value);
    };

    return (
        <div className={classes.mainContainer} onFocus={onFocus} tabIndex={0}>
            <input type="text" value={account} onChange={handleAccountChange} />
            <input type="text" value={debit} onChange={handleDebitChange} />
            <input type="text" value={credit} onChange={handleCreditChange} />
            <input type="text" value={memo} onChange={handleMemoChange} />
        </div>
    );
};

export default JournalEntryItem;
