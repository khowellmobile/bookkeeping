import { useState, useContext, useEffect } from "react";

import classes from "./RentsPage.module.css";

import RentPaymentsCtx from "../components/contexts/RentPaymentsCtx";
import chevUpIcon from "../assets/chevron-up-icon.svg";
import chevDownIcon from "../assets/chevron-down-icon.svg";

import AddRentModal from "../components/elements/modals/AddRentModal";

const RentsPage = () => {
    const { ctxPaymentList } = useContext(RentPaymentsCtx);

    const [isModalOpen, setIsModalOpen] = useState(true);

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            {isModalOpen && <AddRentModal handleCloseModal={handleCloseModal} />}

            <div className={classes.mainContainer}>
                <button onClick={() => setIsModalOpen(true)}>Add Payment</button>
                <div className={classes.monthlyRents}>
                    <span>
                        <h2>June 2025 Rents</h2>
                        <img className={classes.icon} src={chevDownIcon} alt="Icon" />
                    </span>
                    <section className={classes.totalsListing}>
                        <div className={classes.rentCard}>
                            <p>Due</p>
                            <div>
                                <p>$1500</p>
                                <p>1 Transactions</p>
                            </div>
                        </div>
                        <div className={classes.rentCard}>
                            <p>Scheduled</p>
                            <div>
                                <p>$3500</p>
                                <p>3 Transactions</p>
                            </div>
                        </div>
                        <div className={classes.rentCard}>
                            <p>Paid</p>
                            <div>
                                <p>$4500</p>
                                <p>7 Transactions</p>
                            </div>
                        </div>
                    </section>
                    <section className={classes.listings}>
                        <section className={`${classes.rentListing} ${classes.rentsDue}`}>
                            <div className={classes.header}>
                                <p>Due</p>
                                <img className={classes.icon} src={chevDownIcon} alt="Icon" />
                            </div>
                            <div className={classes.columnNames}>
                                <p>Due Date</p>
                                <p>Status</p>
                                <p>Description</p>
                                <p>Amount</p>
                            </div>
                            <div className={classes.rentList}>
                                {ctxPaymentList && ctxPaymentList.length > 0 ? (
                                    ctxPaymentList.map((pymt, index) => {
                                        return (
                                            <div className={classes.rentItem} key={index}>
                                                <p>{pymt.date}</p>
                                                <p>{pymt.status}</p>
                                                <p>{pymt.amount}</p>
                                                <p>{pymt.amount}</p>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p>No Payments</p>
                                )}
                            </div>
                        </section>
                        <section className={`${classes.rentListing} ${classes.rentsScheduled}`}>
                            <div className={classes.header}>
                                <p>Scheduled</p>
                                <img className={classes.icon} src={chevDownIcon} alt="Icon" />
                            </div>
                            <div className={classes.columnNames}>
                                <p>Due Date</p>
                                <p>Status</p>
                                <p>Description</p>
                                <p>Amount</p>
                            </div>
                            <div className={classes.rentList}>
                                {ctxPaymentList && ctxPaymentList.length > 0 ? (
                                    ctxPaymentList.map((pymt, index) => {
                                        return (
                                            <div className={classes.rentItem} key={index}>
                                                <p>{pymt.date}</p>
                                                <p>{pymt.status}</p>
                                                <p>{pymt.amount}</p>
                                                <p>{pymt.amount}</p>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p>No Payments</p>
                                )}
                            </div>
                        </section>
                        <section className={`${classes.rentListing} ${classes.rentsPaid}`}>
                            <div className={classes.header}>
                                <p>Paid</p>
                                <img className={classes.icon} src={chevDownIcon} alt="Icon" />
                            </div>
                            <div className={classes.columnNames}>
                                <p>Due Date</p>
                                <p>Status</p>
                                <p>Description</p>
                                <p>Amount</p>
                            </div>
                            <div className={classes.rentList}>
                                {ctxPaymentList && ctxPaymentList.length > 0 ? (
                                    ctxPaymentList.map((pymt, index) => {
                                        return (
                                            <div className={classes.rentItem} key={index}>
                                                <p>{pymt.date}</p>
                                                <p>{pymt.status}</p>
                                                <p>{pymt.amount}</p>
                                                <p>{pymt.amount}</p>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p>No Payments</p>
                                )}
                            </div>
                        </section>
                    </section>
                </div>
            </div>
        </>
    );
};

export default RentsPage;
