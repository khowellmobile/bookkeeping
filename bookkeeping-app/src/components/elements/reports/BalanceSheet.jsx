import classes from "./BalanceSheet.module.css";

const BalanceSheet = ({ accounts }) => {
    const assetAccounts = accounts?.filter((item) => item.type == "asset");
    const liabilityAccounts = accounts?.filter((item) => item.type == "liability");
    const equityAcccounts = accounts?.filter((item) => item.type == "equity");

    const assetTotal = assetAccounts.reduce((sum, item) => {
        return sum + parseFloat(item.balance);
    }, 0);

    const liabailityTotal = liabilityAccounts.reduce((sum, item) => {
        return sum + parseFloat(item.balance);
    }, 0);

    const equityTotal = equityAcccounts.reduce((sum, item) => {
        return sum + parseFloat(item.balance);
    }, 0);

    return (
        <div className={classes.mainContainer}>
            <h2>Balance Sheet</h2>
            <h3>Assets</h3>
            {assetAccounts?.map((item, index) => (
                <div className={classes.sheetLine} key={index}>
                    <p>{item.name}</p>
                    <p>{item.balance}</p>
                </div>
            ))}
            <div className={classes.sepH} />
            <div className={classes.sheetLine}>
                <p>Total:</p>
                {assetTotal.toFixed(2)}
            </div>
            <h3>Liabilities</h3>
            {liabilityAccounts?.map((item, index) => (
                <div className={classes.sheetLine} key={index}>
                    <p>{item.name}</p>
                    <p>{item.balance}</p>
                </div>
            ))}
            <div className={classes.sepH} />
            <div className={classes.sheetLine}>
                <p>Total:</p>
                {liabailityTotal.toFixed(2)}
            </div>
            <h3>Equities</h3>
            {equityAcccounts?.map((item, index) => (
                <div className={classes.sheetLine} key={index}>
                    <p>{item.name}</p>
                    <p>{item.balance}</p>
                </div>
            ))}
            <div className={classes.sepH} />
            <div className={classes.sheetLine}>
                <p>Total:</p>
                {equityTotal.toFixed(2)}
            </div>
        </div>
    );
};

export default BalanceSheet;
