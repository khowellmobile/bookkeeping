import { createContext, useState, useEffect, useContext } from "react";

import AuthCtx from "./AuthCtx";

const JournalsCtx = createContext({
    ctxJournalList: null,
    setCtxJournalList: () => {},
    populateCtxJournals: () => {},
    ctxUpdateJournal: () => {},
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
        if (method == "POST") {
            console.log(sendData);
        }
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

    const context = {
        ctxJournalList,
        setCtxJournalList,
        populateCtxJournals,
        ctxUpdateJournal,
    };

    return <JournalsCtx.Provider value={context}>{props.children}</JournalsCtx.Provider>;
}

export default JournalsCtx;
