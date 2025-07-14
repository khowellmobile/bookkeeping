import { useState } from "react";

import classes from "./AddModalStyle.module.css";
import specClasses from "./AddRentModal.module.css"

import BaseAddModal from "./BaseAddModal";
import AddInputCluster from "../misc/AddInputCluster";
import EntityEntryDropdown from "../dropdowns/EntityEntryDropdown";
import EntityDropdown from "../dropdowns/EntityDropdown";

const AddRentModal = ({ handleCloseModal }) => {
    const [inputFields, setInputFields] = useState({
        entity: "",
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

    const handleEntitySelect = (entity) => {
        setInputFields((prev) => {
            return { ...prev, entity: entity };
        });
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
                label="Payment Date"
                placeholder="Enter payment date"
                name="date"
                value={inputFields.date}
                onChange={handleInputChange}
            />
            <p className={classes.label}>Payment Made By</p>
            <EntityDropdown onChange={handleEntitySelect} />
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
