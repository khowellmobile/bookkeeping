import { createContext, useState } from "react";

const TransactionsCtx = createContext({
    ctxFilterBy: null,
    setCtxFilterBy: () => {},
});

export function TransactionsCtxProvider(props) {
    const [ctxFilterBy, setCtxFilterBy] = useState();

    const context = {
        ctxFilterBy,
        setCtxFilterBy,
    };

    return <TransactionsCtx.Provider value={context}>{props.children}</TransactionsCtx.Provider>;
}

export default TransactionsCtx;
