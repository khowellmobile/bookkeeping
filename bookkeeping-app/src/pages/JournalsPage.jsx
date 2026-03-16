import { useState, useCallback, useMemo, useRef, useContext, useEffect, useReducer } from "react";

import classes from "./JournalsPage.module.css";

import JournalsCtx from "../components/contexts/JournalsCtx";
import PropertiesCtx from "../components/contexts/PropertiesCtx";
import ConfirmationModal from "../components/elements/modals/ConfirmationModal";
import NoResultsDisplay from "../components/elements/utilities/NoResultsDisplay";
import Input from "../components/elements/utilities/Input";
import { JournalEntryItem } from "../components/elements/items/InputEntryItems";
import Button from "../components/elements/utilities/Button";
import journalReducer, { initialJournalState } from "../reducers/journalReducer";

const normalizeAmount = (value) => {
    const parsed = parseFloat(value);
    if (Number.isNaN(parsed) || parsed < 0) return "";
    return value;
};

const isValidDateString = (date) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
    const parsed = new Date(date);
    return !Number.isNaN(parsed.getTime());
};

const isItemNonEmpty = (item) =>
    item.account !== "" ||
    (item.amount !== "" && item.amount !== null && item.amount !== undefined) ||
    (item.memo && item.memo.trim() !== "");

const isItemValid = (item) => {
    if (!item.account) return false;
    if (item.amount === "" || Number(item.amount) < 0) return false;
    if (item.type !== "debit" && item.type !== "credit") return false;
    return true;
};

const JournalsPage = () => {
    const { ctxJournalList, ctxUpdateJournal, ctxDeleteJournal } = useContext(JournalsCtx);
    const { ctxActiveProperty } = useContext(PropertiesCtx);

    const scrollRef = useRef();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState({
        type: null,
        payload: null,
    });

    const [state, dispatch] = useReducer(journalReducer, initialJournalState);
    const { name: journalName, date: journalDate, items: journalItems, activeJournal, isEditing } = state;

    const clearInputs = useCallback(() => {
        dispatch({ type: "RESET" });
    }, []);

    const setToEditIndex = useCallback(
        (index) => {
            const journal = ctxJournalList[index];

            if (!journal) {
                clearInputs();
                return;
            }

            dispatch({
                type: "SET_ACTIVE",
                payload: journal,
            });
        },
        [clearInputs, ctxJournalList],
    );

    // Clear active journal on property change
    useEffect(() => {
        clearInputs();
    }, [clearInputs, ctxActiveProperty]);

    const { debitTotal, creditTotal } = useMemo(() => {
        return journalItems.reduce(
            (acc, item) => {
                const amount = parseFloat(item.amount);
                const safeAmount = Number.isNaN(amount) ? 0 : amount;

                if (item.type === "debit") acc.debitTotal += safeAmount;
                if (item.type === "credit") acc.creditTotal += safeAmount;

                return acc;
            },
            { debitTotal: 0, creditTotal: 0 },
        );
    }, [journalItems]);

    const isBalanced = useMemo(() => Math.abs(debitTotal - creditTotal) < 0.0001, [debitTotal, creditTotal]);

    const isJournalItemsEmpty = useMemo(() => journalItems.every((item) => !isItemNonEmpty(item)), [journalItems]);

    const isJournalChanged = useMemo(() => {
        if (!activeJournal) {
            return journalName !== "" || journalDate !== "" || !isJournalItemsEmpty;
        }

        return (
            journalName !== activeJournal.name ||
            journalDate !== activeJournal.date ||
            JSON.stringify(journalItems) !== JSON.stringify(activeJournal.journal_items)
        );
    }, [activeJournal, isJournalItemsEmpty, journalDate, journalItems, journalName]);

    const handleFocusLastItem = useCallback(
        (index) => {
            if (index === journalItems.length - 1) {
                dispatch({ type: "ADD_ROW" });
            }
        },
        [journalItems.length],
    );

    const handleItemChange = useCallback((index, name, value) => {
        let payload = {};

        if (name === "account") {
            payload = { account: value };
        } else if (name === "debit" || name === "credit") {
            payload = {
                type: name,
                amount: normalizeAmount(value),
            };
        } else if (name === "memo") {
            payload = { memo: value };
        }

        dispatch({
            type: "UPDATE_ITEM",
            index,
            payload,
        });
    }, []);

    const saveInfo = useCallback(async () => {
        const journal_items = journalItems.filter(isItemNonEmpty);
        const sendData = {
            name: journalName,
            date: journalDate,
            journal_items: journal_items,
        };

        const hasLineError = sendData.journal_items.some((item) => !isItemValid(item));
        const hasDateError = !isValidDateString(journalDate);

        if (hasLineError || hasDateError || !isBalanced) {
            return { ok: false, message: "Invalid journal fields or unbalanced totals." };
        }

        const method = isEditing ? "PUT" : "POST";
        const id = activeJournal ? activeJournal.id : null;
        const returnedJournal = await ctxUpdateJournal(id, method, sendData);

        if (!returnedJournal) {
            return { ok: false, message: "Save failed." };
        }

        dispatch({
            type: "SET_ACTIVE",
            payload: returnedJournal,
        });

        return { ok: true };
    }, [activeJournal, ctxUpdateJournal, isBalanced, isEditing, journalDate, journalItems, journalName]);

    const handleHistoryClick = (index) => {
        if ((activeJournal === null || ctxJournalList[index]?.id !== activeJournal.id) && isJournalChanged) {
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
        if (isJournalChanged) {
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

    return (
        <>
            {isModalOpen && confirmAction.type && (
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
                                <NoResultsDisplay
                                    mainText={"No Journals to load."}
                                    guideText={"Have you chosen a Property?"}
                                />
                            )}
                        </section>
                    </div>
                    <div className={classes.journalEntry}>
                        <section className={classes.header}>
                            {isEditing ? <h2>Edit an Entry</h2> : <h2>Make an Entry</h2>}
                            <div className={classes.headerTools}>
                                <Button onClick={saveInfo} text={isEditing ? "Save Edits" : "Save Entry"} />
                                <Button onClick={handleNewEntryClick} text={isEditing ? "New Entry" : "Clear Inputs"} />
                                {isEditing && <Button onClick={handleDeleteClick} text={"Delete Entry"} />}
                            </div>
                        </section>
                        <section className={classes.titleDate}>
                            <Input
                                type="text"
                                value={journalName}
                                onChange={(event) =>
                                    dispatch({
                                        type: "UPDATE_FIELD",
                                        field: "name",
                                        value: event.target.value,
                                    })
                                }
                                placeholder="Enter Journal Name"
                            />
                            <Input
                                type="date"
                                value={journalDate}
                                onChange={(event) =>
                                    dispatch({
                                        type: "UPDATE_FIELD",
                                        field: "date",
                                        value: event.target.value,
                                    })
                                }
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
