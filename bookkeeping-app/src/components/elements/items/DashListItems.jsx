import classes from "./DashListItems.module.css";

const AccountListItem = ({ name, balance, date }) => {
    return (
        <div className={`${classes.mainContainer}`}>
            <div>
                <p>{name}</p>
            </div>
            <div>
                <p>{balance}</p>
            </div>
            <div>
                <p>{date}</p>
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
