import { useContext, useReducer, useCallback, useEffect, useMemo } from "react";
import useSWRImmutable from "swr/immutable";

import { ApiError, api } from "../Client";
import PropertiesCtx from "../components/contexts/PropertiesCtx";
import AuthCtx from "../components/contexts/AuthCtx";
import journalReducer, { initialJournalState } from "../reducers/journalReducer";
import { useToast } from "../components/contexts/ToastCtx";

// Defining utility functions
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

export const useJournal = () => {
    const { showToast } = useToast();

    const { ctxActiveProperty } = useContext(PropertiesCtx);
    const { ctxAccessToken } = useContext(AuthCtx);

    const [state, dispatch] = useReducer(journalReducer, initialJournalState);
    const { name: journalName, date: journalDate, items: journalItems, activeJournal, isEditing } = state;

    const propertyId = ctxActiveProperty?.id;
    const { data: journalList, mutate } = useSWRImmutable(
        propertyId && ctxAccessToken ? ["/api/journals/", propertyId] : null,
        ([path, id]) => api.get(path, { query: { property_id: id } }),
    );

    const resetJournal = useCallback(() => {
        dispatch({ type: "RESET" });
    }, []);

    const setToJournal = useCallback(
        (index) => {
            const journal = journalList[index];

            if (!journal) {
                resetJournal();
                return;
            }

            dispatch({
                type: "SET_ACTIVE",
                payload: journal,
            });
        },
        [resetJournal, journalList],
    );

    // Clear active journal on property change
    useEffect(() => {
        resetJournal();
    }, [resetJournal, ctxActiveProperty]);

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

    const updateField = useCallback((field, value) => {
        dispatch({
            type: "UPDATE_FIELD",
            field: field,
            value: value,
        });
    }, []);

    const updateJournal = useCallback(
        async (selectedJournalId, method, sendData) => {
            const tranformedJournalItems = sendData.journal_items.map((item) => ({
                ...item,
                account_id: item.account.id,
            }));

            tranformedJournalItems.forEach((item) => {
                delete item.account;
            });

            sendData = {
                ...sendData,
                journal_items: tranformedJournalItems,
            };

            try {
                const returnedJournal =
                    method == "POST"
                        ? await api.post("/api/journals/", sendData, {
                              query: { property_id: ctxActiveProperty?.id },
                          })
                        : await api.put(`/api/journals/${selectedJournalId}/`, sendData);

                if (method == "POST") {
                    mutate((prevJournalList) => [...(prevJournalList || []), returnedJournal], false);
                } else if (method == "PUT") {
                    mutate((prevJournalList) => {
                        return prevJournalList.map((journal) =>
                            journal.id === selectedJournalId ? returnedJournal : journal,
                        );
                    }, false);
                }

                showToast("Journal saved", "success", 3000);
                return returnedJournal;
            } catch (error) {
                if (error instanceof ApiError) {
                    showToast("Error saving journal", "error", 5000);
                } else {
                    showToast("Network error. Please try again.", "error", 5000);
                }
            }
        },
        [showToast, ctxActiveProperty?.id, mutate],
    );

    const deleteJournal = useCallback(
        async (journalId) => {
            try {
                await api.put(`/api/journals/${journalId}/`, { is_deleted: true });
                mutate((prev) => prev.filter((journal) => journal.id !== journalId), true);
                showToast("Journal deleted", "success", 3000);
            } catch (error) {
                if (error instanceof ApiError) {
                    showToast("Error deleting journal", "error", 5000);
                } else {
                    showToast("Network error. Please try again.", "error", 5000);
                }
            }
        },
        [showToast, mutate],
    );

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
        const returnedJournal = await updateJournal(id, method, sendData);

        if (!returnedJournal) {
            return { ok: false, message: "Save failed." };
        }

        dispatch({
            type: "SET_ACTIVE",
            payload: returnedJournal,
        });

        return { ok: true };
    }, [activeJournal, updateJournal, isBalanced, isEditing, journalDate, journalItems, journalName]);

    return {
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
    };
};
