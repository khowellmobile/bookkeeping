import classes from "./DashBlock.module.css";

const DashBlock = ({title, text, link}) => {
    return <div className={classes.mainContainer}>
        <p className={classes.blockTitle}>{title}</p>
        <p className={classes.blockText}>{text}</p>
        <button>Take Me There</button>
    </div>;
};

export default DashBlock;
