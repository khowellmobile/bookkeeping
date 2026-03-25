import { useState, useContext, useEffect } from "react";

import classes from "./TransactionsPage.module.css";

import AccountDropdown from "../components/elements/dropdowns/AccountDropdown";
import TransactionItem from "../components/elements/items/TransactionItem";
import TransactionsCtx from "../contexts/TransactionsCtx";
import AccountsCtx from "../contexts/AccountsCtx";
import AddTransactionsModal from "../components/elements/modals/AddTransactionsModal";
import NoResultsDisplay from "../components/elements/utilities/NoResultsDisplay";
import Button from "../components/elements/utilities/Button";

const initialTranState = {
    date: "",
    account: "",
    entity: "",
    memo: "",
    amount: "",
    type: "",
};

const TransactionsPage = () => {
    const { setCtxTranList, ctxTranList, setCtxFilterBy } = useContext(TransactionsCtx);
    const { ctxActiveAccount, setCtxActiveAccount } = useContext(AccountsCtx);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [tranList, setTranList] = useState([initialTranState]);

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
                    transaction.memo.toLowerCase().includes(lowercasedSearchTerm),
            );
            setFilteredTransactions(filtered);
        }
    }, [searchTerm, ctxTranList]);

    const addTransaction = () => {
        setTranList((prev) => [...prev, initialTranState]);
    };

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
                            <Button onClick={addTransaction} text={"Add Transcation"} />
                            <Button onClick={() => setIsModalOpen(true)} text={"Add Transcations"} />
                        </div>
                    </div>
                </div>
                <div className={classes.transactionListing}>
                    <div className={classes.listingHeader}>
                        <p>Date</p>
                        <p>Payee</p>
                        <p>Account</p>
                        <p>Memo</p>
                        <p>Debit</p>
                        <p>Credit</p>
                        <p>Reconciled</p>
                    </div>
                    <div className={classes.listingItems}>
                        {tranList &&
                            tranList.map((transaction, index) => (
                                <TransactionItem vals={transaction} setPageTrans={setCtxTranList} key={index} />
                            ))}
                        {filteredTransactions && filteredTransactions.length > 0 ? (
                            filteredTransactions.map((transaction, index) => (
                                <TransactionItem vals={transaction} setPageTrans={setCtxTranList} key={index} />
                            ))
                        ) : (
                            <NoResultsDisplay
                                mainText={"No Transactions to load."}
                                guideText={"Have you chosen a Property and Account?"}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default TransactionsPage;
