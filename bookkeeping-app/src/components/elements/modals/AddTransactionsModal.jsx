import classes from "./AddTransactionsModal.module.css";

import { TransactionEntryItem } from "../items/InputEntryItems";

const AddTransactionsModal = () => {
    return (
        <div className={classes.modalOverlay}>
            <div className={classes.mainContainer}>
                <div className={classes.topTools}></div>
                <section className={classes.header}>
                    <h2>Make an Entry</h2>
                </section>
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
                </section>
                <div className={classes.botTools}></div>
            </div>
        </div>
    );
};

export default AddTransactionsModal;
