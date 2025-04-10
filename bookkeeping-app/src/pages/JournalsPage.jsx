import JournalEntryItem from "../components/elements/items/JournalEntryItem";
import classes from "./JournalsPage.module.css";

import { useState, useCallback, useMemo } from "react";

const JournalsPage = () => {
    const [journalHistory, setJournalHistory] = useState([
        ["2024-01-24", "Revenue Adjustment"],
        ["2023-11-10", "Payroll Entry"],
        ["2024-02-15", "Equity Balancing"],
        ["2023-09-05", "JRE #4"],
        ["2024-01-05", "Clear Income Stmt"],
        ["2024-01-05", "Adjustment #2"],
    ]);
    
    const [journalItems, setJournalItems] = useState([
        ["Cash", 1000.0, 0.0, "Initial deposit"],
        ["Accounts Receivable", 0.0, 500.0, "Sale of goods"],
        ["Service Revenue", 0.0, 500.0, "Revenue from consulting"],
        ["Office Supplies", 200.0, 0.0, "Purchased office supplies"],
        ["Accounts Payable", 0.0, 200.0, "Paid for office supplies"],
        ["Bank Loan", 5000.0, 0.0, "Loan disbursement"],
        ["Interest Expense", 50.0, 0.0, "Accrued interest on loan"],
        ["Capital Contribution", 0.0, 3000.0, "Owner's contribution"],
        ["Inventory", 300.0, 0.0, "Purchased inventory"],
        ["Sales Revenue", 0.0, 300.0, "Sales made from inventory"],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
    ]);

    const debitTotal = useMemo(() => {
        return journalItems.reduce((sum, item) => sum + (parseFloat(item[1]) || 0), 0);
    }, [journalItems]);

    const creditTotal = useMemo(() => {
        return journalItems.reduce((sum, item) => sum + (parseFloat(item[2]) || 0), 0);
    }, [journalItems]);

    const handleFocusLastItem = useCallback(
        (index) => {
            if (index === journalItems.length - 1) {
                setJournalItems([...journalItems, ["", "", "", ""]]);
            }
        },
        [journalItems, setJournalItems]
    );

    const handleItemChange = useCallback(
        (index, name, value) => {
            const newJournalItems = [...journalItems];

            if (name === "debit") {
                newJournalItems[index][1] = parseFloat(value) || 0;
            } else if (name === "credit") {
                newJournalItems[index][2] = parseFloat(value) || 0;
            } else if (name === "account") {
                newJournalItems[index][0] = value;
            } else if (name === "memo") {
                newJournalItems[index][3] = value;
            }
            setJournalItems(newJournalItems);
        },
        [journalItems, setJournalItems]
    );

    return (
        <div className={classes.mainContainer}>
            <div className={classes.journalContent}>
                <div className={classes.journalHistory}>
                    <section className={classes.header}>
                        <h2>Journal History</h2>
                    </section>
                    <section className={`${classes.columnNames} ${classes.historyGridTemplate}`}>
                        <div>
                            <p>Date</p>
                        </div>
                        <div>
                            <p>Name</p>
                        </div>
                    </section>
                    <section className={classes.items}>
                        {journalHistory.map((entry, index) => (
                            <div className={classes.historyEntry} key={index}>
                                <p>{entry[0]}</p>
                                <p>{entry[1]}</p>
                            </div>
                        ))}
                    </section>
                </div>
                <div className={classes.journalEntry}>
                    <section className={classes.header}>
                        <h2>Make an Entry</h2>
                    </section>
                    <section className={`${classes.columnNames} ${classes.entryGridTemplate}`}>
                        <div>
                            <p>Account</p>
                        </div>
                        <div>
                            <p>Debit</p>
                        </div>
                        <div>
                            <p>Credit</p>
                        </div>
                        <div>
                            <p>Memo</p>
                        </div>
                    </section>
                    <section className={classes.items}>
                        {journalItems.map((transaction, index) => (
                            <JournalEntryItem
                                vals={transaction}
                                key={index}
                                index={index}
                                onFocus={() => handleFocusLastItem(index)}
                                onItemChange={handleItemChange}
                            />
                        ))}
                    </section>
                    <section className={classes.entryTotals}>
                        <p>
                            <b>Total</b>
                        </p>
                        <p>{debitTotal.toFixed(2)}</p>
                        <p>{creditTotal.toFixed(2)}</p>
                        {debitTotal - creditTotal != 0 ? (
                            <p className={classes.totalError}>Totals need to match</p>
                        ) : (
                            <p></p>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default JournalsPage;
