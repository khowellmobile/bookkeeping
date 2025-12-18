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

import { useReportAPI } from "../../../hooks/useReportApi.jsx";

const ReportListing = () => {
    const { reportsData, isLoading, Error } = useReportAPI();

    const reportTypesMapping = {
        profit_loss: "Profit & Loss",
        balance_sheet: "Balance Sheet",
        year_to_date: "Year to Date",
        all_time: "All Time",
        custom: "Custom",
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const parts = dateString.split("-");
        if (parts.length === 3) {
            const [year, month, day] = parts;
            return `${day}/${month}/${year}`;
        }
        return dateString;
    };

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
                {reportsData ?
                    reportsData.map((report, index) => {
                        return (
                            <ReportListItem
                                name={reportTypesMapping[report.type]}
                                range={`${formatDate(report.start_date)}-${formatDate(report.end_date)}`}
                                date={formatDate(report.report_ran_on_date)}
                                key={index}
                            />
                        );
                    }) :
                    <NoResultsDisplay mainText={"No report history to load."} guideText={"Have you chosen a Property?"} /> }
            </section>
        </div>
    );
};

export { AccountListing, PropertyListing, ReportListing };
