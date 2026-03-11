import { useContext, useState, useEffect } from "react";

import PropertiesCtx from "../components/contexts/PropertiesCtx.jsx";
import AuthCtx from "../components/contexts/AuthCtx.jsx";
import { api } from "../Client";

const useReportAPI = () => {
    // Get the token from the context
    const { ctxAccessToken } = useContext(AuthCtx);
    const { ctxActiveProperty } = useContext(PropertiesCtx);

    const [reportsData, setReportsData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!ctxAccessToken || !ctxActiveProperty) return;

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const result = await api.get("/api/reports/", {
                    query: {
                        property_id: ctxActiveProperty?.id,
                    },
                });
                setReportsData(result);
            } catch (e) {
                setError(e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [ctxAccessToken, ctxActiveProperty]);

    const addReport = async (reportToAdd) => {
        const reportTypesMapping = {
            profit_loss: "Profit & Loss",
            balance_sheet: "Balance Sheet",
            year_to_date: "Year to Date",
            all_time: "All Time",
            custom: "Custom",
        };

        const sendReport = { ...reportToAdd, report_range_type: reportTypesMapping[reportToAdd.report_range_type] };

        try {
            const newReport = await api.post("/api/reports/", sendReport, {
                query: {
                    property_id: ctxActiveProperty?.id,
                },
            });
            setReportsData((prev) => [...(prev || []), newReport]);
        } catch (error) {
            console.error("Error saving report:", error);
        }
    };

    return { reportsData, addReport, isLoading, error };
};

export { useReportAPI };
