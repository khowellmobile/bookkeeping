import { useState, useContext, useEffect } from "react";

import classes from "./PropertiesPage.module.css";

import PropertiesCtx from "../components/contexts/PropertiesCtx";
import ConfirmationModal from "../components/elements/modals/ConfirmationModal";
import penIcon from "../assets/pen-icon.svg";
import AddPropertyModal from "../components/elements/modals/AddPropertyModal";
import SearchBox from "../components/elements/misc/SearchBox";
import RentInformation from "../components/elements/misc/RentInformation";
import Input from "../components/elements/misc/Input";

const PropertiesPage = () => {
    const { ctxPropertyList, ctxUpdateProperty, setCtxActiveProperty, ctxActiveProperty } = useContext(PropertiesCtx);

    const [activeProperty, setActiveProperty] = useState("");
    const [inputFields, setInputFields] = useState({
        name: "",
        address: "",
        property_type: "",
        number_of_units: "",
        rent: "",
        is_active: "",
    });
    const [errorText, setErrorText] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState({
        type: null,
        payload: null,
    });

    // Setting fields to selected entity
    const focusProperty = (property) => {
        if (property) {
            setActiveProperty(property);
            setCtxActiveProperty(property);
            setInputFields({
                name: property.name || "",
                address: property.address || "",
                property_type: property.property_type || "",
                number_of_units: property.number_of_units || "",
                rent: property.rent || "",
                is_active: property.is_active || "",
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputFields((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const isPropertyChanged = () => {
        if (!activeProperty) {
            return false;
        }

        return (
            inputFields.name != activeProperty.name ||
            inputFields.address != activeProperty.address ||
            inputFields.property_type != activeProperty.property_type ||
            inputFields.number_of_units != activeProperty.number_of_units ||
            inputFields.rent != activeProperty.rent ||
            inputFields.is_active != activeProperty.is_active
        );
    };

    const onConfirmModalAction = () => {
        setIsModalOpen(false);
        switch (confirmAction.type) {
            case "switch_active":
                focusProperty(confirmAction.payload);
                return;
            case "delete_entry":
                ctxUpdateProperty({ id: activeProperty.id, is_deleted: true });
                return;
            default:
        }
    };

    const onCancelModalAction = () => {
        setIsModalOpen(false);
        setConfirmAction({ type: null, payload: null });
    };

    const getModalText = () => {
        switch (confirmAction.type) {
            case "switch_active":
                return {
                    msg: "You have unsaved changes. Are you sure you want to discard them?",
                    confirm_txt: "Discard Changes",
                    cancel_txt: "Keep Editing",
                };
            case "delete_entry":
                return {
                    msg: "Are you sure you wish to delete this Property?",
                    confirm_txt: "Delete",
                    cancel_txt: "Cancel Deletion",
                };
            default:
                return { msg: "", confirm_txt: "", cancel_txt: "" };
        }
    };

    const handlePropertyClick = (property) => {
        if (isPropertyChanged()) {
            setIsModalOpen(true);
            setConfirmAction({
                type: "switch_active",
                payload: property,
            });
        } else {
            focusProperty(property);
        }
    };

    const handleSaveClick = () => {
        if (validateInputs()) {
            ctxUpdateProperty({ id: activeProperty.id, ...inputFields });
            setIsEditing(false);
        }
    };

    const handleDeleteClick = () => {
        setIsModalOpen(true);
        setConfirmAction({
            type: "delete_entry",
            payload: null,
        });
    };

    useEffect(() => {
        focusProperty(ctxActiveProperty);
    }, []);

    const validateInputs = () => {
        let errTxt = "";

        if (inputFields.name.trim() === "") {
            errTxt += "Property Name cannot be empty.\n";
        }

        if (inputFields.address.trim() === "") {
            errTxt += "Property Address cannot be empty.\n";
        }

        if (inputFields.rent.trim() !== "" && isNaN(Number(inputFields.rent))) {
            errTxt += "Rent must be a number.\n";
        }

        if (inputFields.number_of_units.trim() === "" || isNaN(Number(inputFields.number_of_units))) {
            errTxt += "Unit amount must be a number and cannot be empty.\n";
        }

        setErrorText("Error: Invalid edits. Check formats and try again.");
        return errTxt === "";
    };

    return (
        <>
            {isModalOpen && confirmAction.type && (
                <ConfirmationModal
                    text={getModalText()}
                    onConfirm={onConfirmModalAction}
                    onCancel={onCancelModalAction}
                />
            )}

            {isAddModalOpen && <AddPropertyModal handleCloseModal={() => setIsAddModalOpen(false)} />}

            <div className={classes.mainContainer}>
                <SearchBox
                    itemName={"Property"}
                    items={ctxPropertyList}
                    onItemClick={handlePropertyClick}
                    onAddButtonClick={() => setIsAddModalOpen(true)}
                />
                <div className={classes.contentBox}>
                    <div className={classes.propertyInfo}>
                        <div className={`${classes.header} ${isEditing ? classes.editing : ""}`}>
                            <Input
                                type="text"
                                name="name"
                                value={inputFields.name}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                            <p className={classes.errorText}>{errorText}</p>
                            {isEditing ? (
                                <div>
                                    <button className={classes.button} onClick={handleSaveClick}>
                                        Save
                                    </button>
                                    <button className={classes.button} onClick={handleDeleteClick}>
                                        Delete
                                    </button>
                                    <button className={classes.button} onClick={() => setIsEditing(false)}>
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {activeProperty && (
                                        <img
                                            src={penIcon}
                                            className={classes.icon}
                                            alt="Icon"
                                            onClick={() => setIsEditing(true)}
                                        />
                                    )}
                                </>
                            )}
                        </div>
                        <div className={classes.inputs}>
                            <div className={classes.genInfo}>
                                <h3>General Information</h3>
                                <div>
                                    <div className={`${classes.cluster} ${isEditing ? classes.editing : ""}`}>
                                        <p>Address:</p>
                                        <Input
                                            type="text"
                                            name="address"
                                            value={inputFields.address}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className={`${classes.cluster} ${isEditing ? classes.editing : ""}`}>
                                        <p>Property Type:</p>
                                        <Input
                                            type="text"
                                            name="property_type"
                                            value={inputFields.property_type}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className={`${classes.cluster} ${isEditing ? classes.editing : ""}`}>
                                        <p>Is Active:</p>
                                        <input
                                            type="text"
                                            name="is_active"
                                            value={inputFields.is_active}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={classes.financialInfo}>
                                <h3>Financial Information</h3>
                                <div>
                                    <div className={`${classes.cluster} ${isEditing ? classes.editing : ""}`}>
                                        <p>Rent:</p>
                                        <Input
                                            type="number"
                                            name="rent"
                                            value={inputFields.rent}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className={`${classes.cluster} ${isEditing ? classes.editing : ""}`}>
                                        <p>Units:</p>
                                        <Input
                                            type="number"
                                            name="number_of_units"
                                            value={inputFields.number_of_units}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <RentInformation />
                </div>
            </div>
        </>
    );
};

export default PropertiesPage;
