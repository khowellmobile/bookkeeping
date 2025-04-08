import TransactionItem from "../components/elements/items/TransactionItem";
import TransactionModal from "../components/elements/modals/TransactionModal";
import classes from "./TransactionsPage.module.css";

import { useState } from "react";

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState([
        ["2024-01-24", "Paul Blart", "Huntington 0456", "Payment for services", 12157, 1],
        ["2023-11-10", "Starbucks", "Equity", "Transfer to savings", 2500, 0],
        ["2024-02-15", "Michaels Law Firm", "Chase 1234", "Payment for goods", 3000, 1],
        ["2023-09-05", "Bank of America", "Office Expenses", "Monthly rent", 5400, 1],
        ["2024-01-05", "Amazon", "Sales Income", "Online purchase", 1200, 0],
        ["2024-03-20", "TD Bank", "TD Bank 5566", "Deposit", 6800, 1],
        ["2023-12-10", "Capital One", "Capital One 7788", "Payment for utilities", 4500, 0],
        ["2023-10-15", "PNC", "PNC 9900", "ATM withdrawal", 7000, 1],
        ["2024-01-12", "HSBC", "HSBC 2233", "Grocery shopping", 2800, 0],
        ["2023-08-25", "U.S. Bank", "U.S. Bank 4455", "Paycheck deposit", 8200, 1],
        ["2024-03-01", "KeyBank", "KeyBank 6677", "Loan payment", 1600, 0],
        ["2023-11-20", "Regions", "Regions 8899", "Transfer from savings", 4750, 1],
        ["2024-01-30", "SunTrust", "SunTrust 1123", "Gift for family", 3200, 0],
        ["2023-07-15", "American Express", "Credit Card Payment", "Credit card payment", 9500, 1],
        ["2024-02-05", "M&T Bank", "M&T Bank 3345", "Purchase at store", 1000, 0],
        ["2023-12-25", "Fifth Third", "Fifth Third 4456", "Online payment", 6100, 1],
        ["2024-01-10", "BB&T", "BB&T 5567", "Subscription fee", 2300, 0],
        ["2023-10-05", "Citizens Bank", "Insurance Premium", "Insurance premium", 4800, 1],
        ["2024-02-20", "Santander", "Santander 7789", "Payment for services", 3500, 0],
        ["2023-09-15", "Comerica", "Utility Bill", "Utility bill", 5600, 1],
    ]);

    return (
        <>
            <div className={classes.mainContainer}>
                <div className={classes.tranasctionsHeader}>
                    <h2>Transactions</h2>
                    <div className={classes.tools}>
                        <div>
                            <input
                                type="text"
                                className={classes.transactionsSearch}
                                placeholder="Search..."
                                spellCheck="false"
                            ></input>
                        </div>
                        <div>
                            <button>Add Transaction</button>
                        </div>
                    </div>
                </div>
                <div className={classes.transactionListing}>
                    <div className={classes.listingHeader}>
                        <p>Date</p>
                        <p>Payee</p>
                        <p>Account</p>
                        <p>Memo</p>
                        <p>Amount</p>
                        <p>Reconciled</p>
                    </div>
                    <div className={classes.listingItems}>
                        {transactions.map((transaction, index) => (
                            <TransactionItem vals={transaction} key={index} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default TransactionsPage;
