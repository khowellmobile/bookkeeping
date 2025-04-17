import { createContext, useState, useEffect } from "react";

const BkpgContext = createContext({
    ctxActiveClient: null,
    ctxActiveAccount: null,
    ctxAccountList: null,
    changeCtxActiveClient: (client) => {},
    changeCtxActiveAccount: (account) => {},
    changeCtxAccountList: (accounts) => {},
});

export function BkpgContextProvider(props) {
    const [ctxActiveClient, setCtxActiveClient] = useState(null);
    const [ctxActiveAccount, setCtxActiveAccount] = useState(null);
    const [ctxAccountList, setCtxAccountList] = useState(null);

    const changeCtxActiveClient = (client) => {
        setCtxActiveClient(client);
    };

    const changeCtxActiveAccount = (account) => {
        setCtxActiveAccount(account);
    };

    const changeCtxAccountList = (account) => {
        setCtxActiveAccount(account);
    };

    const context = {
        ctxActiveClient,
        ctxActiveAccount,
        ctxAccountList,
        changeCtxActiveClient,
        changeCtxActiveAccount,
        changeCtxAccountList,
    };

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/accounts/");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                setCtxAccountList(data);
            } catch (e) {
                console.log("Error: " + e);
            }
        };

        fetchAccounts();
    }, []);

    return <BkpgContext.Provider value={context}>{props.children}</BkpgContext.Provider>;
}

export default BkpgContext;
