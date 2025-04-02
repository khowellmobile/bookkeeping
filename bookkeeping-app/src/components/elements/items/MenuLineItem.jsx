import classes from "./MenuLineItem.module.css";

const MenuLineItem = ({ itemName, navPath = null, icon = null}) => {
    return (
        <div className={classes.mainContainer}>
            <div className={classes.logoContainer}>{icon && <div className={classes.icon}>{icon}</div>}</div>
            <div className={classes.nameContainer}>
                <p>{itemName}</p>
            </div>
        </div>
    );
};

export default MenuLineItem;
