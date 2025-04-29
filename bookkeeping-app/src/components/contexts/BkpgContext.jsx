import { createContext, useState, useEffect } from "react";

const BkpgContext = createContext({
    ctxActiveClient: null,
    ctxActiveAccount: null,
    ctxAccountList: null,
    changeCtxActiveClient: (client) => {},
    changeCtxActiveAccount: (account) => {},
    changeCtxAccountList: (accounts) => {},
    populateCtxACcounts: () => {},
});

export function BkpgContextProvider(props) {
    const [ctxActiveClient, setCtxActiveClient] = useState(null);
    const [ctxActiveAccount, setCtxActiveAccount] = useState({ name: "None Selected" });
    const [ctxAccountList, setCtxAccountList] = useState(null);
    const accessToken = localStorage.getItem("accessToken");

    const changeCtxActiveClient = (client) => {
        setCtxActiveClient(client);
    };

    const changeCtxActiveAccount = (account) => {
        setCtxActiveAccount(account);
    };

    const changeCtxAccountList = (account) => {
        setCtxAccountList(account);
    };

    const populateCtxACcounts = async () => {
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
        }
    };

    const context = {
        ctxActiveClient,
        ctxActiveAccount,
        ctxAccountList,
        changeCtxActiveClient,
        changeCtxActiveAccount,
        changeCtxAccountList,
        populateCtxACcounts,
    };

    return <BkpgContext.Provider value={context}>{props.children}</BkpgContext.Provider>;
}

export default BkpgContext;
