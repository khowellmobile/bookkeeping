import { useContext, useState, useMemo } from "react";
import useSWRImmutable from "swr/immutable";

import { ApiError, api } from "../Client";
import { useToast } from "../contexts/ToastCtx";
import AuthCtx from "../contexts/AuthCtx";
import PropertiesCtx from "../contexts/PropertiesCtx";
import TransactionsCtx from "../contexts/TransactionsCtx";
import AccountsCtx from "../contexts/AccountsCtx";
import EntitiesCtx from "../contexts/EntitiesCtx";

const emptyTransaction = {
    date: "",
    account: "",
    entity: "",
    memo: "",
    amount: "",
    type: "",
};

const isValidDateString = (date) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
    const parsed = new Date(date);
    return !Number.isNaN(parsed.getTime());
};

const isItemValid = (item) => {
    if (!isValidDateString(item.date)) return false;
    if (item.amount === "" || isNaN(item.amount) || item.amount < 0) return false;
    if (!item.account) return false;
    if (!item.entity) return false;
    return true;
};

const isItemEmpty = (item) => {
    return Object.values(item).every((value) => value === "");
};

const containsStr = (value, search) => {
    const normalizedValue = typeof value === "string" ? value : "";
    const normalizedSearch = typeof search === "string" ? search : "";
    return normalizedValue.toUpperCase().includes(normalizedSearch.toUpperCase());
};

export const useTransactions = () => {
    const { showToast } = useToast();

    const { ctxActiveProperty } = useContext(PropertiesCtx);
    const { ctxAccessToken } = useContext(AuthCtx);
    const { ctxRefetchAccounts, ctxActiveAccount } = useContext(AccountsCtx);
    const { ctxFilterBy } = useContext(TransactionsCtx);
    const { ctxActiveEntity } = useContext(EntitiesCtx);

    const [transToAdd, setTransToAdd] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const getSWRKey = () => {
        if (!ctxAccessToken || !ctxActiveProperty?.id) {
            return null;
        }

        if (ctxFilterBy == "account" && ctxActiveAccount?.id) {
            return ["/api/transactions/", ctxActiveProperty.id, "account", ctxActiveAccount.id];
        } else if (ctxFilterBy == "entity" && ctxActiveEntity?.id) {
            return ["/api/transactions/", ctxActiveProperty.id, "entity", ctxActiveEntity.id];
        } else {
            return;
        }
    };

    const swrKey = getSWRKey();
    const { data: tranList, mutate } = useSWRImmutable(swrKey, ([path, propertyId, filterType, filterId]) => {
        const query = { property_id: propertyId };
        if (filterType === "account") {
            query.account_id = filterId;
        } else if (filterType === "entity") {
            query.entity_id = filterId;
        }

        return api.get(path, { query });
    });

    const filteredTransactions = useMemo(() => {
        if (tranList) {
            const filtered = tranList.filter(
                (transaction) =>
                    containsStr(transaction?.account?.name, searchTerm) ||
                    containsStr(transaction?.entity?.name, searchTerm) ||
                    containsStr(transaction?.memo, searchTerm),
            );
            return filtered;
        } else {
            return [];
        }
    }, [searchTerm, tranList]);

    const addEmptyTransaction = () => {
        if (transToAdd.length > 0 && isItemEmpty(transToAdd[transToAdd.length - 1])) {
            return;
        }
        setTransToAdd((prev) => [...prev, emptyTransaction]);
    };

    const handleChange = (index, item) => {
        const newTranList = [...transToAdd];

        newTranList[index] = item;

        setTransToAdd(newTranList);
    };

    const addTransactions = async () => {
        const nonEmptyItems = transToAdd.filter((tran) => !isItemEmpty(tran));

        if (!transToAdd || transToAdd.length === 0 || nonEmptyItems.length === 0) {
            return { okay: false, message: "No transactions to add" };
        }

        const hasLineError = nonEmptyItems.some((item) => !isItemValid(item));

        if (hasLineError) {
            const message = "Invalid/Empty Transaction Fields";
            showToast(message, "error", 5000);
            return { okay: false, message: message };
        }

        const transformedTransactionsArray = nonEmptyItems.map((transaction) => ({
            ...transaction,
            entity_id: transaction.entity.id,
            account_id: transaction.account.id,
        }));

        transformedTransactionsArray.forEach((transaction) => {
            delete transaction.entity;
            delete transaction.account;
        });

        if (!ctxActiveProperty?.id) return;

        try {
            const newData = await api.post("/api/transactions/", transformedTransactionsArray, {
                query: { property_id: ctxActiveProperty.id },
            });
            mutate((prev) => [...(prev || []), ...newData], false);
            setTransToAdd([]);
            ctxRefetchAccounts(); // Ensures that ctxAccountList has new balances
            showToast("Transactions added", "success", 3000);
        } catch (error) {
            if (error instanceof ApiError) {
                showToast("Error adding transactions", "error", 5000);
            } else {
                showToast("Network error. Please try again.", "error", 5000);
            }
        }
        return { ok: true };
    };

    const updateTransaction = async (transaction) => {
        const transformedTransaction = { ...transaction };

        if (transaction.entity) {
            transformedTransaction.entity_id = transaction.entity.id;
            delete transformedTransaction.entity;
        }

        if (transaction.account) {
            transformedTransaction.account_id = transaction.account.id;
            delete transformedTransaction.account;
        }

        try {
            const updatedData = await api.put(`/api/transactions/${transaction.id}/`, transformedTransaction);
            mutate((prevTransactions) => {
                if (!prevTransactions) return [];
                return prevTransactions.map((transaction) =>
                    transaction.id === updatedData.id ? updatedData : transaction,
                );
            }, false);
            ctxRefetchAccounts(); // Ensures that ctxAccountList has new balances
            showToast("Transaction updated", "success", 3000);
        } catch (error) {
            if (error instanceof ApiError) {
                showToast("Error updating transaction", "error", 5000);
            } else {
                showToast("Network error. Please try again.", "error", 5000);
            }
        }
    };

    return {
        tranList,
        transToAdd,
        filteredTransactions,
        searchTerm,
        setSearchTerm,
        addEmptyTransaction,
        handleChange,
        addTransactions,
        updateTransaction,
    };
};
