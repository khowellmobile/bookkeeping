import { useContext, useState, useEffect } from "react";

import AuthCtx from "../components/contexts/AuthCtx";
import { BASE_URL } from "../constants";

const useReportAPI = () => {
    // Get the token from the context
    const { ctxAccessToken } = useContext(AuthCtx);

    const [reportsData, setReportsData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const URL = `${BASE_URL}/api/reports/`;

    useEffect(() => {
        if (!ctxAccessToken) return;

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(URL.toString(), {
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
    }, [ctxAccessToken]);

    return { reportsData, isLoading, error };
};

export { useReportAPI };
