import classes from "./AddTransactionsModal.module.css";

import { TransactionEntryItem } from "../items/InputEntryItems";
import AccountDropdown from "../dropdowns/AccountDropdown";
import { useState } from "react";

const AddTransactionsModal = ({handleCloseModal}) => {
    const [activeAccount, setActiveAccount] = useState();

    const changeActiveAccount = (account) => {
        setActiveAccount(account);
        console.log(account);
    }

    return (
        <div className={classes.modalOverlay}>
            <div className={classes.mainContainer}>
                <section className={classes.tools}>
                    <AccountDropdown onChange={changeActiveAccount} />
                    <section className={classes.buttons}>
                        <button onClick={handleCloseModal}>Save & Close</button>
                        <button onClick={handleCloseModal}>Cancel</button>
                    </section>
                </section>
                <div className={classes.entryContainer}>
                    <section className={`${classes.columnNames} ${classes.entryGridTemplate}`}>
                        <div>
                            <p>Date</p>
                        </div>
                        <div>
                            <p>Payee</p>
                        </div>
                        <div>
                            <p>Account</p>
                        </div>
                        <div>
                            <p>Memo</p>
                        </div>
                        <div>
                            <p>Amount</p>
                        </div>
                    </section>
                    <section className={classes.items}>
                        <TransactionEntryItem />
                        <TransactionEntryItem />
                        <TransactionEntryItem />
                        <TransactionEntryItem />
                        <TransactionEntryItem />
                        <TransactionEntryItem />
                        <TransactionEntryItem />
                        <TransactionEntryItem />
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AddTransactionsModal;
