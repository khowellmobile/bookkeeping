import { createContext, useEffect, useState, useContext } from "react";

import AuthCtx from "./AuthCtx";
import PropertiesCtx from "./PropertiesCtx";

const RentPaymentsCtx = createContext({
    ctxPaymentList: null,
    setCtxPaymentList: () => {},
    populateCtxPayments: () => {},
    getCtxPaymentsByMonth: () => {},
    ctxAddPayment: () => {},
    ctxUpdatePayment: () => {},
});

export function RentPaymentsCtxProvider(props) {
    const { ctxAccessToken } = useContext(AuthCtx);
    const { ctxActiveProperty } = useContext(PropertiesCtx);

    const [ctxPaymentList, setCtxPaymentList] = useState([]);

    useEffect(() => {
        if (ctxAccessToken) {
            populateCtxPayments();
        }
    }, [ctxActiveProperty, ctxAccessToken]);

    const populateCtxPayments = async () => {
        try {
            const url = new URL("http://localhost:8000/api/rentPayments/");
            if (ctxActiveProperty && ctxActiveProperty.id) {
                url.searchParams.append("property_id", ctxActiveProperty.id);
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
            return data;
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

            const response = await fetch(url.toString(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ctxAccessToken}`,
                },
                body: JSON.stringify(paymentToAdd),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Backend Error:", errorData);
            } else {
                const newPayment = await response.json();
                setCtxPaymentList((prev) => {
                    return [...prev, newPayment];
                });
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const ctxUpdatePayment = async (updatedPayment) => {
        try {
            const response = await fetch(`http://localhost:8000/api/entities/${updatedPayment.id}/`, {
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
            }
        } catch (e) {
            console.log("Error: " + e);
        }
    };

    const context = {
        ctxPaymentList,
        setCtxPaymentList,
        populateCtxPayments,
        getCtxPaymentsByMonth,
        ctxAddPayment,
        ctxUpdatePayment,
    };

    return <RentPaymentsCtx.Provider value={context}>{props.children}</RentPaymentsCtx.Provider>;
}

export default RentPaymentsCtx;
