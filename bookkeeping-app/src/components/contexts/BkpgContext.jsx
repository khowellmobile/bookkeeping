import { createContext, useState, useEffect } from "react";

const BkpgContext = createContext({
    ctxActiveClient: null,
    ctxActiveAccount: null,
    ctxAccountList: null,
    ctxEntityList: null,
    ctxIsLoading: null,
    changeCtxActiveClient: (client) => {},
    changeCtxActiveAccount: (account) => {},
    changeCtxAccountList: (accounts) => {},
    populateCtxAccounts: () => {},
    setCtxAccountList: () => {},
});

export function BkpgContextProvider(props) {
    const [ctxIsLoading, setCtxIsLoading] = useState(false);
    const [ctxActiveClient, setCtxActiveClient] = useState(null);
    const [ctxActiveAccount, setCtxActiveAccount] = useState({ name: "None Selected" });
    const [ctxAccountList, setCtxAccountList] = useState(null);
    const [ctxEntityList, setCtxEntityList] = useState(null);
    const accessToken = localStorage.getItem("accessToken") || null;

    const changeCtxActiveClient = (client) => {
        setCtxActiveClient(client);
    };

    const changeCtxActiveAccount = (account) => {
        setCtxActiveAccount(account);
    };

    const changeCtxAccountList = (account) => {
        setCtxAccountList(account);
    };

    const populateCtxAccounts = async () => {
        if (!ctxIsLoading) {
            setCtxIsLoading(true);
        }

        try {
            const response = await fetch("http://localhost:8000/api/accounts/", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setCtxAccountList(data);
        } catch (e) {
            console.log("Error: " + e);
        } finally {
            setCtxIsLoading(false);
        }
    };

    const populateCtxEntities = async () => {
        if (!ctxIsLoading) {
            setCtxIsLoading(true);
        }

        try {
            const response = await fetch("http://localhost:8000/api/entities/", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setCtxEntityList(data);
        } catch (e) {
            setError(e.message);
        } finally {
            setCtxIsLoading(false);
        }
    };

    useEffect(() => {
        if (accessToken) {
            populateCtxAccounts();
            populateCtxEntities();
        }
    }, []);

    const context = {
        ctxActiveClient,
        ctxActiveAccount,
        ctxAccountList,
        ctxEntityList,
        ctxIsLoading,
        changeCtxActiveClient,
        changeCtxActiveAccount,
        changeCtxAccountList,
        populateCtxAccounts,
        setCtxAccountList,
    };

    return <BkpgContext.Provider value={context}>{props.children}</BkpgContext.Provider>;
}

export default BkpgContext;
