import classes from "./NoResultsDisplay.module.css";

import questionIcon from "../../../assets/question-icon.svg";

const NoResultsDisplay = ({ mainText, guideText, customStyle }) => {
    return (
        <div className={classes.mainContainer} style={customStyle}>
            <img className={classes.icon} src={questionIcon} alt={"question icon"}></img>
            <div className={classes.textContainer}>
                <p>{mainText}</p>
                <p>{guideText}</p>
            </div>
        </div>
    );
};

export default NoResultsDisplay;
