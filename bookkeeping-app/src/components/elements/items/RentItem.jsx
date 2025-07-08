import { useEffect, useState } from "react";
import classes from "./RentItem.module.css";
import EntityDropdown from "../dropdowns/EntityDropdown";

const RentItem = ({ item, dayIndex, changeStatus }) => {
    const [isClicked, setIsClicked] = useState(false);
    const [isAbsolute, setIsAbsolute] = useState(false);
    const [inputFields, setInputFields] = useState({
        amount: item.amount,
        payee: "John Michals",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "isRecurring") {
            setInputFields((prev) => ({
                ...prev,
                [name]: e.target.checked,
            }));
        } else {
            setInputFields((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleOpen = () => {
        if (!isClicked) {
            setIsClicked(true);
            setIsAbsolute(true);
        }
    };

    const handleClose = () => {
        /* if (isClicked) {
            setIsClicked(false);
            setTimeout(() => {
                setIsAbsolute(false);
            }, 400);
        } */
    };

    const handleTagClick = (statName) => {
        changeStatus(dayIndex, item.id, statName);
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
                onClick={handleOpen}
                onMouseLeave={handleClose}
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
                    <div className={`${classes.rentInfo} ${!isClicked && classes.noDisplay}`}>
                        <div className={classes.statTags}>
                            <p
                                className={`${item.status == "stat1" ? classes.stat1 : classes.stat0}`}
                                onClick={() => handleTagClick("stat1")}
                            >
                                Scheduled
                            </p>
                            <p
                                className={`${item.status == "stat2" ? classes.stat2 : classes.stat0}`}
                                onClick={() => handleTagClick("stat2")}
                            >
                                Due
                            </p>
                            <p
                                className={`${item.status == "stat3" ? classes.stat3 : classes.stat0}`}
                                onClick={() => handleTagClick("stat3")}
                            >
                                Paid
                            </p>
                            <p
                                className={`${item.status == "stat4" ? classes.stat4 : classes.stat0}`}
                                onClick={() => handleTagClick("stat4")}
                            >
                                Overdue
                            </p>
                        </div>
                        <div className={classes.inputCluster}>
                            <p className={classes.label}>Amount</p>
                            <input type="text" name="amount" value={inputFields.amount} onChange={handleInputChange} />
                        </div>
                        <div className={classes.inputCluster}>
                            <p className={classes.label}>Payee</p>
                            <input type="text" name="payee" value={inputFields.payee} onChange={handleInputChange} />
                        </div>
                        <div className={classes.inputCluster}>
                            {/* <p className={classes.label}>Payee</p> */}
                            <textarea name="description" value={inputFields.payee} onChange={handleInputChange} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RentItem;
