import { createContext, useEffect, useState, useContext } from "react";

import AuthCtx from "./AuthCtx";
import PropertiesCtx from "./PropertiesCtx";

const TransactionsCtx = createContext({
    ctxTranList: null,
    setCtxTranList: () => {},
    populateCtxTransactions: () => {},
    ctxAddTransactions: () => {},
    ctxUpdateTransaction: () => {},
});

export function TransactionsCtxProvider(props) {
    const { ctxAccessToken } = useContext(AuthCtx);
    const { ctxActiveProperty } = useContext(PropertiesCtx);

    const [ctxTranList, setCtxTranList] = useState(null);

    useEffect(() => {
        if (ctxAccessToken) {
            populateCtxTransactions();
        }
    }, []);

    const populateCtxTransactions = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/transactions/", {
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
            const response = await fetch("http://127.0.0.1:8000/api/transactions/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ctxAccessToken}`,
                },
                body: JSON.stringify(transformedTransactionsArray),
            });

            if (!response.ok) {
                console.log(response.error);
                return;
            }

            const newData = await response.json();
            setCtxTranList((prev) => [...prev, ...newData]);
        } catch (error) {
            console.error("Error sending transactions:", error);
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
        } catch (error) {
            console.error("Error editing transaction:", error);
        }
    };

    const context = {
        ctxTranList,
        setCtxTranList,
        populateCtxTransactions,
        ctxAddTransactions,
        ctxUpdateTransaction,
    };

    return <TransactionsCtx.Provider value={context}>{props.children}</TransactionsCtx.Provider>;
}

export default TransactionsCtx;
