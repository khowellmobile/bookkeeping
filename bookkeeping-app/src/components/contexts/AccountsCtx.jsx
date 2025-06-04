import { createContext, useState, useEffect, useContext } from "react";

import AuthCtx from "./AuthCtx";

const AccountsCtx = createContext({
    ctxActiveAccount: null,
    ctxAccountList: null,
    populateCtxAccounts: () => {},
    setCtxActiveAccount: () => {},
    setCtxAccountList: () => {},
});

export function AccountsCtxProvider(props) {
    const { ctxAccessToken } = useContext(AuthCtx);

    const [ctxActiveAccount, setCtxActiveAccount] = useState({ name: "None Selected" });
    const [ctxAccountList, setCtxAccountList] = useState(null);

    useEffect(() => {
        populateCtxAccounts();
    }, []);

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

    const context = {
        ctxActiveAccount,
        ctxAccountList,
        populateCtxAccounts,
        setCtxActiveAccount,
        setCtxAccountList,
    };

    return <AccountsCtx.Provider value={context}>{props.children}</AccountsCtx.Provider>;
}

export default AccountsCtx;
