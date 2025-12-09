import { useContext, useEffect, useState } from "react";

import classes from "./ReportsPage.module.css";

import { useReportAPI } from "../hooks/useReportApi";
import AccountsCtx from "../components/contexts/AccountsCtx";
import PrintIcon from "../assets/print-icon.svg";
import ArrowLeftIcon from "../assets/arrow-left-icon.svg";
import ArrowRightIcon from "../assets/arrow-right-icon.svg";
import upChevIcon from "../assets/chevron-up-icon.svg";
import downChevIcon from "../assets/chevron-down-icon.svg";
import BalanceSheet from "../components/elements/reports/BalanceSheet";
import ProfitLoss from "../components/elements/reports/ProfitLoss";
import Button from "../components/elements/utilities/Button";

const ReportsPage = () => {
    const { addReport } = useReportAPI();
    const { ctxAccountList } = useContext(AccountsCtx);

    const [activeReport, setActiveReport] = useState(<></>);
    const [reportType, setReportType] = useState("Profit & Loss");
    const [reportRangeType, setReportRangeType] = useState("Custom");
    const [dateRange, setDateRange] = useState({
        startDate: "",
        endDate: "",
    });
    const [quickSelectList, setQuickSelectList] = useState([
        ["All Time", "Balance Sheet"],
        ["All Time", "Profit & Loss"],
        ["Last Year", "Balance Sheet"],
        ["Last Year", "Profit & Loss"],
    ]);

    const [isTypeExpanded, setIsTypeExpanded] = useState(false);
    const [isRangeExpanded, setIsRangeExpanded] = useState(false);
    const [historyOpen, setHistoryOpen] = useState(true);

    const rangeTypes = ["Last Year", "Year to Date", "All Time", "Custom"];
    const reportTypes = ["Balance Sheet", "Profit & Loss"];

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

    const handleTypeClick = (type) => {
        setReportType(type);
        setIsTypeExpanded(false);
    };

    const handleQuickClick = (entry) => {
        handleRangeChange(entry[0]);
        handleTypeClick(entry[1]);
    };

    const handleRangeChange = (rangeType) => {
        const today = new Date();

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
        setIsRangeExpanded(false);
    };

    const handleRunReport = () => {
        if (reportType == "Balance Sheet") {
            setActiveReport(<BalanceSheet accounts={ctxAccountList} />);
            addReport({
                type: "balance_sheet",
                report_range_type: reportRangeType,
                start_date: dateRange.startDate,
                end_date: dateRange.endDate,
            });
        } else if (reportType == "Profit & Loss") {
            setActiveReport(<ProfitLoss accounts={ctxAccountList} />);
            addReport({
                type: "profit_loss",
                report_range_type: reportRangeType,
                start_date: dateRange.startDate,
                end_date: dateRange.endDate,
            });
        } else {
            setActiveReport(<h1>Unrecognized report type</h1>);
            return;
        }
    };

    return (
        <div className={classes.mainContainer}>
            <div className={classes.reportsHeader}>
                <h2>Reports</h2>
                <div className={classes.tools}>
                    <div className={classes.leftTools}>
                        <input
                            type="text"
                            className={classes.reportSearch}
                            placeholder="Search..."
                            spellCheck="false"
                        ></input>
                    </div>
                    <div className={classes.rightTools}>
                        <div className={classes.toolInputs}>
                            <div className={classes.rangeDropdown}>
                                <div
                                    className={classes.dropdownDisplay}
                                    onClick={() => setIsTypeExpanded((prev) => !prev)}
                                >
                                    {reportType ? <p>{reportType}</p> : <p>None Selected</p>}
                                    <img src={isTypeExpanded ? upChevIcon : downChevIcon} className={classes.icon} />
                                </div>
                                <div className={`${classes.anchor} ${isTypeExpanded ? "" : classes.noDisplay}`}>
                                    <div className={classes.dropdown}>
                                        {reportTypes.map((type, index) => {
                                            if (type !== reportType) {
                                                return (
                                                    <p
                                                        key={index}
                                                        onClick={() => {
                                                            handleTypeClick(type);
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
                            <div className={classes.rangeDropdown}>
                                <div
                                    className={classes.dropdownDisplay}
                                    onClick={() => setIsRangeExpanded((prev) => !prev)}
                                >
                                    {reportRangeType && reportRangeType !== "custom" ? (
                                        <p>{reportRangeType}</p>
                                    ) : (
                                        <p>custom</p>
                                    )}
                                    <img src={isRangeExpanded ? upChevIcon : downChevIcon} className={classes.icon} />
                                </div>
                                <div className={`${classes.anchor} ${isRangeExpanded ? "" : classes.noDisplay}`}>
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
                                <input
                                    type="date"
                                    name="endDate"
                                    value={dateRange.endDate}
                                    onChange={handleDateChange}
                                />
                            </div>
                        </div>
                        <div>
                            <Button onClick={handleRunReport} text={"Run Report"} />
                        </div>
                    </div>
                </div>
            </div>
            <div className={classes.reportContainer}>
                {
                    <div className={`${classes.reportHistory} ${historyOpen ? classes.lg : classes.sm}`}>
                        <section className={classes.historyHeader}>
                            <h3>Quick Select</h3>
                        </section>
                        <section className={`${classes.columnNames} ${classes.historyGridTemplate}`}>
                            <div>
                                <p>Range</p>
                            </div>
                            <div>
                                <p>Type</p>
                            </div>
                        </section>
                        <section className={classes.items}>
                            {quickSelectList.map((entry, index) => (
                                <div
                                    className={classes.historyEntry}
                                    key={index}
                                    onClick={() => handleQuickClick(entry)}
                                >
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
                    <div className={classes.report}>{activeReport}</div>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
