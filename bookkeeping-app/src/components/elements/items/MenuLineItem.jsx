import classes from "./MenuLineItem.module.css";

import { Link } from "react-router-dom";

const MenuLineItem = ({ itemName, link = null, icon = null, onClick = null }) => {
    return (
        <Link to={link} className={classes.mainContainer} onClick={onClick}>
            <div className={classes.logoContainer}>{icon && <div className={classes.icon}>{icon}</div>}</div>
            <div className={classes.nameContainer}>
                <p>{itemName}</p>
            </div>
        </Link>
    );
};

export default MenuLineItem;
