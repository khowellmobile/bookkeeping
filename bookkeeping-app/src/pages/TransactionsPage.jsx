import AccountDropdown from "../components/elements/dropdowns/AccountDropdown";
import TransactionItem from "../components/elements/items/TransactionItem";
import classes from "./TransactionsPage.module.css";
import BkpgContext from "../components/contexts/BkpgContext";
import { useState, useContext, useEffect } from "react";
import AddTransactionsModal from "../components/elements/modals/AddTransactionsModal";

const TransactionsPage = () => {
    const { ctxActiveAccount, setCtxActiveAccount, setCtxTranList, populateCtxTransactions } =
        useContext(BkpgContext);

    const [transactions, setTransactions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [filteredTransactions, setFilteredTransactions] = useState([]);

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // load trnsactions on mount
    useEffect(() => {
        const fetchTran = async () => {
            const data = await populateCtxTransactions();
            setTransactions(data);
        };

        fetchTran();
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

    useEffect(() => {
        setCtxTranList(transactions);
    }, [transactions]);

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
                            <AccountDropdown initalVal={ctxActiveAccount} onChange={setCtxActiveAccount} />
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
