import classes from "./AddTransactionsModal.module.css";

import { TransactionEntryItem } from "../items/InputEntryItems";
import AccountDropdown from "../dropdowns/AccountDropdown";
import { useState, useCallback } from "react";

const AddTransactionsModal = ({ handleCloseModal, ctxActiveAccount }) => {
    const [activeAccount, setActiveAccount] = useState(ctxActiveAccount);

    const [transactionItems, settransactionItems] = useState([
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
    ]);

    const changeActiveAccount = (account) => {
        setActiveAccount(account);
    };

    const handleFocusLastItem = useCallback(
        (index) => {
            if (index === transactionItems.length - 1) {
                settransactionItems([...transactionItems, ["", "", "", ""]]);
            }
        },
        [transactionItems, settransactionItems]
    );

    const handleItemChange = useCallback(
        (index, name, value) => {
            const newtransactionItems = [...transactionItems];

            if (name === "debit") {
                newtransactionItems[index][1] = parseFloat(value) || 0;
            } else if (name === "credit") {
                newtransactionItems[index][2] = parseFloat(value) || 0;
            } else if (name === "account") {
                newtransactionItems[index][0] = value;
            } else if (name === "memo") {
                newtransactionItems[index][3] = value;
            }
            settransactionItems(newtransactionItems);
        },
        [transactionItems, settransactionItems]
    );

    return (
        <div className={classes.modalOverlay}>
            <div className={classes.mainContainer}>
                <section className={classes.tools}>
                    <AccountDropdown initalVal={activeAccount} onChange={changeActiveAccount} />
                    <p>What else?</p>
                    <section className={classes.buttons}>
                        <button onClick={handleCloseModal}>Save & Close</button>
                        <button onClick={handleCloseModal}>Cancel</button>
                    </section>
                </section>
                <div className={classes.entryContainer}>
                    <section className={`${classes.columnNames} ${classes.entryGridTemplate}`}>
                        <div>
                            <p>Date</p>
                        </div>
                        <div>
                            <p>Payee</p>
                        </div>
                        <div>
                            <p>Account</p>
                        </div>
                        <div>
                            <p>Memo</p>
                        </div>
                        <div>
                            <p>Amount</p>
                        </div>
                    </section>
                    <section className={classes.items}>
                        {transactionItems.map((transaction, index) => (
                            <TransactionEntryItem
                                vals={transaction}
                                key={index}
                                index={index}
                                onFocus={() => handleFocusLastItem(index)}
                                onItemChange={handleItemChange}
                            />
                        ))}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AddTransactionsModal;
