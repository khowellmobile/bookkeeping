import classes from "./Shortcuts.module.css";

const Shortcuts = () => {
    return (
        <div className={classes.mainContainer}>
            <section className={classes.header}>
                <h2>Shortcuts</h2>
            </section>
            <section className={classes.content}>
                <div>
                    <div>T</div>
                    <p>Transactions</p>
                </div>
                <div>
                    <div>R</div>
                    <p>Reports</p>
                </div>
                <div>
                    <div>R</div>
                    <p>Reconcile</p>
                </div>
                <div>
                    <div>A</div>
                    <p>Accounts</p>
                </div>
            </section>
        </div>
    );
};

export default Shortcuts;
