import { createContext, useState } from "react";

const TransactionsCtx = createContext({
    ctxTranList: null,
    populateCtxTransactions: () => {},
    setCtxTranList: () => {},
});

export function TransactionsCtxProvider(props) {
    const [ctxTranList, setCtxTranList] = useState(null);

    const populateCtxTransactions = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/transactions/", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
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

    const context = {
        ctxTranList,
        populateCtxTransactions,
        setCtxTranList,
    };

    return <TransactionsCtx.Provider value={context}>{props.children}</TransactionsCtx.Provider>;
}

export default TransactionsCtx;
