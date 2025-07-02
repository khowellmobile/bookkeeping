import { useEffect, useState } from "react";
import classes from "./RentItem.module.css";

const RentItem = ({ item }) => {
    const [isClicked, setIsClicked] = useState(false);
    const [isAbsolute, setIsAbsolute] = useState(false);

    const handleClick = () => {
        setIsClicked((prev) => !prev);
        if (!isAbsolute) {
            setIsAbsolute(true);
        } else {
            setTimeout(() => {
                setIsAbsolute(false);
            }, 400);
        }
    };

    // Ensures click spams do not cause isAbsolute to be false when isClicked is true
    useEffect(() => {
        if (isAbsolute !== isClicked) {
            setIsAbsolute(isClicked);
        }
    }, [isAbsolute]);

    return (
        <div className={classes.mainContainer}>
            {isAbsolute && <div className={classes.placeholder} />}
            <div
                className={`${classes.itemBox} ${isClicked && classes.clicked} ${isAbsolute && classes.absPos}`}
                onClick={handleClick}
            >
                <div
                    className={`${classes.content} ${
                        !isClicked ? classes.abbreviatedContent : classes.expandedContent
                    }`}
                >
                    <div className={`${classes.header} ${isClicked && classes[item.status]}`}>
                        <div className={`${classes.statIndicator} ${classes[item.status]}`}></div>
                        <p>{item.title}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RentItem;
