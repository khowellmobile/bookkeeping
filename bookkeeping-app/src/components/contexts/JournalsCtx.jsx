import { createContext, useState, useEffect, useContext } from "react";

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
    const { ctxAccessToken } = useContext(AuthCtx);
    const { ctxActiveProperty } = useContext(PropertiesCtx);

    const [ctxJournalList, setCtxJournalList] = useState(null);

    useEffect(() => {
        if (ctxAccessToken) {
            populateCtxJournals();
        }
    }, [ctxActiveProperty]);

    const populateCtxJournals = async () => {
        try {
            const url = new URL("http://localhost:8000/api/journals/");
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
            setCtxJournalList(data);
        } catch (e) {
            console.log("Error: " + e);
        }
    };

    const ctxUpdateJournal = async (selectedJournalId, url, method, sendData) => {
        console.log(selectedJournalId, url, method, sendData)
        const ctxAccessToken = localStorage.getItem("accessToken");
        try {
            const url = method == "POST" ? new URL("http://localhost:8000/api/journals/") : url;
            if (method == "POST" && ctxActiveProperty && ctxActiveProperty.id) {
                url.searchParams.append("property_id", ctxActiveProperty.id);
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ctxAccessToken}`,
                },
                body: JSON.stringify(sendData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const returnedJournal = await response.json();
            if (method == "POST") {
                setCtxJournalList((prev) => {
                    return [...prev, returnedJournal];
                });

                return returnedJournal;
            } else if (method == "PUT") {
                setCtxJournalList((prevJournalList) => {
                    return prevJournalList.map((journal) =>
                        journal.id === selectedJournalId ? returnedJournal : journal
                    );
                });
                return returnedJournal;
            }
        } catch (e) {
            console.log("Error: " + e);
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
