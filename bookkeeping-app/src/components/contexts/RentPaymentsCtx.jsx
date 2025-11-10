import { createContext, useEffect, useState, useContext, useRef } from "react";
import useSWRImmutable from "swr/immutable";

import { BASE_URL } from "../../constants";
import { useToast } from "./ToastCtx";
import AuthCtx from "./AuthCtx";
import PropertiesCtx from "./PropertiesCtx";

const RentPaymentsCtx = createContext({
    ctxPaymentList: null,
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

    // propertyId is to trigger fetch if property changes
    const prevDateRef = useRef({ month: null, year: null, propertyId: null });

    const [ctxMonthPaymentList, setCtxMonthPaymentList] = useState([]);
    const [ctxActiveDate, setCtxActiveDate] = useState(getInitialDate());

    useEffect(() => {
        if (!ctxActiveProperty || !ctxAccessToken) {
            return;
        }

        const currentMonth = ctxActiveDate.getMonth();
        const currentYear = ctxActiveDate.getFullYear();

        if (
            prevDateRef.current.month !== currentMonth ||
            prevDateRef.current.year !== currentYear ||
            prevDateRef.current.propertyId !== ctxActiveProperty.id
        ) {
            getCtxPaymentsByMonth(currentMonth + 1, currentYear);
        }

        prevDateRef.current = { month: currentMonth, year: currentYear };
        sessionStorage.setItem("activeDate", JSON.stringify(ctxActiveDate));
    }, [ctxActiveProperty, ctxActiveDate, ctxAccessToken]);

    const baseUrl = BASE_URL;

    const getCtxPaymentsByMonth = async (month, year) => {
        try {
            const url = new URL(`${baseUrl}/api/rentPayments/`);
            if (ctxActiveProperty && ctxActiveProperty.id) {
                url.searchParams.append("property_id", ctxActiveProperty.id);
            } else {
                return;
            }

            if (month && year) {
                url.searchParams.append("year", year);
                url.searchParams.append("month", month);
                url.searchParams.append("format_by_day", true);
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
            setCtxMonthPaymentList(data);
        } catch (e) {
            console.log(e.toString());
        }
    };

    const ctxAddPayment = async (paymentToAdd) => {
        try {
            const url = new URL(`${baseUrl}/api/rentPayments/`);
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
                const newPayment = await response.json();
                showToast("Payment added", "success", 3000);
                return newPayment;
            }
        } catch (error) {
            console.error("Error:", error);
            showToast("Error adding payment", "error", 5000);
        }
    };

    const ctxUpdatePayment = async (updatedPayment) => {
        try {
            const response = await fetch(`${baseUrl}/api/rentPayments/${updatedPayment.id}/`, {
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
            }
        } catch (e) {
            console.log("Error: " + e);
            showToast("Error updating payment", "error", 5000);
        }
    };

    const context = {
        ctxMonthPaymentList,
        setCtxMonthPaymentList,
        ctxActiveDate,
        setCtxActiveDate,
        getCtxPaymentsByMonth,
        ctxAddPayment,
        ctxUpdatePayment,
    };

    return <RentPaymentsCtx.Provider value={context}>{props.children}</RentPaymentsCtx.Provider>;
}

export default RentPaymentsCtx;
