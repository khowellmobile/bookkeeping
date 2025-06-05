import { useState, useCallback, useMemo, useEffect, useRef, useContext } from "react";

import classes from "./JournalsPage.module.css";

import JournalsCtx from "../components/contexts/JournalsCtx";

import { JournalEntryItem } from "../components/elements/items/InputEntryItems";

const JournalsPage = () => {
    const { ctxJournalList, populateCtxJournals, ctxUpdateJournal } = useContext(JournalsCtx);

    const scrollRef = useRef();

    const [isEditing, setIsEditing] = useState(false);
    const [selectedJournalId, setSelectedJournalId] = useState(null);
    const [journalName, setJournalName] = useState("");
    const [journalDate, setJournalDate] = useState("");
    const [journalItems, setJournalItems] = useState(
        Array(14)
            .fill(null)
            .map(() => ({
                account: "",
                amount: "",
                memo: "",
            }))
    );

    useEffect(() => {
        populateCtxJournals();
    }, []);

    const saveInfo = async () => {
        // Getting non-empty items
        const item_list = journalItems.filter((item) => {
            return (
                (item.account !== "" && item.account !== null && item.account !== undefined) ||
                (item.amount !== "" && item.amount !== null && item.amount !== undefined && item.amount !== 0) ||
                (item.memo && item.memo.trim() !== "")
            );
        });

        const name = journalName;
        const date = journalDate;
        let url = "http://localhost:8000/api/journals/";
        const method = isEditing ? "PUT" : "POST";

        if (isEditing) {
            url = url + `${selectedJournalId}/`;
        }

        const sendData = {
            name: name,
            date: date,
            item_list: item_list,
        };

        ctxUpdateJournal(selectedJournalId, url, method, sendData);
    };

    const debitTotal = useMemo(() => {
        if (journalItems) {
            return (
                journalItems.reduce((sum, item) => {
                    const amount = parseFloat(item.amount) || 0;
                    return sum + (amount < 0 ? amount : 0);
                }, 0) * -1
            );
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
                setJournalItems([...journalItems, { account: "", amount: "", memo: "" }]);
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

    const handleHistoryClick = (index) => {
        setJournalItems(ctxJournalList[index]?.item_list || []);
        setJournalDate(ctxJournalList[index]?.date || "");
        setJournalName(ctxJournalList[index]?.name || "");
        setSelectedJournalId(ctxJournalList[index]?.id || "");
        setIsEditing(true);
    };

    const clearInputs = () => {
        setJournalDate("");
        setJournalName("");
        setSelectedJournalId("");
        setJournalItems(
            Array(14)
                .fill(null)
                .map(() => ({
                    account: "",
                    amount: "",
                    memo: "",
                }))
        );
        setIsEditing(false);
    };

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
                        {ctxJournalList && ctxJournalList.length > 0 ? (
                            ctxJournalList.map((entry, index) => (
                                <div
                                    className={classes.historyEntry}
                                    key={index}
                                    onClick={() => handleHistoryClick(index)}
                                >
                                    <p>{entry.date}</p>
                                    <p>{entry.name}</p>
                                </div>
                            ))
                        ) : (
                            <p>No Journals</p>
                        )}
                    </section>
                </div>
                <div className={classes.journalEntry}>
                    <section className={classes.header}>
                        {isEditing ? <h2>Edit an Entry</h2> : <h2>Make an Entry</h2>}
                        <div className={classes.headerTools}>
                            <button onClick={saveInfo}>{isEditing ? "Save Edits" : "Save Entry"}</button>
                            <button onClick={clearInputs}>{isEditing ? "New Entry" : "Clear Inputs"}</button>
                        </div>
                    </section>
                    <section className={classes.titleDate}>
                        <input
                            value={journalName}
                            onChange={(event) => setJournalName(event.target.value)}
                            placeholder="Enter Journal Name"
                        />
                        <input
                            value={journalDate}
                            onChange={(event) => setJournalDate(event.target.value)}
                            placeholder="Choose Date"
                        />
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
