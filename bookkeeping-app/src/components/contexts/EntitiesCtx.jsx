import { createContext, useEffect, useState, useContext } from "react";

import AuthCtx from "./AuthCtx";
import PropertiesCtx from "./PropertiesCtx";

const EntitiesCtx = createContext({
    ctxEntityList: null,
    setCtxEntityList: () => {},
    populateCtxEntities: () => {},
    ctxAddEntity: () => {},
    ctxUpdateEntity: () => {},
});

export function EntitiesCtxProvider(props) {
    const { ctxAccessToken } = useContext(AuthCtx);
    const { ctxActiveProperty } = useContext(PropertiesCtx);

    const [ctxEntityList, setCtxEntityList] = useState([]);

    useEffect(() => {
        if (ctxAccessToken) {
            populateCtxEntities();
        }
    }, [ctxActiveProperty]);

    const populateCtxEntities = async () => {
        try {
            const url = new URL("http://localhost:8000/api/entities/");
            if (ctxActiveProperty && ctxActiveProperty.id) {
                url.searchParams.append("property_id", ctxActiveProperty.id);
            }

            const response = await fetch(url.toString(), {
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

    const ctxAddEntity = async (entityToAdd) => {
        try {
            const url = new URL("http://localhost:8000/api/entities/");
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
            } else {
                const newEntity = await response.json();
                setCtxEntityList((prev) => {
                    return [...prev, newEntity];
                });
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const ctxUpdateEntity = async (updatedEntity) => {
        try {
            const response = await fetch(`http://localhost:8000/api/entities/${updatedEntity.id}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ctxAccessToken}`,
                },
                body: JSON.stringify(updatedEntity),
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
        ctxEntityList,
        setCtxEntityList,
        populateCtxEntities,
        ctxAddEntity,
        ctxUpdateEntity,
    };

    return <EntitiesCtx.Provider value={context}>{props.children}</EntitiesCtx.Provider>;
}

export default EntitiesCtx;
