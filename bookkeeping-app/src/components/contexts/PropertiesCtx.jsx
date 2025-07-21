import { createContext, useState, useEffect, useContext } from "react";
import { useToast } from "./ToastCtx";

import AuthCtx from "./AuthCtx";

const PropertiesCtx = createContext({
    ctxActiveProperty: null,
    setCtxActiveProperty: () => {},
    ctxPropertyList: null,
    setCtxPropertyList: () => {},
    populateCtxProperties: () => {},
    ctxAddProperty: () => {},
    ctxUpdateProperty: () => {},
});

export function PropertiesCtxProvider(props) {
    const { showToast } = useToast();

    const { ctxAccessToken } = useContext(AuthCtx);

    const [ctxPropertyList, setCtxPropertyList] = useState(null);
    const [ctxActiveProperty, setCtxActiveProperty] = useState();

    useEffect(() => {
        if (ctxAccessToken) {
            populateCtxProperties();
        }
    }, [ctxAccessToken]);

    useEffect(() => {
        if (!ctxActiveProperty && !sessionStorage.getItem("activePropertyId")) {
            showToast("Please select a Property", "warning", 5000);
        }

        if (ctxActiveProperty) {
            sessionStorage.setItem("activePropertyId", JSON.stringify(ctxActiveProperty.id));
        }
    }, [ctxActiveProperty]);

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

            const storedPropertyId = sessionStorage.getItem("activePropertyId");
            if (storedPropertyId) {
                const id = parseInt(storedPropertyId, 10);

                const foundProperty = data.find((property) => property.id === id);

                if (foundProperty) {
                    setCtxActiveProperty(foundProperty);
                } else {
                    console.warn(`Stored property ID ${storedPropertyId} not found in fetched data.`);
                    sessionStorage.removeItem("activePropertyId");
                }
            }
        } catch (e) {
            console.log("Error: " + e);
        }
    };

    const ctxAddProperty = async (propertyToAdd) => {
        console.log(propertyToAdd);
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
                showToast("Error adding Property", "error", 5000);
            } else {
                const newProperty = await response.json();
                setCtxPropertyList((prev) => {
                    return [...prev, newProperty];
                });
                showToast("Property added", "success", 3000);
            }
        } catch (e) {
            console.error("Error:", e);
            showToast("Error adding Property", "error", 5000);
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
                showToast("Property updated", "success", 3000);
            }
        } catch (e) {
            console.log("Error: " + e);
            showToast("Error adding Property", "error", 5000);
        }
    };

    const context = {
        ctxActiveProperty,
        setCtxActiveProperty,
        ctxPropertyList,
        setCtxPropertyList,
        populateCtxProperties,
        ctxAddProperty,
        ctxUpdateProperty,
    };

    return <PropertiesCtx.Provider value={context}>{props.children}</PropertiesCtx.Provider>;
}

export default PropertiesCtx;
