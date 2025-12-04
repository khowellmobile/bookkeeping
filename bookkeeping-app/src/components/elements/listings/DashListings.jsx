import { useContext } from "react";

import classes from "./DashListings.module.css";

import AccountsCtx from "../../contexts/AccountsCtx.jsx";
import PropertiesCtx from "../../contexts/PropertiesCtx.jsx";
import { AccountListItem, PropertyListItem, ReportListItem } from "../items/DashListItems.jsx";
import NoResultsDisplay from "../utilities/NoResultsDisplay.jsx";

const AccountListing = () => {
    const { ctxAccountList } = useContext(AccountsCtx);

    return (
        <div className={classes.mainContainer}>
            <section className={classes.header}>
                <h2>Chart of Accounts</h2>
            </section>
            <section className={classes.columnNames}>
                <div>
                    <p>Name</p>
                </div>
                <div>
                    <p>Type</p>
                </div>
                <div>
                    <p>Balance</p>
                </div>
            </section>
            <section className={classes.items}>
                {ctxAccountList ? (
                    ctxAccountList.map((account, index) => {
                        return <AccountListItem key={index} account={account} />;
                    })
                ) : (
                    <NoResultsDisplay mainText={"No Accounts to load."} guideText={"Have you chosen a Property?"} />
                )}
            </section>
        </div>
    );
};

const PropertyListing = () => {
    const { ctxPropertyList } = useContext(PropertiesCtx);

    return (
        <div className={classes.mainContainer}>
            <section className={classes.header}>
                <h2>Properties</h2>
            </section>
            <section className={classes.columnNames}>
                <div>
                    <p>Address</p>
                </div>
                <div>
                    <p>Rent</p>
                </div>
                <div>
                    <p>Rent Due</p>
                </div>
            </section>
            <section className={classes.items}>
                {ctxPropertyList && ctxPropertyList.length > 0 ? (
                    ctxPropertyList.map((property, index) => {
                        return <PropertyListItem vals={property} key={index} />;
                    })
                ) : (
                    <p>No Properties Found</p>
                )}
            </section>
        </div>
    );
};

const ReportListing = () => {
    return (
        <div className={classes.mainContainer}>
            <section className={classes.header}>
                <h2>Reports</h2>
            </section>
            <section className={classes.columnNames}>
                <div>
                    <p>Name</p>
                </div>
                <div>
                    <p>Range</p>
                </div>
                <div>
                    <p>Ran On</p>
                </div>
            </section>
            <section className={classes.items}>
                <ReportListItem name="Profit & Loss" range="1/1/25-3/31/25" date="4/5/25" />
                <ReportListItem name="Balance Sheet" range="1/1/25-3/31/25" date="4/7/25" />
                <ReportListItem name="Cash Flow Statement" range="2/1/25-3/31/25" date="4/10/25" />
                <ReportListItem name="Profit & Loss" range="4/1/25-6/30/25" date="7/5/25" />
                <ReportListItem name="Tax Summary" range="1/1/25-4/1/25" date="4/12/25" />
                <ReportListItem name="Balance Sheet" range="4/1/25-6/30/25" date="7/10/25" />
                <ReportListItem name="Profit & Loss" range="5/1/25-7/31/25" date="8/5/25" />
                <ReportListItem name="Cash Flow Statement" range="3/1/25-5/31/25" date="6/5/25" />
                <ReportListItem name="Tax Summary" range="2/1/25-4/30/25" date="5/1/25" />
                <ReportListItem name="Balance Sheet" range="7/1/25-9/30/25" date="10/5/25" />
            </section>
        </div>
    );
};

export { AccountListing, PropertyListing, ReportListing };
