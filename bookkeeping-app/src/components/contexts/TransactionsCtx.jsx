import { createContext, useEffect, useState, useContext } from "react";
import { useToast } from "./ToastCtx";

import AuthCtx from "./AuthCtx";
import AccountsCtx from "./AccountsCtx";
import EntitiesCtx from "./EntitiesCtx";
import PropertiesCtx from "./PropertiesCtx";

const TransactionsCtx = createContext({
    ctxTranList: null,
    setCtxTranList: () => {},
    ctxFilterBy: null,
    setCtxFilterBy: () => {},
    populateCtxTransactions: () => {},
    ctxAddTransactions: () => {},
    ctxUpdateTransaction: () => {},
});

export function TransactionsCtxProvider(props) {
    const { showToast } = useToast();

    const { ctxAccessToken } = useContext(AuthCtx);
    const { ctxActiveAccount } = useContext(AccountsCtx);
    const { ctxActiveEntity } = useContext(EntitiesCtx);
    const { ctxActiveProperty } = useContext(PropertiesCtx);

    const [ctxFilterBy, setCtxFilterBy] = useState(null);
    const [ctxTranList, setCtxTranList] = useState(null);

    useEffect(() => {
        if (ctxAccessToken) {
            populateCtxTransactions(ctxFilterBy);
        }
    }, [ctxActiveAccount, ctxActiveEntity, ctxFilterBy, ctxAccessToken]);

    const populateCtxTransactions = async () => {
        try {
            const url = new URL("http://localhost:8000/api/transactions/");
            if (ctxFilterBy == "account" && ctxActiveAccount && ctxActiveAccount.id) {
                url.searchParams.append("account_id", ctxActiveAccount.id);
            } else if (ctxFilterBy == "entity" && ctxActiveEntity && ctxActiveEntity.id) {
                url.searchParams.append("entity_id", ctxActiveEntity.id);
            } else {
                return;
            }

            const response = await fetch(url.toString(), {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${ctxAccessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setCtxTranList(data);
        } catch (e) {
            console.log("Error: " + e);
        }
    };

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
            const url = new URL("http://localhost:8000/api/transactions/");
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
            console.log(newData);
            setCtxTranList((prev) => [...prev, ...newData]);
            showToast("Transactions added", "success", 3000);
        } catch (error) {
            console.error("Error sending transactions:", error);
            showToast("Error adding transactions", "error", 5000);
        }
    };

    const ctxUpdateTransaction = async (updatedTransaction) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/transactions/${updatedTransaction.id}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ctxAccessToken}`,
                },
                body: JSON.stringify(updatedTransaction),
            });

            if (!response.ok) {
                console.log("Error:", response.error);
                showToast("Error updating transactions", "error", 5000);
                return;
            }

            const updatedData = await response.json();

            setCtxTranList((prevTransactions) =>
                prevTransactions.map((transaction) => {
                    if (transaction.id === updatedTransaction.id) {
                        return updatedData;
                    } else {
                        return transaction;
                    }
                })
            );
            showToast("Transaction updated", "success", 3000);
        } catch (error) {
            console.error("Error editing transaction:", error);
            showToast("Error updating transactions", "error", 5000);
        }
    };

    const context = {
        ctxTranList,
        setCtxTranList,
        ctxFilterBy,
        setCtxFilterBy,
        populateCtxTransactions,
        ctxAddTransactions,
        ctxUpdateTransaction,
    };

    return <TransactionsCtx.Provider value={context}>{props.children}</TransactionsCtx.Provider>;
}

export default TransactionsCtx;
