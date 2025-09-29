import { createContext, useState, useEffect, useContext } from "react";
import useSWRImmutable from "swr/immutable";
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

    const [ctxActiveProperty, setCtxActiveProperty] = useState();

    useEffect(() => {
        if (!ctxActiveProperty && !sessionStorage.getItem("activePropertyId") && ctxAccessToken) {
            showToast("Please select a Property", "warning", 5000);
        }

        if (ctxActiveProperty) {
            sessionStorage.setItem("activePropertyId", JSON.stringify(ctxActiveProperty.id));
        }
    }, [ctxActiveProperty]);

    const fetcher = async (url) => {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${ctxAccessToken}`,
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    };

    const apiURL = "http://localhost:8000/api/properties/";
    const {
        data: ctxPropertyList,
        error,
        mutate,
    } = useSWRImmutable( ctxAccessToken ? [`${apiURL}`] : null, fetcher);

    useEffect(() => {
        if (ctxPropertyList) {
            const storedPropertyId = sessionStorage.getItem("activePropertyId");
            if (storedPropertyId) {
                const id = parseInt(storedPropertyId, 10);

                const foundProperty = ctxPropertyList.find((property) => property.id === id);

                if (foundProperty) {
                    setCtxActiveProperty(foundProperty);
                } else {
                    console.warn(`Stored property ID ${storedPropertyId} not found in fetched data.`);
                    sessionStorage.removeItem("activePropertyId");
                }
            }
        }
    }, [ctxPropertyList, setCtxActiveProperty]);

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
                showToast("Error adding Property", "error", 5000);
            } else {
                const newProperty = await response.json();
                mutate((prev) => (prev ? [...prev, newProperty] : [newProperty]), false);
                showToast("Property added", "success", 3000);
            }
        } catch (e) {
            console.error("Error:", e);
            showToast("Error adding Property", "error", 5000);
        }
    };

    const ctxUpdateProperty = async (updatedProperty) => {
        console.log(updatedProperty);
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
                const returnedProperty = await response.json();
                mutate(
                    (prevPropList) =>
                        prevPropList.map((property) =>
                            property.id === returnedProperty.id ? returnedProperty : property
                        ),
                    false
                );
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
        ctxAddProperty,
        ctxUpdateProperty,
    };

    return <PropertiesCtx.Provider value={context}>{props.children}</PropertiesCtx.Provider>;
}

export default PropertiesCtx;
