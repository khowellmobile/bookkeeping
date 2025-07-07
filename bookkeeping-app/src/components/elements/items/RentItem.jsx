import { useEffect, useState } from "react";
import classes from "./RentItem.module.css";
import AddInputCluster from "../misc/AddInputCluster";

const RentItem = ({ item }) => {
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
                    <div className={`${classes.rentInfo} ${!isClicked && classes.noDisplay}`}>
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
