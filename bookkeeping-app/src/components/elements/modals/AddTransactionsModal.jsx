import classes from "./AddTransactionsModal.module.css";

import { TransactionEntryItem } from "../items/InputEntryItems";
import AccountDropdown from "../dropdowns/AccountDropdown";
import { useState, useCallback, useEffect } from "react";

const AddTransactionsModal = ({ ctxActiveAccount, handleCloseModal }) => {
    const [activeAccount, setActiveAccount] = useState(ctxActiveAccount);

    const [transactionItems, settransactionItems] = useState(
        Array(15)
            .fill(null)
            .map(() => ({
                date: "",
                payee: "",
                account_id: "",
                memo: "",
                amount: "",
                is_reconciled: false,
            }))
    );

    const handleFocusLastItem = useCallback(
        (index) => {
            if (index === transactionItems.length - 1) {
                settransactionItems([...transactionItems, ["", "", "", ""]]);
            }
        },
        [transactionItems, settransactionItems]
    );

    useEffect(() => {}, transactionItems);

    const handleItemChange = useCallback(
        (index, name, value) => {
            const newtransactionItems = [...transactionItems];

            if (name === "date") {
                newtransactionItems[index].date = value;
            } else if (name === "payee") {
                newtransactionItems[index].payee = value;
            } else if (name === "account_id") {
                newtransactionItems[index].account_id = value;
            } else if (name === "memo") {
                newtransactionItems[index].memo = value;
            } else if (name === "amount") {
                newtransactionItems[index].amount = parseFloat(value) || 0;
            }

            settransactionItems(newtransactionItems);
        },
        [transactionItems, settransactionItems]
    );

    const handleSaveClose = () => {
        const nonEmptyItems = transactionItems.filter((item) => {
            const values = Object.values(item);

            // Checking if at least one value is non-empty
            return values.some((value) => typeof value === "string" && value.trim() !== "");
        });

        addTransactions(nonEmptyItems);

        handleCloseModal();
    };

    const addTransactions = async (transactionsToAdd) => {
        const accessToken = localStorage.getItem("accessToken");

        try {
            const response = await fetch("http://127.0.0.1:8000/api/transactions/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(transactionsToAdd),
            });
            console.log(transactionsToAdd);
            console.log("Transactions sent (check your Django backend)");
        } catch (error) {
            console.error("Error sending transactions:", error);
        }
    };

    return (
        <div className={classes.modalOverlay}>
            <div className={classes.mainContainer}>
                <section className={classes.tools}>
                    <AccountDropdown initalVal={activeAccount} onChange={setActiveAccount} />
                    <p>What else?</p>
                    <section className={classes.buttons}>
                        <button onClick={handleSaveClose}>Save & Close</button>
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
