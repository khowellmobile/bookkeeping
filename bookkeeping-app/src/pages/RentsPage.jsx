import { useState, useContext } from "react";

import classes from "./RentsPage.module.css";

import RentPaymentsCtx from "../components/contexts/RentPaymentsCtx";
import chevUpIcon from "../assets/chevron-up-icon.svg";
import chevDownIcon from "../assets/chevron-down-icon.svg";

const RentsPage = () => {
    const { ctxPaymentList } = useContext(RentPaymentsCtx);

    return (
        <div className={classes.mainContainer}>
            <div className={classes.editRents}>
                <h3>Add Payment</h3>
                <div className={classes.inputs}>
                    <div className={`${classes.cluster}`}>
                        <p>Address:</p>
                        <input type="text" name="amount" />
                    </div>
                </div>
                <div className={classes.inputs}>
                    <div className={`${classes.cluster}`}>
                        <p>Paid on:</p>
                        <input type="text" name="date" />
                    </div>
                </div>
                <div className={classes.inputs}>
                    <div className={`${classes.cluster}`}>
                        <p>Description:</p>
                        <input type="text" name="description" />
                    </div>
                </div>
                <div className={classes.radioCluster}>
                    <p>Toggle for monthly recurring here. On yes it opens the scheduler dropdown?</p>
                </div>
            </div>
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
    );
};

export default RentsPage;
