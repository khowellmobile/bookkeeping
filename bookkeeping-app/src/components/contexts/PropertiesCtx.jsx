import { createContext, useState, useEffect } from "react";

const PropertiesCtx = createContext({
    ctxPropertyList: null,
    populateCtxProperties: () => {},
    setCtxPropertyList: () => {},
});

export function PropertiesCtxProvider(props) {
    const [ctxPropertyList, setCtxPropertyList] = useState(null);

    const populateCtxProperties = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/properties/", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${ctxAccessToken}`,
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setCtxPropertyList(data);
        } catch (e) {
            console.log("Error: " + e);
        }
    };

    const context = {
        ctxPropertyList,
        populateCtxProperties,
        setCtxPropertyList,
    };

    return <PropertiesCtx.Provider value={context}>{props.children}</PropertiesCtx.Provider>;
}

export default PropertiesCtx;
