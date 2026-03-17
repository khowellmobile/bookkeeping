import { createContext, useState, useContext, useEffect } from "react";
import useSWRImmutable from "swr/immutable";

import { useToast } from "./ToastCtx";
import { ApiError, api } from "../Client";
import PropertiesCtx from "./PropertiesCtx";
import AuthCtx from "./AuthCtx";

const EntitiesCtx = createContext({
    ctxEntityList: null,
    ctxActiveEntity: null,
    setCtxActiveEntity: () => {},
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

    const propertyId = ctxActiveProperty?.id;
    const { data: ctxEntityList, mutate } = useSWRImmutable(
        propertyId && ctxAccessToken ? ["/api/entities/", propertyId] : null,
        ([path, id]) => api.get(path, { query: { property_id: id } })
    );

    const ctxAddEntity = async (entityToAdd) => {
        try {
            const newEntity = await api.post("/api/entities/", entityToAdd, {
                query: { property_id: ctxActiveProperty?.id },
            });

            mutate((prev) => (prev ? [...prev, newEntity] : [newEntity]), false);
            showToast("Entity added", "success", 3000);
        } catch (error) {
            if (error instanceof ApiError) {
                if (error.status === 400 || error.status === 422) {
                    showToast("Invalid entity data", "error", 5000);
                } else if (error.status === 401) {
                    showToast("Session expired. Please log in again.", "error", 5000);
                } else {
                    showToast("Error adding entity", "error", 5000);
                }
            } else {
                showToast("Network error. Please try again.", "error", 5000);
            }
        }
    };

    const ctxUpdateEntity = async (updatedEntity) => {
        try {
            const returnedEntity = await api.put(`/api/entities/${updatedEntity.id}/`, updatedEntity);

            mutate((prevEntityList) => {
                if (!prevEntityList) return [];
                return prevEntityList.map((entity) => (entity.id === returnedEntity.id ? returnedEntity : entity));
            }, false);
            showToast("Entity updated", "success", 3000);
        } catch (error) {
            if (error instanceof ApiError) {
                if (error.status === 400 || error.status === 422) {
                    showToast("Invalid entity data", "error", 5000);
                } else if (error.status === 401) {
                    showToast("Session expired. Please log in again.", "error", 5000);
                    // Log user out here?
                } else {
                    showToast("Error updating entity", "error", 5000);
                }
            } else {
                showToast("Network error. Please try again.", "error", 5000);
            }
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
