import { useState } from "react";

import classes from "./AddModalStyle.module.css";

import BaseAddModal from "./BaseAddModal";
import AddInputCluster from "../misc/AddInputCluster";

const AddRentModal = ({ handleCloseModal }) => {
    const [inputFields, setInputFields] = useState({
        payee: "",
        date: "",
        description: "",
        isRecurring: false,
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

    const hasUnsavedChanges = inputFields.payee !== "" || inputFields.date !== "" || inputFields.description !== "";

    const addAccount = async () => {
        const accountToAdd = {
            ...inputFields,
            type: inputFields.type.toLowerCase(),
        };

        ctxAddAccount(accountToAdd);
    };

    const handleSaveClick = () => {
        addAccount();
        handleCloseModal();
    };

    return (
        <BaseAddModal
            handleCloseModal={handleCloseModal}
            hasUnsavedChanges={hasUnsavedChanges}
            handleSaveClick={handleSaveClick}
            title="Add Payment"
        >
            <AddInputCluster
                label="Payment made by"
                placeholder="Select Payee"
                name="payee"
                value={inputFields.payee}
                onChange={handleInputChange}
            />
            <AddInputCluster
                label="Payment Date"
                placeholder="Enter payment date"
                name="date"
                value={inputFields.date}
                onChange={handleInputChange}
            />
            <AddInputCluster
                label="Payment Description"
                placeholder="Enter Description"
                name="description"
                value={inputFields.description}
                onChange={handleInputChange}
            />
            <div className={classes.radioCluster}>
                <p>Make Monthly Recurring?</p>
                <label className={classes.toggle}>
                    <input
                        type="checkbox"
                        name="isRecurring"
                        value={inputFields.isRecurring}
                        onChange={handleInputChange}
                    />
                    <span className={`${classes.slider} ${classes.round}`}></span>
                </label>
            </div>
        </BaseAddModal>
    );
};

export default AddRentModal;
