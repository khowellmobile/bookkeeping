import { createContext, useState, useContext } from "react";
import useSWRImmutable from "swr/immutable";

import { ApiError, api } from "../Client";
import { useToast } from "./ToastCtx";
import AccountsCtx from "./AccountsCtx";
import EntitiesCtx from "./EntitiesCtx";
import PropertiesCtx from "./PropertiesCtx";
import AuthCtx from "./AuthCtx";

const TransactionsCtx = createContext({
    ctxTranList: null,
    ctxFilterBy: null,
    setCtxFilterBy: () => {},
    ctxAddTransactions: () => {},
    ctxUpdateTransaction: () => {},
});

export function TransactionsCtxProvider(props) {
    const { showToast } = useToast();

    const { ctxAccessToken } = useContext(AuthCtx);
    const { ctxActiveAccount, ctxRefetchAccounts } = useContext(AccountsCtx);
    const { ctxActiveEntity } = useContext(EntitiesCtx);
    const { ctxActiveProperty } = useContext(PropertiesCtx);

    const [ctxFilterBy, setCtxFilterBy] = useState();

    const getSWRKey = () => {
        if (!ctxAccessToken || !ctxActiveProperty || !ctxActiveProperty.id) {
            return null;
        }

        if (ctxFilterBy == "account" && ctxActiveAccount && ctxActiveAccount.id) {
            return ["/api/transactions/", ctxActiveProperty.id, "account", ctxActiveAccount.id];
        } else if (ctxFilterBy == "entity" && ctxActiveEntity && ctxActiveEntity.id) {
            return ["/api/transactions/", ctxActiveProperty.id, "entity", ctxActiveEntity.id];
        } else {
            return;
        }
    };

    const swrKey = getSWRKey();
    const { data: ctxTranList, mutate } = useSWRImmutable(swrKey, ([path, propertyId, filterType, filterId]) => {
        const query = { property_id: propertyId };
        if (filterType === "account") {
            query.account_id = filterId;
        } else if (filterType === "entity") {
            query.entity_id = filterId;
        }

        return api.get(path, { query });
    });

    const ctxAddTransactions = async (transactionsToAdd) => {
        const transformedTransactionsArray = transactionsToAdd.map((transaction) => ({
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
            ctxRefetchAccounts(); // Ensures that ctxAccountList has new balances
            showToast("Transactions added", "success", 3000);
        } catch (error) {
            if (error instanceof ApiError) {
                showToast("Error adding transactions", "error", 5000);
            } else {
                showToast("Network error. Please try again.", "error", 5000);
            }
        }
    };

    const ctxUpdateTransaction = async (transaction) => {
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
                    transaction.id === updatedData.id ? updatedData : transaction
                );
            }, false);
            showToast("Transaction updated", "success", 3000);
        } catch (error) {
            if (error instanceof ApiError) {
                showToast("Error updating transaction", "error", 5000);
            } else {
                showToast("Network error. Please try again.", "error", 5000);
            }
        }
    };

    const context = {
        ctxTranList,
        ctxFilterBy,
        setCtxFilterBy,
        ctxAddTransactions,
        ctxUpdateTransaction,
    };

    return <TransactionsCtx.Provider value={context}>{props.children}</TransactionsCtx.Provider>;
}

export default TransactionsCtx;
