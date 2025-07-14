import { useEffect, useState, useRef, useContext } from "react";

import classes from "./RentItem.module.css";

import RentPaymentsCtx from "../../contexts/RentPaymentsCtx";
import EntityDropdown from "../dropdowns/EntityDropdown";
import ConfirmationModal from "../modals/ConfirmationModal";

const RentItem = ({ item, dayIndex, updateFields, removePayment, handleSaveRentPayment, pushLeft, pushUp }) => {
    const { ctxUpdatePayment } = useContext(RentPaymentsCtx);

    const itemBoxRef = useRef(null);

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isClicked, setIsClicked] = useState(String(item.id).startsWith("temp"));
    const [isAbsolute, setIsAbsolute] = useState(String(item.id).startsWith("temp"));
    const [isChanged, setIsChanged] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [inputFields, setInputFields] = useState({
        status: item.status,
        amount: item.amount,
        entity: item.entity,
    });

    const pushStyle = {
        top: pushUp && isClicked ? "-8.1rem" : "0",
        left: pushLeft && isClicked ? "-11.6rem" : "0",
    };

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

        if (String(item.id).startsWith("temp")) {
            removePayment(dayIndex, item.id);
        } else if (isChanged) {
            updateFields(dayIndex, item.id, inputFields);
            setIsChanged(false);
            ctxUpdatePayment({ ...item, ...inputFields });
        }
    };

    const handleSave = () => {
        if (inputFields.amount != "" && inputFields.entity != "" && inputFields.status != "") {
            const savePayment = {
                ...inputFields,
                date: item.date,
            };
            handleSaveRentPayment(dayIndex, savePayment);
            handleClose();
            setErrorText("");
        } else {
            setErrorText("Please fill all fields or cancel");
        }
    };

    const handleDelete = () => {
        setIsConfirmModalOpen(true);
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

    const onConfirmModalAction = () => {
        removePayment(dayIndex, item.id);
        ctxUpdatePayment({ id: item.id, is_deleted: true });
        setIsConfirmModalOpen(false);
    };

    const onCancelModalAction = () => {
        setIsConfirmModalOpen(false);
    };

    return (
        <>
            {isConfirmModalOpen && (
                <ConfirmationModal
                    text={{
                        msg: "Are you sure you wish to delete this Payment?",
                        confirm_txt: "Delete",
                        cancel_txt: "Cancel Deletion",
                    }}
                    onConfirm={onConfirmModalAction}
                    onCancel={onCancelModalAction}
                />
            )}

            <div className={classes.mainContainer}>
                {isAbsolute && <div className={classes.placeholder} />}
                <div
                    className={`${classes.itemBox} ${isClicked && classes.clicked} ${isAbsolute && classes.absPos}`}
                    onClick={handleOpen}
                    style={pushStyle}
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
                                {inputFields.entity?.name ? inputFields.entity.name : "Unknown"} paid $
                                {inputFields.amount ? inputFields.amount : 0.0}
                            </p>
                        </div>
                        <div className={`${classes.rentInfo} ${!isClicked && classes.noDisplay}`}>
                            <div className={classes.statTags}>
                                <p
                                    className={`${
                                        inputFields.status == "scheduled" ? classes.scheduled : classes.stat0
                                    }`}
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
                                <input
                                    type="text"
                                    name="amount"
                                    value={inputFields.amount}
                                    onChange={handleInputChange}
                                />
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
                            <div className={classes.tools}>
                                <p>{errorText}</p>
                                <div className={classes.buttons}>
                                    {!String(item.id).startsWith("temp") && (
                                        <button
                                            className={`${isClicked && classes[inputFields.status]}`}
                                            onClick={handleDelete}
                                        >
                                            Delete
                                        </button>
                                    )}
                                    <button
                                        className={`${isClicked && classes[inputFields.status]}`}
                                        onClick={handleClose}
                                    >
                                        {String(item.id).startsWith("temp") ? "Cancel" : "Close"}
                                    </button>

                                    {String(item.id).startsWith("temp") && (
                                        <button
                                            className={`${isClicked && classes[inputFields.status]}`}
                                            onClick={handleSave}
                                        >
                                            Save
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RentItem;
