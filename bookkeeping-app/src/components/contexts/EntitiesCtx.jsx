import { createContext, useState, useContext, useEffect } from "react";
import useSWRImmutable from "swr/immutable";

import { BASE_URL } from "../../constants";
import { useToast } from "./ToastCtx";
import AuthCtx from "./AuthCtx";
import PropertiesCtx from "./PropertiesCtx";

const EntitiesCtx = createContext({
    ctxEntityList: null,
    setCtxEntityList: () => {},
    ctxActiveEntity: null,
    setCtxActiveEntity: () => {},
    populateCtxEntities: () => {},
    ctxAddEntity: () => {},
    ctxUpdateEntity: () => {},
});

export function EntitiesCtxProvider(props) {
    const { showToast } = useToast();

    const { ctxAccessToken } = useContext(AuthCtx);
    const { ctxActiveProperty } = useContext(PropertiesCtx);

    const [ctxActiveEntity, setCtxActiveEntity] = useState();

    // Clears active entity on property change
    useEffect(() => {
        if (ctxActiveEntity) setCtxActiveEntity(null);
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

    const baseUrl = BASE_URL;
    const apiURL = `${baseUrl}/api/entities/`;
    const propertyId = ctxActiveProperty?.id;
    const {
        data: ctxEntityList,
        error,
        mutate,
    } = useSWRImmutable(propertyId && ctxAccessToken ? [`${apiURL}?property_id=${propertyId}`] : null, fetcher);

    const ctxAddEntity = async (entityToAdd) => {
        try {
            const url = new URL(`${baseUrl}/api/entities/`);
            if (ctxActiveProperty && ctxActiveProperty.id) {
                url.searchParams.append("property_id", ctxActiveProperty.id);
            }

            const response = await fetch(url.toString(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ctxAccessToken}`,
                },
                body: JSON.stringify(entityToAdd),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Backend Error:", errorData);
                showToast("Error adding entity", "error", 5000);
            } else {
                const newEntity = await response.json();
                mutate((prev) => (prev ? [...prev, newEntity] : [newEntity]), false);
                showToast("Entity added", "success", 3000);
            }
        } catch (error) {
            console.error("Error:", error);
            showToast("Error adding entity", "error", 5000);
        }
    };

    const ctxUpdateEntity = async (updatedEntity) => {
        try {
            const response = await fetch(`${baseUrl}/api/entities/${updatedEntity.id}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ctxAccessToken}`,
                },
                body: JSON.stringify(updatedEntity),
            });

            if (!response.ok) {
                throw new Error(`HTTP error. Status: ${response.status}`);
            } else {
                const returnedEntity = await response.json();
                mutate((prevEntityList) => {
                    if (!prevEntityList) return [];
                    return prevEntityList.map((entity) => (entity.id === returnedEntity.id ? returnedEntity : entity));
                }, false);
                showToast("Entity updated", "success", 3000);
            }
        } catch (e) {
            console.log("Error: " + e);
            showToast("Error updating entity", "error", 5000);
        }
    };

    const context = {
        ctxEntityList,
        ctxActiveEntity,
        setCtxActiveEntity,
        ctxAddEntity,
        ctxUpdateEntity,
    };

    return <EntitiesCtx.Provider value={context}>{props.children}</EntitiesCtx.Provider>;
}

export default EntitiesCtx;
