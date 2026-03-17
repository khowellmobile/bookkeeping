import { createContext, useEffect, useState, useContext } from "react";
import useSWRImmutable from "swr/immutable";

import { ApiError, api } from "../Client";
import { useToast } from "./ToastCtx";
import PropertiesCtx from "./PropertiesCtx";
import AuthCtx from "./AuthCtx";

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

    const currentMonth = ctxActiveDate.getMonth() + 1; // Month is 1-indexed for the API
    const currentYear = ctxActiveDate.getFullYear();

    // Dynamic SWR Key
    const swrKey =
        ctxActiveProperty && ctxActiveProperty.id && ctxAccessToken
            ? ["/api/rentPayments/", ctxActiveProperty.id, currentYear, currentMonth]
            : null;

    const { data: ctxMonthPaymentList, isLoading, mutate } = useSWRImmutable(
        swrKey,
        ([path, propertyId, year, month]) =>
            api.get(path, {
                query: {
                    property_id: propertyId,
                    year,
                    month,
                    format_by_day: true,
                },
            })
    );

    const ctxAddPayment = async (paymentToAdd) => {
        if (!ctxActiveProperty?.id) return;

        try {
            const transformedPayment = {
                ...paymentToAdd,
                entity_id: paymentToAdd.entity.id,
            };

            delete transformedPayment.entity;

            const newPymt = await api.post("/api/rentPayments/", transformedPayment, {
                query: { property_id: ctxActiveProperty.id },
            });

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
            if (error instanceof ApiError) {
                showToast("Error adding payment", "error", 5000);
            } else {
                showToast("Network error. Please try again.", "error", 5000);
            }
        }
    };

    const ctxUpdatePayment = async (updatedPayment) => {
        try {
            const updatedData = await api.put(`/api/rentPayments/${updatedPayment.id}/`, updatedPayment);
            mutate((prev) => prev.map((pymt) => (pymt.id === updatedData.id ? updatedData : pymt)), false);
            showToast("Payment updated", "success", 3000);
        } catch (error) {
            if (error instanceof ApiError) {
                showToast("Error updating payment", "error", 5000);
            } else {
                showToast("Network error. Please try again.", "error", 5000);
            }
        }
    };

    const ctxGetMonthlySummary = async (month, year) => {
        if (!ctxActiveProperty?.id) return;

        try {
            if (month && year && month >= 1 && month <= 12) {
                return await api.get("/api/rentPayments/monthsummary/", {
                    query: {
                        property_id: ctxActiveProperty.id,
                        month,
                        year,
                    },
                });
            } else {
                console.error("Invalid month or year for monthly summary");
                return;
            }
        } catch (error) {
            if (error instanceof ApiError) {
                showToast("Error getting summary", "error", 5000);
            } else {
                showToast("Network error. Please try again.", "error", 5000);
            }
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
