import classes from "./AccountsPage.module.css";

import BkpgContext from "../components/contexts/BkpgContext";

import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

const AccountsPage = () => {
    const navigate = useNavigate();

    console.log("rendinger accounts page");

    const { ctxAccountList, changeCtxAccountList, changeCtxActiveAccount } = useContext(BkpgContext);
    const [accounts, setAccounts] = useState(ctxAccountList);

    const accountClickHandler = (account) => {
        changeCtxActiveAccount(account);
        navigate("/transactions");
    };

    if (!accounts) {
        return <div>Loading accounts...</div>; // Or some other loading indicator
    }

    return (
        <div className={classes.mainContainer}>
            <div className={classes.accountsHeader}>
                <h2>Accounts</h2>
                <div className={classes.tools}>
                    <div>
                        <input
                            type="text"
                            className={classes.accountSearch}
                            placeholder="Search..."
                            spellCheck="false"
                        ></input>
                    </div>
                    <div>
                        <button>Add Account</button>
                    </div>
                </div>
            </div>
            <div className={classes.accountListing}>
                <div className={classes.listingHeader}>
                    <p>Name</p>
                    <p>Type</p>
                    <p>Description</p>
                    <p>Balance</p>
                    <p>Action</p>
                </div>
                <div className={classes.listingItems}>
                    {accounts.map((account, index) => (
                        <div key={index}>
                            <p onClick={() => accountClickHandler(account.name)}>{account.name}</p>
                            <p>{account.type}</p>
                            <p>{account.description}</p>
                            <p>{account.balance}</p>
                            <p>{account.initial_balance}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AccountsPage;
