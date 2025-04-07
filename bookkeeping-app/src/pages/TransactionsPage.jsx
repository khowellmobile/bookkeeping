import classes from "./TransactionsPage.module.css";

import { useState } from "react";

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState([
        ["2024/01/24", "Huntington", "1234", "Payment for services", "$12,157", 1],
        ["2023/11/10", "Wells Fargo", "5678", "Transfer to savings", "$2,500", 0],
        ["2024/02/15", "Chase", "9101", "Payment for goods", "$3,000", 1],
        ["2023/09/05", "Bank of America", "1122", "Monthly rent", "$5,400", 1],
        ["2024/01/05", "Citibank", "3344", "Online purchase", "$1,200", 0],
        ["2024/03/20", "TD Bank", "5566", "Deposit", "$6,800", 1],
        ["2023/12/10", "Capital One", "7788", "Payment for utilities", "$4,500", 0],
        ["2023/10/15", "PNC", "9900", "ATM withdrawal", "$7,000", 1],
        ["2024/01/12", "HSBC", "2233", "Grocery shopping", "$2,800", 0],
        ["2023/08/25", "U.S. Bank", "4455", "Paycheck deposit", "$8,200", 1],
        ["2024/03/01", "KeyBank", "6677", "Loan payment", "$1,600", 0],
        ["2023/11/20", "Regions", "8899", "Transfer from savings", "$4,750", 1],
        ["2024/01/30", "SunTrust", "1123", "Gift for family", "$3,200", 0],
        ["2023/07/15", "American Express", "2234", "Credit card payment", "$9,500", 1],
        ["2024/02/05", "M&T Bank", "3345", "Purchase at store", "$1,000", 0],
        ["2023/12/25", "Fifth Third", "4456", "Online payment", "$6,100", 1],
        ["2024/01/10", "BB&T", "5567", "Subscription fee", "$2,300", 0],
        ["2023/10/05", "Citizens Bank", "6678", "Insurance premium", "$4,800", 1],
        ["2024/02/20", "Santander", "7789", "Payment for services", "$3,500", 0],
        ["2023/09/15", "Comerica", "8890", "Utility bill", "$5,600", 1],
    ]);

    return (
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
                        <div key={index}>
                            <p>{transaction[0]}</p>
                            <p>{transaction[1]}</p>
                            <p>{transaction[2]}</p>
                            <p>{transaction[3]}</p>
                            <p>{transaction[4]}</p>
                            <p>{transaction[5]}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TransactionsPage;
