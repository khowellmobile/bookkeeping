import classes from "./AccountListItem.module.css";

const AccountListItem = () => {
    return (
        <div className={`${classes.taskItemContainer}`}>
            <div>
                <p>Hunt 0574</p>
            </div>
            <div>
                <p>24,000</p>
            </div>
            <div>
                <p>3/31/2025</p>
            </div>
        </div>
    );
};

export default AccountListItem;
