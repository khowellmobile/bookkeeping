import { useContext, useEffect, useRef } from "react";

import classes from "./TransactionsPage.module.css";

import AccountDropdown from "../components/elements/dropdowns/AccountDropdown";
import TransactionItem from "../components/elements/items/TransactionItem";
import { TransactionEntryItem } from "../components/elements/items/InputEntryItems";
import TransactionsCtx from "../contexts/TransactionsCtx";
import AccountsCtx from "../contexts/AccountsCtx";
import NoResultsDisplay from "../components/elements/utilities/NoResultsDisplay";
import Button from "../components/elements/utilities/Button";

import { useTransactions } from "../hooks/useTransactions";

const TransactionsPage = () => {
    const { setCtxFilterBy } = useContext(TransactionsCtx);
    const { ctxActiveAccount, setCtxActiveAccount } = useContext(AccountsCtx);

    const {
        transToAdd,
        filteredTransactions,
        searchTerm,
        setSearchTerm,
        addEmptyTransaction,
        handleChange,
        addTransactions,
    } = useTransactions();

    const scrollRef = useRef();

    useEffect(() => {
        setCtxFilterBy("account");
    }, []);

    return (
        <>
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
                        <div className={classes.buttonDiv}>
                            {transToAdd?.length > 0 && (
                                <p>
                                    <b>Tip:</b> Empty transactions will not be saved
                                </p>
                            )}
                            {ctxActiveAccount?.id && transToAdd?.length > 0 && (
                                <Button onClick={addTransactions} text={"Save Transactions"} />
                            )}
                            {ctxActiveAccount?.id && <Button onClick={addEmptyTransaction} text={"Add Transcation"} />}
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
                    <div className={classes.listingItems} ref={scrollRef}>
                        {transToAdd?.length > 0 &&
                            transToAdd.map((transaction, index) => (
                                <TransactionEntryItem
                                    vals={transaction}
                                    index={index}
                                    onFocus={() => {}}
                                    onItemChange={handleChange}
                                    key={index}
                                    scrollRef={scrollRef}
                                />
                            ))}
                        {filteredTransactions?.length > 0 &&
                            filteredTransactions.map((transaction, index) => (
                                <TransactionItem vals={transaction} key={index} />
                            ))}
                        {filteredTransactions?.length == 0 && transToAdd?.length == 0 && (
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
