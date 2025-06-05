import { createContext, useState, useEffect, useContext } from "react";

import AuthCtx from "./AuthCtx";

const JournalsCtx = createContext({
    ctxJournalList: null,
    setCtxJournalList: () => {},
    populateCtxJournals: () => {},
    ctxUpdateJournal: () => {},
    ctxDeleteJournal: () => {},
});

export function JournalsCtxProvider(props) {
    const { ctxAccessToken } = useContext(AuthCtx);

    const [ctxJournalList, setCtxJournalList] = useState(null);

    useEffect(() => {
        populateCtxJournals();
    }, []);

    const populateCtxJournals = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/journals/", {
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
        const ctxAccessToken = localStorage.getItem("accessToken");
        try {
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
            } else if (method == "PUT") {
                setCtxJournalList((prevJournalList) => {
                    return prevJournalList.map((journal) =>
                        journal.id === selectedJournalId ? returnedJournal : journal
                    );
                });
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
