import { createContext, useState, useEffect } from "react";

const BkpgContext = createContext({
    ctxActiveClient: null,
    ctxActiveAccount: null,
    ctxAccountList: null,
    ctxEntityList: null,
    ctxTranList: null,
    ctxPropertyList: null,
    changeCtxActiveClient: (client) => {},
    changeCtxActiveAccount: (account) => {},
    changeCtxAccountList: (accounts) => {},
    populateCtxAccounts: () => {},
    populateCtxEntities: () => {},
    populateCtxTransactions: () => {},
    populateCtxProperties: () => {},
    setCtxAccountList: () => {},
    setCtxAccessToken: () => {},
    setCtxEntityList: () => {},
    setCtxPropertyList: () => {},
});

export function BkpgContextProvider(props) {
    const [ctxActiveClient, setCtxActiveClient] = useState(null);
    const [ctxActiveAccount, setCtxActiveAccount] = useState({ name: "None Selected" });
    const [ctxAccountList, setCtxAccountList] = useState(null);
    const [ctxEntityList, setCtxEntityList] = useState([]);
    const [ctxTranList, setCtxTranList] = useState(null);
    const [ctxPropertyList, setCtxPropertyList] = useState(null);
    const [ctxAccessToken, setCtxAccessToken] = useState(localStorage.getItem("accessToken") || null); // State really needed here?

    const changeCtxActiveClient = (client) => {
        setCtxActiveClient(client);
    };

    const changeCtxActiveAccount = (account) => {
        setCtxActiveAccount(account);
    };

    const changeCtxAccountList = (account) => {
        setCtxAccountList(account);
    };

    const changeCtxTranList = (transactions) => {
        setCtxTranList(transactions);
    };

    const populateCtxAccounts = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/accounts/", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${ctxAccessToken}`,
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

    const populateCtxEntities = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/entities/", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${ctxAccessToken}`,
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setCtxEntityList(data);
        } catch (e) {
            console.log("Error: " + e);
        }
    };

    const populateCtxProperties = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/properties/", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${ctxAccessToken}`,
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setCtxPropertyList(data);
        } catch (e) {
            console.log("Error: " + e);
        }
    };

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
            return data;
        } catch (e) {
            console.log("Error: " + e);
        }
    };

    // Ensures re-fetches on refresh
    useEffect(() => {
        if (ctxAccessToken) {
            populateCtxAccounts();
            populateCtxEntities();
            populateCtxTransactions();
        }
    }, []);

    const context = {
        ctxActiveClient,
        ctxActiveAccount,
        ctxAccountList,
        ctxEntityList,
        ctxTranList,
        ctxPropertyList,
        changeCtxActiveClient,
        changeCtxActiveAccount,
        changeCtxAccountList,
        changeCtxTranList,
        populateCtxAccounts,
        populateCtxEntities,
        populateCtxTransactions,
        populateCtxProperties,
        setCtxAccountList,
        setCtxAccessToken,
        setCtxEntityList,
        setCtxPropertyList,
    };

    return <BkpgContext.Provider value={context}>{props.children}</BkpgContext.Provider>;
}

export default BkpgContext;
