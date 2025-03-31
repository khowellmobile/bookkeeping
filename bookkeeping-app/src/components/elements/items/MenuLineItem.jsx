import classes from "./MenuLineItem.module.css";

const MenuLineItem = ({ itemName, navPath = null, logo = null }) => {
    return (
        <div className={classes.mainContainer}>
            <div className={classes.logoContainer}>
                <div className={classes.svgPH}></div>
            </div>
            <div className={classes.nameContainer}>
                <p>{itemName}</p>
            </div>
        </div>
    );
};

export default MenuLineItem;