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
                <AccountListItem name="Hunt 1234" balance="24,500" date="3/31/25" />
                <AccountListItem name="Hunt 1234" balance="24,500" date="3/31/25" />
                <AccountListItem name="Hunt 1234" balance="24,500" date="3/31/25" />
                <AccountListItem name="Hunt 1234" balance="24,500" date="3/31/25" />
                <AccountListItem name="Hunt 1234" balance="24,500" date="3/31/25" />
                <AccountListItem name="Hunt 1234" balance="24,500" date="3/31/25" />
                <AccountListItem name="Hunt 1234" balance="24,500" date="3/31/25" />
                <AccountListItem name="Hunt 1234" balance="24,500" date="3/31/25" />
                <AccountListItem name="Hunt 1234" balance="24,500" date="3/31/25" />
                <AccountListItem name="Hunt 1234" balance="24,500" date="3/31/25" />
                <AccountListItem name="Hunt 1234" balance="24,500" date="3/31/25" />
            </section>
        </div>
    );
};

export default AccountListing;
