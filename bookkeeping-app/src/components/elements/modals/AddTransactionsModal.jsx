import classes from "./AddTransactionsModal.module.css";

import { useState, useCallback, useRef, useContext } from "react";

import TransactionsCtx from "../../contexts/TransactionsCtx";

import { TransactionEntryItem } from "../items/InputEntryItems";
import AccountDropdown from "../dropdowns/AccountDropdown";
import ConfirmationModal from "./ConfirmationModal";

const AddTransactionsModal = ({ ctxActiveAccount, setPageTrans, handleCloseModal }) => {
    const { ctxAddTransactions } = useContext(TransactionsCtx);

    const scrollRef = useRef();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeAccount, setActiveAccount] = useState(ctxActiveAccount);
    const [transactionItems, setTransactionItems] = useState(
        Array(14)
            .fill(null)
            .map(() => ({
                date: "",
                entity: "",
                account: "",
                memo: "",
                amount: "",
                is_reconciled: false,
            }))
    );

    const handleFocusLastItem = useCallback(
        (index) => {
            if (index === transactionItems.length - 1) {
                setTransactionItems([...transactionItems, ["", "", "", ""]]);
            }
        },
        [transactionItems, setTransactionItems]
    );

    const handleItemChange = useCallback(
        (index, name, value) => {
            const newtransactionItems = [...transactionItems];

            if (name === "date") {
                newtransactionItems[index].date = value;
            } else if (name === "entity") {
                newtransactionItems[index].entity = value;
            } else if (name === "account") {
                newtransactionItems[index].account = value;
            } else if (name === "memo") {
                newtransactionItems[index].memo = value;
            } else if (name === "amount") {
                newtransactionItems[index].amount = parseFloat(value) || 0;
            }

            setTransactionItems(newtransactionItems);
        },
        [transactionItems, setTransactionItems]
    );

    const handleSaveClose = () => {
        const nonEmptyItems = transactionItems.filter((item) => {
            const values = Object.values(item);

            // Checking if at least one value is non-empty
            return values.some((value) => typeof value === "string" && value.trim() !== "");
        });

        ctxAddTransactions(nonEmptyItems);
        handleCloseModal();
    };

    const handleCancelClose = () => {
        const allItemsAreEmpty = transactionItems.every((item) => {
            return (
                item.date === "" &&
                item.entity === "" &&
                item.account === "" &&
                item.memo === "" &&
                (item.amount === "" || item.amount == 0) &&
                item.is_reconciled === false
            );
        });

        if (!allItemsAreEmpty) {
            setIsModalOpen(true);
        } else {
            handleCloseModal();
        }
    };

    const onConfirm = () => {
        setIsModalOpen(false);
        handleCloseModal();
    };

    const onCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            {isModalOpen && (
                <ConfirmationModal
                    text={{
                        msg: "You are above to leave without saving.",
                        confirm_txt: "Leave",
                        cancel_txt: "Stay",
                    }}
                    onConfirm={onConfirm}
                    onCancel={onCancel}
                />
            )}
            <div className={classes.modalOverlay}>
                <div className={classes.mainContainer}>
                    <section className={classes.tools}>
                        <AccountDropdown initalVal={activeAccount} onChange={setActiveAccount} />
                        <p>What else?</p>
                        <section className={classes.buttons}>
                            <button onClick={handleSaveClose}>Save & Close</button>
                            <button onClick={handleCancelClose}>Cancel</button>
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
                        <section className={classes.items} ref={scrollRef}>
                            {transactionItems.map((transaction, index) => (
                                <TransactionEntryItem
                                    vals={transaction}
                                    key={index}
                                    index={index}
                                    onFocus={() => handleFocusLastItem(index)}
                                    onItemChange={handleItemChange}
                                    scrollRef={scrollRef}
                                />
                            ))}
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddTransactionsModal;
