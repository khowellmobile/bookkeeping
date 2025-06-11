import { createContext, useState, useEffect, useContext } from "react";

import AuthCtx from "./AuthCtx";

const PropertiesCtx = createContext({
    ctxPropertyList: null,
    setCtxPropertyList: () => {},
    populateCtxProperties: () => {},
});

export function PropertiesCtxProvider(props) {
    const { ctxAccessToken } = useContext(AuthCtx);

    const [ctxPropertyList, setCtxPropertyList] = useState(null);

    useEffect(() => {
        if (ctxAccessToken) {
            populateCtxProperties();
        }
    }, []);

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
        setCtxPropertyList,
        populateCtxProperties,
    };

    return <PropertiesCtx.Provider value={context}>{props.children}</PropertiesCtx.Provider>;
}

export default PropertiesCtx;
