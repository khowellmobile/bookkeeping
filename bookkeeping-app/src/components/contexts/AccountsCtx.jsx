import { createContext, useState, useEffect, useContext } from "react";

import AuthCtx from "./AuthCtx";
import PropertiesCtx from "./PropertiesCtx";

const AccountsCtx = createContext({
    ctxActiveAccount: null,
    ctxAccountList: null,
    populateCtxAccounts: () => {},
    setCtxActiveAccount: () => {},
    setCtxAccountList: () => {},
    ctxAddAccount: () => {},
    ctxUpdateAccount: () => {},
    ctxDeleteAccount: () => {},
});

export function AccountsCtxProvider(props) {
    const { ctxAccessToken } = useContext(AuthCtx);
    const { ctxActiveProperty } = useContext(PropertiesCtx);

    const [ctxActiveAccount, setCtxActiveAccount] = useState({ name: "None Selected" });
    const [ctxAccountList, setCtxAccountList] = useState(null);

    useEffect(() => {
        if (ctxAccessToken) {
            populateCtxAccounts();
        }
    }, [ctxActiveProperty, ctxAccessToken]);

    const populateCtxAccounts = async () => {
        try {
            const url = new URL("http://localhost:8000/api/accounts/");
            if (ctxActiveProperty && ctxActiveProperty.id) {
                url.searchParams.append("property_id", ctxActiveProperty.id);
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
            setCtxAccountList(data);
        } catch (e) {
            console.log("Error: " + e);
        }
    };

    const ctxAddAccount = async (account) => {
        try {
            const url = new URL("http://localhost:8000/api/accounts/");
            if (ctxActiveProperty && ctxActiveProperty.id) {
                url.searchParams.append("property_id", ctxActiveProperty.id);
            }

            const response = await fetch(url.toString(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ctxAccessToken}`,
                },
                body: JSON.stringify(account),
            });

            const newAccount = await response.json();
            setCtxAccountList((prev) => [...prev, newAccount]);
        } catch (error) {
            console.error("Error sending Account Info:", error);
        }
    };

    const ctxUpdateAccount = async (editedAccount) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/accounts/${editedAccount.id}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ctxAccessToken}`,
                },
                body: JSON.stringify(editedAccount),
            });

            if (!response.ok) {
                console.log("Error:", response.error);
                return;
            }

            const updatedData = await response.json();

            setCtxAccountList((prevAccounts) =>
                prevAccounts.map((acc) => {
                    if (acc.id === editedAccount.id) {
                        return updatedData;
                    } else {
                        return acc;
                    }
                })
            );
        } catch (error) {
            console.error("Error editing account:", error);
        }
    };

    const ctxDeleteAccount = async (accountId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/accounts/${accountId}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ctxAccessToken}`,
                },
                body: JSON.stringify({ is_deleted: true }),
            });

            if (!response.ok) {
                console.log("Error:", response.error);
                return;
            }
        } catch (error) {
            console.error("Error marking account inactive:", error);
        }
    };

    const context = {
        ctxActiveAccount,
        ctxAccountList,
        populateCtxAccounts,
        setCtxActiveAccount,
        setCtxAccountList,
        ctxAddAccount,
        ctxUpdateAccount,
        ctxDeleteAccount,
    };

    return <AccountsCtx.Provider value={context}>{props.children}</AccountsCtx.Provider>;
}

export default AccountsCtx;
