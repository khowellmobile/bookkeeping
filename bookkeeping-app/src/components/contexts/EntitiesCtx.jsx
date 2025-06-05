import { createContext, useEffect, useState, useContext } from "react";

import AuthCtx from "./AuthCtx";

const EntitiesCtx = createContext({
    ctxEntityList: null,
    setCtxEntityList: () => {},
    populateCtxEntities: () => {},
    ctxAddEntity: () => {},
    ctxUpdateEntity: () => {},
});

export function EntitiesCtxProvider(props) {
    const { ctxAccessToken } = useContext(AuthCtx);

    const [ctxEntityList, setCtxEntityList] = useState([]);

    useEffect(() => {
        populateCtxEntities();
    }, []);

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

    const ctxAddEntity = async (entityToAdd) => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/entities/", {
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
            console.error("Error sending Account Info:", error);
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

        setIsEditing(false);
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
