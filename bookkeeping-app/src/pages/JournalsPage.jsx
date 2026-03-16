import { useState, useRef, useContext } from "react";

import classes from "./JournalsPage.module.css";
import { useJournal } from "../hooks/useJournal";

import ConfirmationModal from "../components/elements/modals/ConfirmationModal";
import NoResultsDisplay from "../components/elements/utilities/NoResultsDisplay";
import Input from "../components/elements/utilities/Input";
import { JournalEntryItem } from "../components/elements/items/InputEntryItems";
import Button from "../components/elements/utilities/Button";

const JournalsPage = () => {
    const {
        state,
        journalList,
        resetJournal,
        setToJournal,
        debitTotal,
        creditTotal,
        isBalanced,
        isJournalChanged,
        handleFocusLastItem,
        handleItemChange,
        updateField,
        updateJournal,
        deleteJournal,
        saveInfo,
    } = useJournal();

    const scrollRef = useRef();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState({
        type: null,
        payload: null,
    });

    const { name: journalName, date: journalDate, items: journalItems, activeJournal, isEditing } = state;

    const handleHistoryClick = (index) => {
        if ((activeJournal === null || journalList[index]?.id !== activeJournal.id) && isJournalChanged) {
            setIsModalOpen(true);
            setConfirmAction({
                type: "switch_active",
                payload: index,
            });
        } else if (activeJournal === null || journalList[index]?.id !== activeJournal.id) {
            setToJournal(index);
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
            resetJournal();
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
                setToJournal(confirmAction.payload);
                return;
            case "discard_and_new":
                resetJournal();
                return;
            case "delete_entry":
                deleteJournal(activeJournal.id);
                resetJournal();
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
                            {journalList && journalList.length > 0 ? (
                                journalList.map((entry, index) => (
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
                                onChange={(event) => updateField("name", event.target.value)}
                                placeholder="Enter Journal Name"
                            />
                            <Input
                                type="date"
                                value={journalDate}
                                onChange={(event) => updateField("date", event.target.value)}
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
