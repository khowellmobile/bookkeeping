import { useState, useContext, useMemo } from "react";

import classes from "./RentInformation.module.css";

import RentPaymentsCtx from "../../../contexts/RentPaymentsCtx";
import NoResultsDisplay from "../utilities/NoResultsDisplay";

const RentInformation = () => {
    const { ctxMonthPaymentList } = useContext(RentPaymentsCtx);

    const paymentList = useMemo(() => {
        return (ctxMonthPaymentList || []).flatMap((day) => day);
    }, [ctxMonthPaymentList]);

    return (
        <div className={classes.mainContainer}>
            <section className={classes.columnsNames}>
                <p>Paid On</p>
                <p>Paid By</p>
                <p>Amount</p>
            </section>
            <section className={classes.content}>
                {paymentList && paymentList.length > 0 ? (
                    paymentList.map((payment, index) => {
                        return (
                            <div className={classes.paymentItem} key={index}>
                                <p>{payment.date}</p>
                                <p>{payment?.entity?.name}</p>
                                <p>{payment.amount}</p>
                            </div>
                        );
                    })
                ) : (
                    <NoResultsDisplay mainText={"No Transactions to load."} guideText={""} />
                )}
            </section>
        </div>
    );
};

export default RentInformation;
