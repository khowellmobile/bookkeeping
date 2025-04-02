import classes from "./PropertyListItem.module.css";

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

export default PropertyListItem;
