import { createContext, useEffect, useState, useContext } from "react";
import useSWRImmutable from "swr/immutable";

import { BASE_URL } from "../../constants";
import { useToast } from "./ToastCtx";
import AuthCtx from "./AuthCtx";
import PropertiesCtx from "./PropertiesCtx";

const RentPaymentsCtx = createContext({
    ctxMonthPaymentList: null,
    setCtxMonthPaymentList: () => {},
    ctxActiveDate: null,
    setCtxActiveDate: () => {},
    getCtxPaymentsByMonth: () => {},
    ctxAddPayment: () => {},
    ctxUpdatePayment: () => {},
    ctxGetMonthlySummary: () => {},
    isLoading: null,
});

const getInitialDate = () => {
    const storedDate = sessionStorage.getItem("activeDate");
    return storedDate ? new Date(JSON.parse(storedDate)) : new Date();
};

export function RentPaymentsCtxProvider(props) {
    const { showToast } = useToast();

    const { ctxAccessToken } = useContext(AuthCtx);
    const { ctxActiveProperty } = useContext(PropertiesCtx);

    const [ctxActiveDate, setCtxActiveDate] = useState(getInitialDate());

    useEffect(() => {
        sessionStorage.setItem("activeDate", JSON.stringify(ctxActiveDate));
    }, [ctxActiveDate]);

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

    const currentMonth = ctxActiveDate.getMonth() + 1; // Month is 1-indexed for the API
    const currentYear = ctxActiveDate.getFullYear();
    const basePath = `${BASE_URL}/api/rentPayments/`;

    // Dynamic SWR Key
    const swrKey =
        ctxActiveProperty && ctxActiveProperty.id && ctxAccessToken
            ? `${basePath}?property_id=${ctxActiveProperty.id}&year=${currentYear}&month=${currentMonth}&format_by_day=true`
            : null;

    const { data: ctxMonthPaymentList, isLoading, error, mutate } = useSWRImmutable(swrKey, fetcher);

    const ctxAddPayment = async (paymentToAdd) => {
        try {
            const url = new URL(`${BASE_URL}/api/rentPayments/`);
            if (ctxActiveProperty && ctxActiveProperty.id) {
                url.searchParams.append("property_id", ctxActiveProperty.id);
            }

            const transformedPayment = {
                ...paymentToAdd,
                entity_id: paymentToAdd.entity.id,
            };

            delete transformedPayment.entity;

            const response = await fetch(url.toString(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ctxAccessToken}`,
                },
                body: JSON.stringify(transformedPayment),
            });

            if (!response.ok) {
                throw new Error(`HTTP error. Status: ${response.status}`);
            }

            const newPymt = await response.json();

            mutate((prev) => {
                let newPymtList = [...prev];

                const targetIndex = new Date(newPymt.date).getUTCDate() - 1;

                if (!newPymtList[targetIndex]) {
                    newPymtList[targetIndex] = [];
                }

                newPymtList[targetIndex] = [...newPymtList[targetIndex], newPymt];

                return newPymtList;
            }, false);
            showToast("Payment added", "success", 3000);
        } catch (error) {
            console.error("Error:", error);
            showToast("Error adding payment", "error", 5000);
        }
    };

    const ctxUpdatePayment = async (updatedPayment) => {
        try {
            const response = await fetch(`${BASE_URL}/api/rentPayments/${updatedPayment.id}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ctxAccessToken}`,
                },
                body: JSON.stringify(updatedPayment),
            });

            if (!response.ok) {
                throw new Error(`HTTP error. Status: ${response.status}`);
            }

            const updatedData = await response.json();
            mutate((prev) => prev.map((pymt) => (pymt.id === updatedData.id ? updatedData : pymt)), false);
            showToast("Payment updated", "success", 3000);
        } catch (e) {
            console.log("Error: " + e);
            showToast("Error updating payment", "error", 5000);
        }
    };

    const ctxGetMonthlySummary = async (month, year) => {
        try {
            const url = new URL(`${BASE_URL}/api/rentPayments/monthsummary/`);
            if (ctxActiveProperty && ctxActiveProperty.id) {
                url.searchParams.append("property_id", ctxActiveProperty.id);
            } else {
                console.log("no active property");
                return;
            }

            if (month && year && month >= 1 && month <= 12) {
                url.searchParams.append("month", month);
                url.searchParams.append("year", year);
            } else {
                console.error("Invalid month or year for monthly summary");
                return;
            }

            const response = await fetch(url.toString(), {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ctxAccessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error. Status: ${response.status}`);
            }

            const monthSummary = await response.json();
            return monthSummary;
        } catch (e) {
            console.log("Error: " + e);
            showToast("Error getting summary", "error", 5000);
        }
    };

    const context = {
        ctxMonthPaymentList,
        ctxActiveDate,
        setCtxActiveDate,
        ctxAddPayment,
        ctxUpdatePayment,
        ctxGetMonthlySummary,
        isLoading,
    };

    return <RentPaymentsCtx.Provider value={context}>{props.children}</RentPaymentsCtx.Provider>;
}

export default RentPaymentsCtx;
