import { useEffect, useState, useRef } from "react";
import classes from "./RentItem.module.css";
import EntityDropdown from "../dropdowns/EntityDropdown";

const RentItem = ({ item, dayIndex, updateFields }) => {
    const itemBoxRef = useRef(null);

    const [isClicked, setIsClicked] = useState(false);
    const [isAbsolute, setIsAbsolute] = useState(false);
    const [isChanged, setIsChanged] = useState(false);
    const [inputFields, setInputFields] = useState({
        status: item.status,
        amount: item.amount,
        entity: item.entity,
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

        setIsChanged(true);
    };

    const handleOpen = () => {
        if (!isClicked) {
            setIsClicked(true);
            setIsAbsolute(true);
        }
    };

    const handleClose = () => {
        if (isClicked) {
            setIsClicked(false);
            setTimeout(() => {
                setIsAbsolute(false);
            }, 400);
        }

        if (isChanged) {
            updateFields(dayIndex, item.id, inputFields);
            setIsChanged(false);
        }
    };

    const handleTagClick = (statName) => {
        setInputFields((prev) => ({ ...prev, status: statName }));
        setIsChanged(true);
    };

    const handleEntityChange = (entity) => {
        setInputFields((prev) => ({ ...prev, entity: entity }));
        setIsChanged(true);
    };

    // Ensures click spams do not cause isAbsolute to be false when isClicked is true
    useEffect(() => {
        if (isAbsolute !== isClicked) {
            setIsAbsolute(isClicked);
        }
    }, [isAbsolute]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (itemBoxRef.current && !itemBoxRef.current.contains(event.target) && isClicked) {
                handleClose();
            }
        };

        // Clean up
        if (isClicked) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isClicked]);

    return (
        <div className={classes.mainContainer}>
            {isAbsolute && <div className={classes.placeholder} />}
            <div
                className={`${classes.itemBox} ${isClicked && classes.clicked} ${isAbsolute && classes.absPos}`}
                onClick={handleOpen}
                ref={itemBoxRef}
            >
                <div
                    className={`${classes.content} ${
                        !isClicked ? classes.abbreviatedContent : classes.expandedContent
                    }`}
                >
                    <div className={`${classes.header} ${isClicked && classes[inputFields.status]}`}>
                        <div className={`${classes.statIndicator} ${classes[inputFields.status]}`}></div>
                        <p>
                            {item.entity.name} paid {item.amount}
                        </p>
                    </div>
                    <div className={`${classes.rentInfo} ${!isClicked && classes.noDisplay}`}>
                        <div className={classes.statTags}>
                            <p
                                className={`${inputFields.status == "scheduled" ? classes.scheduled : classes.stat0}`}
                                onClick={() => handleTagClick("scheduled")}
                            >
                                Scheduled
                            </p>
                            <p
                                className={`${inputFields.status == "due" ? classes.due : classes.stat0}`}
                                onClick={() => handleTagClick("due")}
                            >
                                Due
                            </p>
                            <p
                                className={`${inputFields.status == "paid" ? classes.paid : classes.stat0}`}
                                onClick={() => handleTagClick("paid")}
                            >
                                Paid
                            </p>
                            <p
                                className={`${inputFields.status == "overdue" ? classes.overdue : classes.stat0}`}
                                onClick={() => handleTagClick("overdue")}
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
                            <EntityDropdown
                                initalVal={item.entity}
                                onChange={handleEntityChange}
                                altClass={"altStyle"}
                            />
                        </div>
                        <div className={classes.inputCluster}>
                            <textarea name="description" value={inputFields.payee} onChange={handleInputChange} />
                        </div>
                        <div className={classes.buttons}>
                            <button className={`${isClicked && classes[inputFields.status]}`} onClick={handleClose}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RentItem;
