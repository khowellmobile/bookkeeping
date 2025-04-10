import classes from "./ReportsPage.module.css";

import { useState } from "react";

const ReportsPage = () => {
    const [historyOpen, setHistoryOpen] = useState(true);
    const [reportHistory, setJournalHistory] = useState([
        ["2024-01-24", "Revenue Adjustment"],
        ["2023-11-10", "Payroll Entry"],
        ["2024-02-15", "Equity Balancing"],
        ["2023-09-05", "JRE #4"],
        ["2024-01-05", "Clear Income Stmt"],
        ["2024-01-05", "Adjustment #2"],
    ]);

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
                    <div>
                        <button onClick={() => setHistoryOpen((prev) => !prev)}>Run Report</button>
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
                    <div className={classes.subTools}></div>
                    <div className={classes.report}></div>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
