import classes from "./EntitiesPage.module.css";

import BkpgContext from "../components/contexts/BkpgContext";
import { useState, useContext, useEffect } from "react";

import TransactionItem from "../components/elements/items/TransactionItem";

const EntitiesPage = () => {
    const { populateCtxTransactions } = useContext(BkpgContext);

    const [transactions, setTransactions] = useState([]);
    const [searchTerm, setSearchTerm] = useState([]);

    // load trnsactions on mount
    useEffect(() => {
        const fetchTran = async () => {
            const data = await populateCtxTransactions();
            setTransactions(data);
        };

        fetchTran();
    }, []);

    return (
        <>
            <div className={classes.mainContainer}>
                <div className={classes.searchBox}>
                    <input
                        type="text"
                        className={classes.entitySerach}
                        placeholder="Search..."
                        spellCheck="false"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                        }}
                    ></input>
                </div>
                <div className={classes.contentBox}>
                    <div className={classes.entityInfo}>
                        <div className={classes.header}>
                            <h2>Starbucks</h2>
                        </div>
                        <div className={classes.inputs}>
                            <div className={classes.genInfo}>
                                <h3>General Infromation</h3>
                                <div>
                                    <div className={classes.cluster}>
                                        <p>Company:</p>
                                        <input type="text" value={"Starbucks"} />
                                    </div>
                                    <div className={classes.cluster}>
                                        <p>Address:</p>
                                        <input type="text" value={"123 Example St"} />
                                    </div>
                                    <div className={classes.cluster}>
                                        <p>Added:</p>
                                        <input type="text" value={"2025-05-05"} />
                                    </div>
                                </div>
                            </div>
                            <div className={classes.contactInfo}>
                                <h3>Contact</h3>
                                <div>
                                    <div className={classes.cluster}>
                                        <p>Phone Number:</p>
                                        <input type="text" value={"(123)123-4567"} />
                                    </div>
                                    <div className={classes.cluster}>
                                        <p>Email:</p>
                                        <input type="text" value={"exampleemail@gmai.com"} />
                                    </div>
                                </div>
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
                            {transactions && transactions.length > 0 ? (
                                transactions.map((transaction, index) => (
                                    <TransactionItem vals={transaction} setPageTrans={setTransactions} key={index} />
                                ))
                            ) : (
                                <p>No matching transactions listed.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EntitiesPage;
