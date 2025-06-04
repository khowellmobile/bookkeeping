import { createContext, useState } from "react";

const EntitiesCtx = createContext({
    ctxEntityList: null,
    populateCtxEntities: () => {},
    setCtxEntityList: () => {},
});

export function EntitiesCtxProvider(props) {
    const [ctxEntityList, setCtxEntityList] = useState([]);

    const populateCtxEntities = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/entities/", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${ctxAccessToken}`,
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setCtxEntityList(data);
        } catch (e) {
            console.log("Error: " + e);
        }
    };

    const context = {
        ctxEntityList,
        populateCtxEntities,
        setCtxEntityList,
    };

    return <EntitiesCtx.Provider value={context}>{props.children}</EntitiesCtx.Provider>;
}

export default EntitiesCtx;
