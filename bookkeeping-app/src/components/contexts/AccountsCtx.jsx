import { createContext, useState, useEffect, useContext } from "react";
import useSWRImmutable from "swr/immutable";

import { useToast } from "./ToastCtx";
import { BASE_URL } from "../../constants";
import AuthCtx from "./AuthCtx";
import PropertiesCtx from "./PropertiesCtx";

const AccountsCtx = createContext({
    ctxActiveAccount: null,
    ctxAccountList: null,
    ctxGetNonPropertyAccounts: () => {},
    setCtxActiveAccount: () => {},
    ctxAddAccount: () => {},
    ctxUpdateAccount: () => {},
    ctxDeleteAccount: () => {},
});

export function AccountsCtxProvider(props) {
    const { showToast } = useToast();

    const { ctxAccessToken } = useContext(AuthCtx);
    const { ctxActiveProperty } = useContext(PropertiesCtx);

    const [ctxActiveAccount, setCtxActiveAccount] = useState({ name: "None Selected" });

    const fetcher = async (url) => {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${ctxAccessToken}`,
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    };

    const baseUrl = BASE_URL;
    const apiURL = `${baseUrl}/api/accounts/`;
    const propertyId = ctxActiveProperty?.id;
    const {
        data: ctxAccountList,
        error,
        mutate,
    } = useSWRImmutable(propertyId && ctxAccessToken ? [`${apiURL}?property_id=${propertyId}`] : null, fetcher);

    useEffect(() => {
        setCtxActiveAccount({ name: "None Selected" });
    }, [ctxActiveProperty, ctxAccessToken]);

    const ctxGetNonPropertyAccounts = async () => {
        try {
            const url = new URL(`${baseUrl}/api/accounts/`);
            if (ctxActiveProperty && ctxActiveProperty.id) {
                url.searchParams.append("property_id", ctxActiveProperty.id);
                url.searchParams.append("get_non_property_accounts", true);
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
            return data;
        } catch (e) {
            console.error("Error: " + e);
        }
    };

    const ctxAddAccount = async (account, addExisting = false) => {
        try {
            const url = new URL(`${baseUrl}/api/accounts/`);
            if (ctxActiveProperty && ctxActiveProperty.id) {
                url.searchParams.append("property_id", ctxActiveProperty.id);
                if (addExisting) url.searchParams.append("add_existing", true);
            }

            const response = await fetch(url.toString(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ctxAccessToken}`,
                },
                body: JSON.stringify(account),
            });

            if (!response.ok) {
                throw new Error(`HTTP error. Status: ${response.status}`);
            }

            const newAccount = await response.json();
            mutate((prev) => (prev ? [...prev, newAccount] : [newAccount]), false);
            showToast("Account added", "success", 3000);
        } catch (error) {
            console.error("Error sending Account Info:", error);
            showToast("Error adding Account", "error", 5000);
        }
    };

    const ctxUpdateAccount = async (editedAccount) => {
        try {
            const response = await fetch(`${baseUrl}/api/accounts/${editedAccount.id}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ctxAccessToken}`,
                },
                body: JSON.stringify(editedAccount),
            });

            if (!response.ok) {
                throw new Error(`HTTP error. Status: ${response.status}`);
            }

            const updatedData = await response.json();
            mutate((prevAccounts) => prevAccounts.map((acc) => (acc.id === updatedData.id ? updatedData : acc)), false);
            showToast("Account Updated", "success", 3000);
        } catch (error) {
            console.error("Error editing account:", error);
            showToast("Error updating Account", "error", 5000);
        }
    };

    const ctxDeleteAccount = async (accountId) => {
        try {
            const response = await fetch(`${baseUrl}/api/accounts/${accountId}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ctxAccessToken}`,
                },
                body: JSON.stringify({ is_deleted: true }),
            });

            if (!response.ok) {
                console.error("Error:", response.error);
                return;
            }

            mutate((prev) => prev.filter((acc) => acc.id !== accountId), true);
        } catch (error) {
            console.error("Error marking account inactive:", error);
        }
    };

    const context = {
        ctxActiveAccount,
        ctxAccountList,
        ctxGetNonPropertyAccounts,
        setCtxActiveAccount,
        ctxAddAccount,
        ctxUpdateAccount,
        ctxDeleteAccount,
    };

    return <AccountsCtx.Provider value={context}>{props.children}</AccountsCtx.Provider>;
}

export default AccountsCtx;
