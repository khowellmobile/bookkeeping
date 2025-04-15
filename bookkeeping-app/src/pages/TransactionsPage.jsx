import AccountDropdown from "../components/elements/dropdowns/AccountDropdown";
import TransactionItem from "../components/elements/items/TransactionItem";
import classes from "./TransactionsPage.module.css";

import BkpgContext from "../components/contexts/BkpgContext";

import { useState, useContext, useEffect } from "react";

const TransactionsPage = () => {
    const { ctxActiveAccount, changeCtxActiveAccount } = useContext(BkpgContext);

    const [transactions, setTransactions] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch("http://127.0.0.1:8000/api/transactions/");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setTransactions(data);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    useEffect(() => {
        const fetchAccounts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch("http://127.0.0.1:8000/api/accounts/");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                setAccounts(data);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAccounts();
    }, []);

    if (loading) {
        return <div>Loading transactions...</div>;
    }

    if (error) {
        return <div>Error loading things: {error}</div>;
    }

    return (
        <>
            <div className={classes.mainContainer}>
                <div className={classes.tranasctionsHeader}>
                    <h2>Transactions</h2>
                    <div className={classes.tools}>
                        <div>
                            <AccountDropdown
                                initalVal={ctxActiveAccount}
                                onChange={changeCtxActiveAccount}
                                accountList={accounts}
                            />
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
