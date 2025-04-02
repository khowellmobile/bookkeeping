import classes from "./ReportListItem.module.css";

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

export default ReportListItem;
