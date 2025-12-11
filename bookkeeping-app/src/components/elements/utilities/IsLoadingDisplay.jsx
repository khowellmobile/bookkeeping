import classes from "./IsLoadingDisplay.module.css";

import loadingIcon from "../../../assets/loading-icon.svg";

const IsLoadingDisplay = () => {
    return (
        <div className={classes.mainContainer}>
            <img className={classes.icon} src={loadingIcon} alt={"question icon"}></img>
        </div>
    );
};

export default IsLoadingDisplay;
