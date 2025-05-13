import AccountDropdown from "../components/elements/dropdowns/AccountDropdown";
import TransactionItem from "../components/elements/items/TransactionItem";
import classes from "./TransactionsPage.module.css";
import BkpgContext from "../components/contexts/BkpgContext";
import { useState, useContext, useEffect } from "react";
import AddTransactionsModal from "../components/elements/modals/AddTransactionsModal";

const TransactionsPage = () => {
    const { ctxActiveAccount, changeCtxActiveAccount } = useContext(BkpgContext);

    const [transactions, setTransactions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [filteredTransactions, setFilteredTransactions] = useState([]);

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            setError(null);
            const accessToken = localStorage.getItem("accessToken");

            try {
                const response = await fetch("http://localhost:8000/api/transactions/", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
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
        if (transactions) {
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            const filtered = transactions.filter(
                (transaction) =>
                    transaction.account.name.toLowerCase().includes(lowercasedSearchTerm) ||
                    transaction.entity.name.toLowerCase().includes(lowercasedSearchTerm) ||
                    transaction.memo.toLowerCase().includes(lowercasedSearchTerm)
            );
            setFilteredTransactions(filtered);
        }
    }, [searchTerm, transactions]);

    if (loading) {
        return <div>Loading transactions...</div>;
    }

    if (error) {
        return <div>Error loading things: {error}</div>;
    }

    return (
        <>
            {isModalOpen && (
                <AddTransactionsModal
                    ctxActiveAccount={ctxActiveAccount}
                    setPageTrans={setTransactions}
                    handleCloseModal={handleCloseModal}
                />
            )}

            <div className={classes.mainContainer}>
                <div className={classes.tranasctionsHeader}>
                    <h2>Transactions</h2>
                    <div className={classes.tools}>
                        <div>
                            <AccountDropdown initalVal={ctxActiveAccount} onChange={changeCtxActiveAccount} />
                            <input
                                type="text"
                                className={classes.transactionsSearch}
                                placeholder="Search..."
                                spellCheck="false"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                }}
                            ></input>
                        </div>
                        <div>
                            <button onClick={() => setIsModalOpen(true)}>Add Transactions</button>
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
                        {filteredTransactions && filteredTransactions.length > 0 ? (
                            filteredTransactions.map((transaction, index) => (
                                <TransactionItem vals={transaction} setPageTrans={setTransactions} key={index} />
                            ))
                        ) : (
                            <p>No matching transactions found.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default TransactionsPage;
