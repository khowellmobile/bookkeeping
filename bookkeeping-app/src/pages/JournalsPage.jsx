import { JournalEntryItem } from "../components/elements/items/InputEntryItems";
import classes from "./JournalsPage.module.css";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";

const JournalsPage = () => {
    const scrollRef = useRef();

    const [journalHistory, setJournalHistory] = useState([
        ["2024-01-24", "Revenue Adjustment"],
        ["2023-11-10", "Payroll Entry"],
        ["2024-02-15", "Equity Balancing"],
        ["2023-09-05", "JRE #4"],
        ["2024-01-05", "Clear Income Stmt"],
        ["2024-01-05", "Adjustment #2"],
    ]);

    const [journalItems, setJournalItems] = useState(
        Array(14)
            .fill(null)
            .map(() => ({
                account: "",
                amount: "",
                memo: "",
            }))
    );

    const [j, setJ] = useState();

    useEffect(() => {
        const populateCtxJournals = async () => {
            const ctxAccessToken = localStorage.getItem("accessToken");
            try {
                const response = await fetch("http://localhost:8000/api/journals/", {
                    headers: {
                        Authorization: `Bearer ${ctxAccessToken}`,
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setJournalHistory(data);
            } catch (e) {
                console.log("Error: " + e);
            }
        };

        populateCtxJournals();
    }, []);

    const debitTotal = useMemo(() => {
        if (journalItems) {
            return (journalItems.reduce((sum, item) => {
                const amount = parseFloat(item.amount) || 0;
                return sum + (amount < 0 ? amount : 0);
            }, 0)) * -1;
        } else {
            return 0;
        }
    }, [journalItems]);

    const creditTotal = useMemo(() => {
        if (journalItems) {
            return journalItems.reduce((sum, item) => {
                const amount = parseFloat(item.amount) || 0;
                return sum + (amount > 0 ? amount : 0);
            }, 0);
        } else {
            return 0;
        }
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

            if (name === "account") {
                newJournalItems[index].account = value.id;
            } else if (name === "debit") {
                newJournalItems[index].amount = parseFloat(value) * -1 || 0;
            } else if (name === "credit") {
                newJournalItems[index].amount = parseFloat(value) || 0;
            } else if (name === "memo") {
                newJournalItems[index].memo = value;
            }
            setJournalItems(newJournalItems);
        },
        [journalItems, setJournalItems]
    );

    useEffect(() => {
        setJournalItems(journalHistory[0]?.item_list);
    }, [journalHistory]);

    useEffect(() => {
        console.log(journalItems);
    }, [journalItems]);

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
                                <p>{entry.date}</p>
                                <p>{entry.name}</p>
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
                    <section className={classes.items} ref={scrollRef}>
                        {journalItems &&
                            journalItems.length > 0 &&
                            journalItems.map((item, index) => (
                                <JournalEntryItem
                                    vals={item}
                                    key={index}
                                    index={index}
                                    onFocus={() => handleFocusLastItem(index)}
                                    onItemChange={handleItemChange}
                                    scrollRef={scrollRef}
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
