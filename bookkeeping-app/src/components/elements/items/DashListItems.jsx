import classes from "./DashListItems.module.css";

import AccountsCtx from "../../contexts/AccountsCtx.jsx";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const AccountListItem = ({ account }) => {
    const navigate = useNavigate();

    const { setCtxActiveAccount } = useContext(AccountsCtx);

    const accountClickHandler = (account) => {
        setCtxActiveAccount(account);
        navigate("/transactions");
    };

    return (
        <div className={`${classes.mainContainer}`} onClick={() => accountClickHandler(account)}>
            <div>
                <p>{account.name}</p>
            </div>
            <div>
                <p>{account.type}</p>
            </div>
            <div>
                <p>{account.balance}</p>
            </div>
        </div>
    );
};

const PropertyListItem = ({ vals }) => {
    return (
        <div className={`${classes.mainContainer}`}>
            <div>
                <p>{vals.address}</p>
            </div>
            <div>
                <p>{vals.rent}</p>
            </div>
            <div>
                <p>{vals.name}</p>
            </div>
        </div>
    );
};

const ReportListItem = ({ name, range, date }) => {
    return (
        <div className={`${classes.mainContainer}`}>
            <div>
                <p>{name}</p>
            </div>
            <div>
                <p>{range}</p>
            </div>
            <div>
                <p>{date}</p>
            </div>
        </div>
    );
};

export { AccountListItem, PropertyListItem, ReportListItem };
