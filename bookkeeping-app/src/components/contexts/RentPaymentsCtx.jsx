import { createContext, useEffect, useState, useContext } from "react";
import { useToast } from "./ToastCtx";

import AuthCtx from "./AuthCtx";
import PropertiesCtx from "./PropertiesCtx";

const RentPaymentsCtx = createContext({
    ctxPaymentList: null,
    setCtxPaymentList: () => {},
    ctxMonthPaymentList: null,
    setCtxMonthPaymentList: () => {},
    ctxActiveDate: null,
    setCtxActiveDate: () => {},
    populateCtxPayments: () => {},
    getCtxPaymentsByMonth: () => {},
    ctxAddPayment: () => {},
    ctxUpdatePayment: () => {},
});

export function RentPaymentsCtxProvider(props) {
    const { showToast } = useToast();

    const { ctxAccessToken } = useContext(AuthCtx);
    const { ctxActiveProperty } = useContext(PropertiesCtx);

    const [ctxPaymentList, setCtxPaymentList] = useState([]);
    const [ctxMonthPaymentList, setCtxMonthPaymentList] = useState([]);
    const [ctxActiveDate, setCtxActiveDate] = useState(new Date());

    useEffect(() => {
        if (ctxAccessToken) {
            populateCtxPayments();
        }
    }, [ctxActiveProperty, ctxAccessToken]);

    useEffect(() => {
        getCtxPaymentsByMonth(ctxActiveDate.getMonth() + 1, ctxActiveDate.getFullYear());
    }, [ctxActiveProperty]);

    const populateCtxPayments = async () => {
        try {
            const url = new URL("http://localhost:8000/api/rentPayments/");
            if (ctxActiveProperty && ctxActiveProperty.id) {
                url.searchParams.append("property_id", ctxActiveProperty.id);
            } else {
                return;
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
            setCtxPaymentList(data);
        } catch (e) {
            console.log("Error: " + e);
        }
    };

    const getCtxPaymentsByMonth = async (month, year) => {
        try {
            const url = new URL("http://localhost:8000/api/rentPayments/");
            if (ctxActiveProperty && ctxActiveProperty.id) {
                url.searchParams.append("property_id", ctxActiveProperty.id);
            } else {
                return;
            }

            if (month && year) {
                url.searchParams.append("year", year);
                url.searchParams.append("month", month);
                url.searchParams.append("foramt_by_day", true);
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
            console.log("Error: " + e);
        }
    };

    const ctxAddPayment = async (paymentToAdd) => {
        try {
            const url = new URL("http://localhost:8000/api/rentPayments/");
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
                setCtxPaymentList((prev) => {
                    return [...prev, newPayment];
                });
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
            const response = await fetch(`http://localhost:8000/api/rentPayments/${updatedPayment.id}/`, {
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
                const returnedPayment = await response.json();
                setCtxPaymentList((prevPaymentList) => {
                    return prevPaymentList.map((payment) =>
                        payment.id === returnedPayment.id ? returnedPayment : payment
                    );
                });
                showToast("Payment updated", "success", 3000);
            }
        } catch (e) {
            console.log("Error: " + e);
            showToast("Error updating payment", "error", 5000);
        }
    };

    const context = {
        ctxPaymentList,
        setCtxPaymentList,
        ctxMonthPaymentList,
        setCtxMonthPaymentList,
        ctxActiveDate,
        setCtxActiveDate,
        populateCtxPayments,
        getCtxPaymentsByMonth,
        ctxAddPayment,
        ctxUpdatePayment,
    };

    return <RentPaymentsCtx.Provider value={context}>{props.children}</RentPaymentsCtx.Provider>;
}

export default RentPaymentsCtx;
