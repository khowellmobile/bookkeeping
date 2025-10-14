import classes from "./ProfitLoss.module.css";

const ProfitLoss = ({ accounts }) => {
    const revenueAccounts = accounts?.filter((item) => item.type == "revenue");
    const expensesAccounts = accounts?.filter((item) => item.type == "expense");

    const revenueTotal = revenueAccounts.reduce((sum, item) => {
        return sum + parseFloat(item.balance);
    }, 0);

    const expensesTotal = expensesAccounts.reduce((sum, item) => {
        return sum + parseFloat(item.balance);
    }, 0);

    return (
        <div className={classes.mainContainer}>
            <h2>Profit and Loss</h2>
            <h3>Revenue</h3>
            {revenueAccounts?.map((item, index) => (
                <div className={classes.sheetLine} key={index}>
                    <p>{item.name}</p>
                    <p>{item.balance}</p>
                </div>
            ))}
            <div className={classes.sepH} />
            <div className={classes.sheetLine}>
                <p>Total:</p>
                <p>{revenueTotal.toFixed(2)}</p>
            </div>
            <h3>Expenses</h3>
            {expensesAccounts?.map((item, index) => (
                <div className={classes.sheetLine} key={index}>
                    <p>{item.name}</p>
                    <p>{item.balance}</p>
                </div>
            ))}
            <div className={classes.sepH} />
            <div className={classes.sheetLine}>
                <p>Total:</p>
                <p>{expensesTotal.toFixed(2)}</p>
            </div>
            <div className={classes.sepH2} />
            <div className={classes.sheetLine}>
                <h3>Net</h3>
                <p>{(revenueTotal - expensesTotal).toFixed(2)}</p>
            </div>
        </div>
    );
};

export default ProfitLoss;
