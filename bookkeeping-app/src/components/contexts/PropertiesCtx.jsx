import { createContext, useState, useEffect, useContext } from "react";
import useSWRImmutable from "swr/immutable";

import { ApiError, api } from "../../Client";
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

    const { data: ctxPropertyList, mutate } = useSWRImmutable(ctxAccessToken ? "/api/properties/" : null, (path) =>
        api.get(path),
    );

    // Checking if stored property is in current property list.
    // Protects against setting an active property for a different users property list.
    useEffect(() => {
        if (!ctxPropertyList) return;

        const storedPropertyId = sessionStorage.getItem("activePropertyId");
        if (!storedPropertyId) return;

        const foundProperty = ctxPropertyList.find((property) => property.id === storedPropertyId);

        if (foundProperty) {
            if (ctxActiveProperty?.id !== foundProperty.id) {
                setCtxActiveProperty(foundProperty);
            } else {
                console.warn(`Stored property ID ${storedPropertyId} not found in fetched data.`);
                sessionStorage.removeItem("activePropertyId");
            }
        }
    }, [ctxPropertyList, setCtxActiveProperty]);

    const ctxAddProperty = async (propertyToAdd) => {
        try {
            const newProperty = await api.post("/api/properties/", propertyToAdd);
            mutate((prev) => (prev ? [...prev, newProperty] : [newProperty]), false);
            showToast("Property added", "success", 3000);
        } catch (error) {
            if (error instanceof ApiError) {
                showToast("Error adding Property", "error", 5000);
            } else {
                showToast("Network error. Please try again.", "error", 5000);
            }
        }
    };

    const ctxUpdateProperty = async (updatedProperty) => {
        try {
            const returnedProperty = await api.put(`/api/properties/${updatedProperty.id}/`, updatedProperty);
            mutate(
                (prevPropList) =>
                    prevPropList.map((property) => (property.id === returnedProperty.id ? returnedProperty : property)),
                false,
            );
            showToast("Property updated", "success", 3000);
        } catch (error) {
            if (error instanceof ApiError) {
                showToast("Error updating Property", "error", 5000);
            } else {
                showToast("Network error. Please try again.", "error", 5000);
            }
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
