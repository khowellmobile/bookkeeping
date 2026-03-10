import { createContext, useContext } from "react";
import useSWRImmutable from "swr/immutable";

import { ApiError, api } from "../../Client";
import { useToast } from "./ToastCtx";
import PropertiesCtx from "./PropertiesCtx";
import AuthCtx from "./AuthCtx";

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

    const propertyId = ctxActiveProperty?.id;
    const { data: ctxJournalList, mutate } = useSWRImmutable(
        propertyId && ctxAccessToken ? ["/api/journals/", propertyId] : null,
        ([path, id]) => api.get(path, { query: { property_id: id } })
    );

    const ctxUpdateJournal = async (selectedJournalId, url, method, sendData) => {
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
            const returnedJournal =
                method == "POST"
                    ? await api.post("/api/journals/", sendData, {
                          query: { property_id: ctxActiveProperty?.id },
                      })
                    : await api.put(url, sendData);

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
        } catch (error) {
            if (error instanceof ApiError) {
                showToast("Error saving journal", "error", 5000);
            } else {
                showToast("Network error. Please try again.", "error", 5000);
            }
        }
    };

    const ctxDeleteJournal = async (journalId) => {
        try {
            await api.put(`/api/journals/${journalId}/`, { is_deleted: true });
            mutate((prev) => prev.filter((journal) => journal.id !== journalId), true);
            showToast("Journal deleted", "success", 3000);
        } catch (error) {
            if (error instanceof ApiError) {
                showToast("Error deleting journal", "error", 5000);
            } else {
                showToast("Network error. Please try again.", "error", 5000);
            }
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
