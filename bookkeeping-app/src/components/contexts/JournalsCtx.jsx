import { createContext, useState, useEffect, useContext } from "react";
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

    const [ctxJournalList, setCtxJournalList] = useState(null);

    useEffect(() => {
        if (ctxAccessToken) {
            populateCtxJournals();
        }
    }, [ctxActiveProperty, ctxAccessToken]);

    const populateCtxJournals = async () => {
        try {
            const url = new URL("http://localhost:8000/api/journals/");
            if (ctxActiveProperty && ctxActiveProperty.id) {
                url.searchParams.append("property_id", ctxActiveProperty.id);
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
            setCtxJournalList(data);
            /* console.log(data); */
        } catch (e) {
            console.log("Error: " + e);
        }
    };

    const ctxUpdateJournal = async (selectedJournalId, url, method, sendData) => {
        const ctxAccessToken = localStorage.getItem("accessToken");

        console.log(sendData);

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
        }

        try {
            const finalUrl = method == "POST" ? new URL("http://localhost:8000/api/journals/") : url;
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
                setCtxJournalList((prev) => {
                    return [...prev, returnedJournal];
                });
                showToast("Journal saved", "success", 3000);
                return returnedJournal;
            } else if (method == "PUT") {
                setCtxJournalList((prevJournalList) => {
                    return prevJournalList.map((journal) =>
                        journal.id === selectedJournalId ? returnedJournal : journal
                    );
                });
                showToast("Journal saved", "success", 3000);
                return returnedJournal;
            }
        } catch (e) {
            console.log("Error: " + e);
            showToast("Error saving journal", "error", 5000);
        }
    };

    const ctxDeleteJournal = async (journalId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/journals/${journalId}/`, {
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
        setCtxJournalList,
        populateCtxJournals,
        ctxUpdateJournal,
        ctxDeleteJournal,
    };

    return <JournalsCtx.Provider value={context}>{props.children}</JournalsCtx.Provider>;
}

export default JournalsCtx;
