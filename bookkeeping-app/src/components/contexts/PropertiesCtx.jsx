import { createContext, useState, useEffect, useContext } from "react";

import AuthCtx from "./AuthCtx";

const PropertiesCtx = createContext({
    ctxPropertyList: null,
    setCtxPropertyList: () => {},
    populateCtxProperties: () => {},
    ctxAddProperty: () => {},
    ctxUpdateProperty: () => {},
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

    const ctxAddProperty = async (propertyToAdd) => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/properties/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ctxAccessToken}`,
                },
                body: JSON.stringify(propertyToAdd),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Backend Error:", errorData);
            } else {
                const newProperty = await response.json();
                setCtxPropertyList((prev) => {
                    return [...prev, newProperty];
                });
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const ctxUpdateProperty = async (updatedProperty) => {
        try {
            const response = await fetch(`http://localhost:8000/api/properties/${updatedProperty.id}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ctxAccessToken}`,
                },
                body: JSON.stringify(updatedProperty),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                const returnedEntity = await response.json();
                setCtxEntityList((prevEntityList) => {
                    return prevEntityList.map((entity) => (entity.id === returnedEntity.id ? returnedEntity : entity));
                });
            }
        } catch (e) {
            console.log("Error: " + e);
        }
    };

    const context = {
        ctxPropertyList,
        setCtxPropertyList,
        populateCtxProperties,
        ctxAddProperty,
        ctxUpdateProperty,
    };

    return <PropertiesCtx.Provider value={context}>{props.children}</PropertiesCtx.Provider>;
}

export default PropertiesCtx;
