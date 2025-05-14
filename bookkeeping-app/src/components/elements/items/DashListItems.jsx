import classes from "./DashListItems.module.css";

import BkpgContext from "../../contexts/BkpgContext.jsx";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const AccountListItem = ({ account }) => {
    const navigate = useNavigate();

    const { changeCtxActiveAccount } = useContext(BkpgContext);

    const accountClickHandler = (account) => {
        changeCtxActiveAccount(account);
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

const PropertyListItem = ({ address, rent, rentDue }) => {
    return (
        <div className={`${classes.mainContainer}`}>
            <div>
                <p>{address}</p>
            </div>
            <div>
                <p>{rent}</p>
            </div>
            <div>
                <p>{rentDue}</p>
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
