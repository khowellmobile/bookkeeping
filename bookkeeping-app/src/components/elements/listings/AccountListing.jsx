import AccountListItem from "../items/AccountListItem";
import classes from "./AccountListing.module.css";

const AccountListing = () => {
    return (
        <div className={classes.mainContainer}>
            <section className={classes.header}>
                <h2>Chart of Accounts</h2>
            </section>
            <section className={classes.columnNames}>
                <div>
                    <p>Name</p>
                </div>
                <div>
                    <p>Balance</p>
                </div>
                <div>
                    <p>Last Changed</p>
                </div>
            </section>
            <section className={classes.items}>
                <AccountListItem name="Huntington 1234" balance="10,500" date="4/5/25" />
                <AccountListItem name="Chase CC 4321" balance="(1,250)" date="4/10/25" />
                <AccountListItem name="Taxes" balance="7,200" date="4/15/25" />
                <AccountListItem name="Insurance" balance="1,850" date="4/20/25" />
                <AccountListItem name="PayPal Business" balance="32,000" date="4/25/25" />
                <AccountListItem name="Amex Business" balance="(2,500)" date="5/1/25" />
                <AccountListItem name="Maintenance Fund" balance="4,600" date="5/5/25" />
                <AccountListItem name="Utilities" balance="9,300" date="5/10/25" />
                <AccountListItem name="Chase Checking" balance="5,200" date="5/15/25" />
                <AccountListItem name="Wells Fargo Savings" balance="12,400" date="5/20/25" />
                <AccountListItem name="Business Loan" balance="18,000" date="5/25/25" />
                <AccountListItem name="Depreciation" balance="6,000" date="6/1/25" />
            </section>
        </div>
    );
};

export default AccountListing;
