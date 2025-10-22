import { createContext, useState, useContext } from "react";
import useSWRImmutable from "swr/immutable";

import { BASE_URL } from "../../constants";
import { useToast } from "./ToastCtx";
import AuthCtx from "./AuthCtx";
import AccountsCtx from "./AccountsCtx";
import EntitiesCtx from "./EntitiesCtx";
import PropertiesCtx from "./PropertiesCtx";

const TransactionsCtx = createContext({
    ctxTranList: null,
    ctxFilterBy: null,
    setCtxFilterBy: () => {},
    ctxAddTransactions: () => {},
    ctxUpdateTransaction: () => {},
});

export function TransactionsCtxProvider(props) {
    console.log("HERHERHERHERHERHERHREHRHEREHERERHREHR");
    const { showToast } = useToast();

    const { ctxAccessToken } = useContext(AuthCtx);
    const { ctxActiveAccount } = useContext(AccountsCtx);
    const { ctxActiveEntity } = useContext(EntitiesCtx);
    const { ctxActiveProperty } = useContext(PropertiesCtx);

    const [ctxFilterBy, setCtxFilterBy] = useState(null);

    const fetcher = async (url) => {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${ctxAccessToken}`,
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    };

    const baseUrl = BASE_URL;
    const apiURL = `${baseUrl}/api/transactions/`;

    const getSWRKey = () => {
        if (!ctxAccessToken || !ctxActiveProperty || !ctxActiveProperty.id) {
            return null;
        }

        const url = new URL(apiURL);
        url.searchParams.append("property_id", ctxActiveProperty.id);
        if (ctxFilterBy == "account" && ctxActiveAccount && ctxActiveAccount.id) {
            url.searchParams.append("account_id", ctxActiveAccount.id);
        } else if (ctxFilterBy == "entity" && ctxActiveEntity && ctxActiveEntity.id) {
            url.searchParams.append("entity_id", ctxActiveEntity.id);
        } else {
            return;
        }

        return url.toString();
    };

    const swrKey = getSWRKey();
    const { data: ctxTranList, error, mutate } = useSWRImmutable(swrKey, fetcher);

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

        try {
            const url = new URL(`${baseUrl}/api/transactions/`);
            if (ctxActiveProperty && ctxActiveProperty.id) {
                url.searchParams.append("property_id", ctxActiveProperty.id);
            } else {
                return;
            }

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ctxAccessToken}`,
                },
                body: JSON.stringify(transformedTransactionsArray),
            });

            if (!response.ok) {
                console.log(response.error);
                showToast("Error adding transactions", "error", 5000);
                return;
            }

            const newData = await response.json();
            mutate((prev) => [...(prev || []), ...newData]);
            showToast("Transactions added", "success", 3000);
        } catch (error) {
            console.error("Error sending transactions:", error);
            showToast("Error adding transactions", "error", 5000);
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
            const response = await fetch(`${baseUrl}/api/transactions/${transaction.id}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ctxAccessToken}`,
                },
                body: JSON.stringify(transformedTransaction),
            });
            
            if (!response.ok) {
                console.log("Error:", response.error);
                showToast("Error updating transactions", "error", 5000);
                return;
            }

            const updatedData = await response.json();
            console.log(updatedData);
            mutate((prevTransactions) => {
                if (!prevTransactions) return [];
                return prevTransactions.map((transaction) =>
                    transaction.id === updatedData.id ? updatedData : transaction
                );
            }, false);
            showToast("Transaction updated", "success", 3000);
        } catch (error) {
            console.error("Error editing transaction:", error);
            showToast("Error updating transactions", "error", 5000);
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
