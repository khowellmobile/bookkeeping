import { useState, useCallback, useMemo, useEffect, useRef, useContext } from "react";

import classes from "./JournalsPage.module.css";

import JournalsCtx from "../components/contexts/JournalsCtx";

import { JournalEntryItem } from "../components/elements/items/InputEntryItems";
import ConfirmationModal from "../components/elements/modals/ConfirmationModal";

const JournalsPage = () => {
    const { ctxJournalList, populateCtxJournals, ctxUpdateJournal, ctxDeleteJournal } = useContext(JournalsCtx);

    const scrollRef = useRef();

    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeJournal, setActiveJournal] = useState(null);
    const [journalName, setJournalName] = useState("");
    const [journalDate, setJournalDate] = useState("");
    const [journalItems, setJournalItems] = useState(
        Array(14)
            .fill(null)
            .map(() => ({
                account: "",
                debit: "",
                credit: "",
                memo: "",
            }))
    );

    const [confirmAction, setConfirmAction] = useState({
        type: null,
        payload: null,
    });

    const saveInfo = async () => {
        // Getting non-empty items
        const item_list = journalItems.filter((item) => {
            return (
                (item.account !== "" && item.account !== null && item.account !== undefined) ||
                (item.debit !== "" && item.debit !== null && item.debit !== undefined && item.debit !== 0) ||
                (item.credit !== "" && item.credit !== null && item.credit !== undefined && item.credit !== 0) ||
                (item.memo && item.memo.trim() !== "")
            );
        });

        const name = journalName;
        const date = journalDate;
        let url = "http://localhost:8000/api/journals/";
        const method = isEditing ? "PUT" : "POST";
        const id = activeJournal ? activeJournal.id : null;

        if (isEditing) {
            url = url + `${activeJournal.id}/`;
        }

        const sendData = {
            name: name,
            date: date,
            item_list: item_list,
        };

        const returnedJournal = await ctxUpdateJournal(id, url, method, sendData);
        setActiveJournal(returnedJournal);
        setJournalName(returnedJournal.name);
        setJournalDate(returnedJournal.date);
        setJournalItems(returnedJournal.item_list);
        setIsEditing(true);
    };

    const debitTotal = useMemo(() => {
        if (journalItems) {
            return journalItems.reduce((sum, item) => {
                const amount = parseFloat(item.debit) || 0;
                return sum + (amount > 0 ? amount : 0);
            }, 0);
        } else {
            return 0;
        }
    }, [journalItems]);

    const creditTotal = useMemo(() => {
        if (journalItems) {
            return journalItems.reduce((sum, item) => {
                const amount = parseFloat(item.credit) || 0;
                return sum + (amount > 0 ? amount : 0);
            }, 0);
        } else {
            return 0;
        }
    }, [journalItems]);

    const isJournalItemsEmpty = useMemo(() => {
        return journalItems.every(
            (item) => item.account === "" && item.debit === "" && item.credit === "" && item.memo === ""
        );
    }, [journalItems]);

    const handleFocusLastItem = useCallback(
        (index) => {
            if (index === journalItems.length - 1) {
                setJournalItems([...journalItems, { account: "", debit: "", credit: "", memo: "" }]);
            }
        },
        [journalItems, setJournalItems]
    );

    const handleItemChange = useCallback(
        (index, name, value) => {
            // Shallow copy
            const newJournalItems = [...journalItems];

            // Deep copy
            const updatedItem = { ...newJournalItems[index] };

            if (name === "account") {
                updatedItem.account = value.id;
            } else if (name === "debit") {
                updatedItem.credit = "";
                updatedItem.debit = checkAmount(value);
            } else if (name === "credit") {
                updatedItem.debit = "";
                updatedItem.credit = checkAmount(value);
            } else if (name === "memo") {
                updatedItem.memo = value;
            }

            newJournalItems[index] = updatedItem;

            setJournalItems(newJournalItems);
        },
        [journalItems, setJournalItems]
    );

    const isJournalChanged = () => {
        if (!activeJournal) {
            if (journalName != "" || journalDate != "" || !isJournalItemsEmpty) {
                return true;
            } else {
                return false;
            }
        }

        return (
            journalName != activeJournal.name ||
            journalDate != activeJournal.date ||
            JSON.stringify(journalItems) != JSON.stringify(activeJournal.item_list)
        );
    };

    const handleHistoryClick = (index) => {
        if ((activeJournal === null || ctxJournalList[index]?.id !== activeJournal.id) && isJournalChanged()) {
            setIsModalOpen(true);
            setConfirmAction({
                type: "switch_active",
                payload: index,
            });
        } else if (activeJournal === null || ctxJournalList[index]?.id !== activeJournal.id) {
            setToEditIndex(index);
        }
    };

    const handleNewEntryClick = () => {
        if (isJournalChanged()) {
            setIsModalOpen(true);
            setConfirmAction({
                type: "discard_and_new",
                payload: null,
            });
        } else {
            clearInputs();
        }
    };

    const handleDeleteClick = () => {
        setIsModalOpen(true);
        setConfirmAction({
            type: "delete_entry",
            payload: null,
        });
    };

    const setToEditIndex = (index) => {
        setJournalItems(ctxJournalList[index]?.item_list || []);
        setJournalDate(ctxJournalList[index]?.date || "");
        setJournalName(ctxJournalList[index]?.name || "");
        setActiveJournal(ctxJournalList[index] || {});
        setIsEditing(true);
    };

    const clearInputs = () => {
        setJournalDate("");
        setJournalName("");
        setActiveJournal(null);
        setJournalItems(
            Array(14)
                .fill(null)
                .map(() => ({
                    account: "",
                    debit: "",
                    credit: "",
                    memo: "",
                }))
        );
        setIsEditing(false);
    };

    const onConfirmModalAction = () => {
        setIsModalOpen(false);
        switch (confirmAction.type) {
            case "switch_active":
                setToEditIndex(confirmAction.payload);
                return;
            case "discard_and_new":
                clearInputs();
                return;
            case "delete_entry":
                ctxDeleteJournal(activeJournal.id);
                clearInputs();
                return;
            default:
        }
    };

    const onCancelModalAction = () => {
        setIsModalOpen(false);
        setConfirmAction({ type: null, payload: null });
    };

    const getModalText = () => {
        switch (confirmAction.type) {
            case "switch_active":
            case "discard_and_new":
                return {
                    msg: "You have unsaved changes. Are you sure you want to discard them?",
                    confirm_txt: "Discard Changes",
                    cancel_txt: "Keep Editing",
                };
            case "delete_entry":
                return {
                    msg: "Are you sure you wish to delete this journal entry?",
                    confirm_txt: "Delete",
                    cancel_txt: "Cancel Deletion",
                };
            default:
                return { msg: "", confirm_txt: "", cancel_txt: "" };
        }
    };

    const checkAmount = (val) => {
        if (val >= 0 && !isNaN(parseFloat(val))) {
            return val;
        } else {
            return "";
        }
    };

    return (
        <>
            {isModalOpen &&
                confirmAction.type && ( // Only render if modal is open and type is set
                    <ConfirmationModal
                        text={getModalText()}
                        onConfirm={onConfirmModalAction}
                        onCancel={onCancelModalAction}
                    />
                )}
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
                                <button onClick={handleNewEntryClick}>
                                    {isEditing ? "New Entry" : "Clear Inputs"}
                                </button>
                                {isEditing && <button onClick={handleDeleteClick}>Delete Entry</button>}
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
        </>
    );
};

export default JournalsPage;
