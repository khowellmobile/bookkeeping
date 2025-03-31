import classes from "./AccountListItem.module.css";

const AccountListItem = ({ name, balance, date }) => {
    return (
        <div className={`${classes.taskItemContainer}`}>
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

export default AccountListItem;
