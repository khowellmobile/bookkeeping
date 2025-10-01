import classes from "./ReportsPage.module.css";

import AccountsCtx from "../components/contexts/AccountsCtx";
import PrintIcon from "../assets/print-icon.svg";
import ArrowLeftIcon from "../assets/arrow-left-icon.svg";
import ArrowRightIcon from "../assets/arrow-right-icon.svg";
import upChevIcon from "../assets/chevron-up-icon.svg";
import downChevIcon from "../assets/chevron-down-icon.svg";

import { useContext, useEffect, useState } from "react";
import BalanceSheet from "../components/elements/reports/BalanceSheet";
import ProfitLoss from "../components/elements/reports/ProfitLoss";

const ReportsPage = () => {
    const { ctxAccountList } = useContext(AccountsCtx);

    const [reportType, setReportType] = useState("profitloss");
    const [reportRangeType, setReportRangeType] = useState("Custom");
    const [dateRange, setDateRange] = useState({
        startDate: "",
        endDate: "",
    });
    const [isExpanded, setIsExpanded] = useState(false);
    const [historyOpen, setHistoryOpen] = useState(true);
    const [reportHistory, setJournalHistory] = useState([
        ["2024-01-24", "Revenue Adjustment"],
        ["2023-11-10", "Payroll Entry"],
        ["2024-02-15", "Equity Balancing"],
        ["2023-09-05", "JRE #4"],
        ["2024-01-05", "Clear Income Stmt"],
        ["2024-01-05", "Adjustment #2"],
    ]);

    const rangeTypes = ["Last Year", "Year to Date", "All Time", "Custom"];

    const getReportComponent = () => {
        if (reportType == "balance") {
            return <BalanceSheet accounts={ctxAccountList} />;
        } else if (reportType == "profitloss") {
            return <ProfitLoss accounts={ctxAccountList} />;
        }
    };

    const setRangeType = (type) => {
        setReportRangeType(type);
        setIsExpanded(false);
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;

        setDateRange((prev) => {
            return {
                ...prev,
                [name]: value,
            };
        });
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const handleRangeChange = (rangeType) => {
        // Get the current date to base calculations on.
        const today = new Date();

        // Helper function to format a Date object as "yyyy-mm-dd"
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        };

        switch (rangeType) {
            case "Last Year": {
                const lastYear = today.getFullYear() - 1;
                const startDateObj = new Date(lastYear, 0, 1);
                const endDateObj = new Date(lastYear, 11, 31);
                setDateRange({
                    startDate: formatDate(startDateObj),
                    endDate: formatDate(endDateObj),
                });
                break;
            }
            case "Year to Date": {
                const currentYear = today.getFullYear();
                const startDateObj = new Date(currentYear, 0, 1);
                const endDateObj = today;
                setDateRange({
                    startDate: formatDate(startDateObj),
                    endDate: formatDate(endDateObj),
                });
                break;
            }
            case "All Time":
                setDateRange({
                    startDate: "1900-01-01",
                    endDate: formatDate(today),
                });
                break;
            case "custom":
            default:
                setDateRange({
                    startDate: "",
                    endDate: "",
                });
                break;
        }

        setReportRangeType(rangeType);
        setIsExpanded(false);
    };

    return (
        <div className={classes.mainContainer}>
            <div className={classes.reportsHeader}>
                <h2>Reports</h2>
                <div className={classes.tools}>
                    <div>
                        <input
                            type="text"
                            className={classes.reportSearch}
                            placeholder="Search..."
                            spellCheck="false"
                        ></input>
                    </div>
                    <div className={classes.dateSelect}>
                        <div className={classes.rangeDropdown}>
                            <div className={classes.dateRange} onClick={() => setIsExpanded((prev) => !prev)}>
                                {reportRangeType && reportRangeType !== "custom" ? (
                                    <p>{reportRangeType}</p>
                                ) : (
                                    <p>custom</p>
                                )}
                                <img src={isExpanded ? upChevIcon : downChevIcon} className={classes.icon} />
                            </div>
                            <div className={`${classes.anchor} ${isExpanded ? "" : classes.noDisplay}`}>
                                <div className={classes.dropdown}>
                                    {rangeTypes.map((type, index) => {
                                        if (type !== reportRangeType) {
                                            return (
                                                <p
                                                    key={index}
                                                    onClick={() => {
                                                        handleRangeChange(type);
                                                    }}
                                                >
                                                    {type}
                                                </p>
                                            );
                                        }
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className={`${classes.cluster} ${classes.dateCluster}`}>
                            <input
                                type="date"
                                name="startDate"
                                value={dateRange.startDate}
                                onChange={handleDateChange}
                            />
                        </div>
                        <div className={`${classes.cluster} ${classes.dateCluster}`}>
                            <input type="date" name="endDate" value={dateRange.endDate} onChange={handleDateChange} />
                        </div>
                    </div>
                    <div>
                        <button>Run Report</button>
                    </div>
                </div>
            </div>
            <div className={classes.reportContainer}>
                {
                    <div className={`${classes.reportHistory} ${historyOpen ? classes.lg : classes.sm}`}>
                        <section className={classes.historyHeader}>
                            <h3>Report History</h3>
                        </section>
                        <section className={`${classes.columnNames} ${classes.historyGridTemplate}`}>
                            <div>
                                <p>Date</p>
                            </div>
                            <div>
                                <p>Name</p>
                            </div>
                        </section>
                        <section className={classes.items}>
                            {reportHistory.map((entry, index) => (
                                <div className={classes.historyEntry} key={index}>
                                    <p>{entry[0]}</p>
                                    <p>{entry[1]}</p>
                                </div>
                            ))}
                        </section>
                    </div>
                }
                <div className={`${classes.reportContent} ${historyOpen ? classes.small : classes.large}`}>
                    <div className={classes.subTools}>
                        <div>
                            {historyOpen ? (
                                <img
                                    className={classes.icon}
                                    src={ArrowLeftIcon}
                                    alt="Icon"
                                    onClick={() => setHistoryOpen(false)}
                                />
                            ) : (
                                <img
                                    className={classes.icon}
                                    src={ArrowRightIcon}
                                    alt="Icon"
                                    onClick={() => setHistoryOpen(true)}
                                />
                            )}
                        </div>
                        <div>
                            <img className={classes.icon} src={PrintIcon} alt="Icon" />
                        </div>
                    </div>
                    <div className={classes.report}>{ctxAccountList && getReportComponent()}</div>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
