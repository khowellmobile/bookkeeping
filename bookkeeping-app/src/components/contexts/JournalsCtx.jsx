import { createContext, useState, useEffect, useContext } from "react";
import useSWRImmutable from "swr/immutable";

import { useToast } from "./ToastCtx";
import AuthCtx from "./AuthCtx";
import PropertiesCtx from "./PropertiesCtx";

const JournalsCtx = createContext({
    ctxJournalList: null,
    setCtxJournalList: () => {},
    populateCtxJournals: () => {},
    ctxUpdateJournal: () => {},
    ctxDeleteJournal: () => {},
});

export function JournalsCtxProvider(props) {
    const { showToast } = useToast();

    const { ctxAccessToken } = useContext(AuthCtx);
    const { ctxActiveProperty } = useContext(PropertiesCtx);

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

    const baseUrl = import.meta.env.VITE_BASE_URL;
    const apiURL = `${baseUrl}/api/journals/`;
    const propertyId = ctxActiveProperty?.id;
    const {
        data: ctxJournalList,
        error,
        mutate,
    } = useSWRImmutable(propertyId && ctxAccessToken ? [`${apiURL}?property_id=${propertyId}`] : null, fetcher);

    const ctxUpdateJournal = async (selectedJournalId, url, method, sendData) => {
        const ctxAccessToken = localStorage.getItem("accessToken");

        const tranformedJournalItems = sendData.journal_items.map((item) => ({
            ...item,
            account_id: item.account.id,
        }));

        tranformedJournalItems.forEach((item) => {
            delete item.account;
        });

        sendData = {
            ...sendData,
            journal_items: tranformedJournalItems,
        };

        try {
            const finalUrl = method == "POST" ? new URL(`${baseUrl}/api/journals/`) : url;
            if (method == "POST" && ctxActiveProperty && ctxActiveProperty.id) {
                finalUrl.searchParams.append("property_id", ctxActiveProperty.id);
            }

            const response = await fetch(finalUrl, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ctxAccessToken}`,
                },
                body: JSON.stringify(sendData),
            });

            if (!response.ok) {
                showToast("Error saving journal", "error", 5000);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const returnedJournal = await response.json();
            if (method == "POST") {
                mutate((prevJournalList) => [...(prevJournalList || []), returnedJournal], false);
            } else if (method == "PUT") {
                mutate((prevJournalList) => {
                    return prevJournalList.map((journal) =>
                        journal.id === selectedJournalId ? returnedJournal : journal
                    );
                }, false);
            }

            showToast("Journal saved", "success", 3000);
            return returnedJournal;
        } catch (e) {
            console.log("Error: " + e);
            showToast("Error saving journal", "error", 5000);
        }
    };

    const ctxDeleteJournal = async (journalId) => {
        try {
            const response = await fetch(`${baseUrl}/api/journals/${journalId}/`, {
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
        ctxJournalList,
        ctxUpdateJournal,
        ctxDeleteJournal,
    };

    return <JournalsCtx.Provider value={context}>{props.children}</JournalsCtx.Provider>;
}

export default JournalsCtx;
