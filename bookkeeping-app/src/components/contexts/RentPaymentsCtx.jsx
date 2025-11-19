import { createContext, useEffect, useState, useContext, useRef } from "react";
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

    const { data: ctxMonthPaymentList, error, mutate } = useSWRImmutable(swrKey, fetcher);

    useEffect(() => {
        console.log(ctxMonthPaymentList);
    }, [ctxMonthPaymentList]);

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
                const errorData = await response.json();
                console.error("Backend Error:", errorData);
                showToast("Error adding payment", "error", 5000);
            } else {
                mutate();
                showToast("Payment added", "success", 3000);
            }
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
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                showToast("Payment updated", "success", 3000);
                mutate();
            }
        } catch (e) {
            console.log("Error: " + e);
            showToast("Error updating payment", "error", 5000);
        }
    };

    const context = {
        ctxMonthPaymentList,
        ctxActiveDate,
        setCtxActiveDate,
        ctxAddPayment,
        ctxUpdatePayment,
    };

    return <RentPaymentsCtx.Provider value={context}>{props.children}</RentPaymentsCtx.Provider>;
}

export default RentPaymentsCtx;
