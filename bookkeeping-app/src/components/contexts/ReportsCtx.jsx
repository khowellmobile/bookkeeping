import { createContext, useState, useContext, useEffect } from "react";

import { BASE_URL } from "../../constants";
import AuthCtx from "./AuthCtx";
import PropertiesCtx from "./PropertiesCtx";

const ReportsCtx = createContext({
    ctxReportHistoryList: null,
    ctxActiveEntity: null,
    ctxAddReport: () => {},
});

export function ReportsCtxProvider(props) {
    const { ctxAccessToken } = useContext(AuthCtx);
    const { ctxActiveProperty } = useContext(PropertiesCtx);

    const [ctxReportHistoryList, setCtxReportHistoryList] = useState();

    const ctxAddReport = async (reportToAdd) => {
        try {
            const url = new URL(`${BASE_URL}/api/reports/`);
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

    const context = {
        ctxEntityList,
        ctxActiveEntity,
        ctxAddReport
    };

    return <ReportsCtx.Provider value={context}>{props.children}</ReportsCtx.Provider>;
}

export default ReportsCtx;
