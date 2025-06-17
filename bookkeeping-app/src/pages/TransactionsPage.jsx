import AccountDropdown from "../components/elements/dropdowns/AccountDropdown";
import TransactionItem from "../components/elements/items/TransactionItem";
import classes from "./TransactionsPage.module.css";

import TransactionsCtx from "../components/contexts/TransactionsCtx";
import AccountsCtx from "../components/contexts/AccountsCtx";

import { useState, useContext, useEffect } from "react";
import AddTransactionsModal from "../components/elements/modals/AddTransactionsModal";

const TransactionsPage = () => {
    const { setCtxTranList, ctxTranList, setCtxFilterBy } = useContext(TransactionsCtx);
    const { ctxActiveAccount, setCtxActiveAccount } = useContext(AccountsCtx);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [filteredTransactions, setFilteredTransactions] = useState([]);

    useEffect(() => {
        setCtxFilterBy("account");
    }, []);

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (ctxTranList) {
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            const filtered = ctxTranList.filter(
                (transaction) =>
                    transaction.account.name.toLowerCase().includes(lowercasedSearchTerm) ||
                    transaction.entity.name.toLowerCase().includes(lowercasedSearchTerm) ||
                    transaction.memo.toLowerCase().includes(lowercasedSearchTerm)
            );
            setFilteredTransactions(filtered);
        }
    }, [searchTerm, ctxTranList]);

    return (
        <>
            {isModalOpen && (
                <AddTransactionsModal
                    ctxActiveAccount={ctxActiveAccount}
                    setPageTrans={setCtxTranList}
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
                                <TransactionItem vals={transaction} setPageTrans={setCtxTranList} key={index} />
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
