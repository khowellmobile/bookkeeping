import { createContext, useState, useEffect, useContext } from "react";
import useSWRImmutable from "swr/immutable";

import { useToast } from "./ToastCtx";
import { ApiError, api } from "../../Client";
import PropertiesCtx from "./PropertiesCtx";
import AuthCtx from "./AuthCtx";

const AccountsCtx = createContext({
    ctxActiveAccount: null,
    ctxAccountList: null,
    ctxGetNonPropertyAccounts: () => {},
    setCtxActiveAccount: () => {},
    ctxAddAccount: () => {},
    ctxUpdateAccount: () => {},
    ctxDeleteAccount: () => {},
    ctxRefetchAccounts: () => {},
});

export function AccountsCtxProvider(props) {
    const { showToast } = useToast();

    const { ctxAccessToken } = useContext(AuthCtx);
    const { ctxActiveProperty } = useContext(PropertiesCtx);

    const [ctxActiveAccount, setCtxActiveAccount] = useState({ name: "None Selected" });

    const propertyId = ctxActiveProperty?.id;
    const { data: ctxAccountList, mutate } = useSWRImmutable(
        propertyId && ctxAccessToken ? ["/api/accounts/", propertyId] : null,
        ([path, id]) => api.get(path, { query: { property_id: id } })
    );

    // exposing mutate to consuming components
    const ctxRefetchAccounts = () => mutate();

    // Resets active account if property changes
    useEffect(() => {
        setCtxActiveAccount({ name: "None Selected" });
    }, [ctxActiveProperty, ctxAccessToken]);

    const ctxGetNonPropertyAccounts = async () => {
        if (!ctxActiveProperty?.id) return;

        try {
            return await api.get("/api/accounts/", {
                query: {
                    property_id: ctxActiveProperty.id,
                    get_non_property_accounts: true,
                },
            });
        } catch (error) {
            if (error instanceof ApiError) {
                showToast("Error getting accounts", "error", 5000);
            } else {
                showToast("Network error. Please try again.", "error", 5000);
            }
        }
    };

    const ctxAddAccount = async (account, addExisting = false) => {
        if (!ctxActiveProperty?.id) return;

        try {
            const newAccount = await api.post("/api/accounts/", account, {
                query: {
                    property_id: ctxActiveProperty.id,
                    add_existing: addExisting ? true : undefined,
                },
            });
            mutate((prev) => (prev ? [...prev, newAccount] : [newAccount]), false);
            showToast("Account added", "success", 3000);
        } catch (error) {
            if (error instanceof ApiError) {
                showToast("Error adding Account", "error", 5000);
            } else {
                showToast("Network error. Please try again.", "error", 5000);
            }
        }
    };

    const ctxUpdateAccount = async (editedAccount) => {
        try {
            const updatedData = await api.put(`/api/accounts/${editedAccount.id}/`, editedAccount);
            mutate((prevAccounts) => prevAccounts.map((acc) => (acc.id === updatedData.id ? updatedData : acc)), false);
            showToast("Account Updated", "success", 3000);
        } catch (error) {
            if (error instanceof ApiError) {
                showToast("Error updating Account", "error", 5000);
            } else {
                showToast("Network error. Please try again.", "error", 5000);
            }
        }
    };

    const ctxDeleteAccount = async (accountId) => {
        try {
            await api.put(`/api/accounts/${accountId}/`, { is_deleted: true });
            mutate((prev) => prev.filter((acc) => acc.id !== accountId), true);
        } catch (error) {
            if (error instanceof ApiError) {
                showToast("Error updating Account", "error", 5000);
            } else {
                showToast("Network error. Please try again.", "error", 5000);
            }
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
        ctxRefetchAccounts,
    };

    return <AccountsCtx.Provider value={context}>{props.children}</AccountsCtx.Provider>;
}

export default AccountsCtx;
