import { useContext, useState, useEffect } from "react";

import AuthCtx from "../components/contexts/AuthCtx.jsx";
import PropertiesCtx from "../components/contexts/PropertiesCtx.jsx";
import { BASE_URL } from "../constants.jsx";

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
                const url = new URL(`${BASE_URL}/api/reports/`);
                if (ctxActiveProperty && ctxActiveProperty.id) {
                    url.searchParams.append("property_id", ctxActiveProperty.id);
                }

                const response = await fetch(url.toString(), {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${ctxAccessToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
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
                body: JSON.stringify(sendReport),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData);
            } else {
                const newReport = await response.json();
                setReportsData((prev) => [...prev, newReport]);
            }
        } catch (error) {
            console.error("Error saving report:", error);
        }
    };

    return { reportsData, addReport, isLoading, error };
};

export { useReportAPI };
