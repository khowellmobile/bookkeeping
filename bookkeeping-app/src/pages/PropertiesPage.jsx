import classes from "./PropertiesPage.module.css";

import { useState, useContext, useEffect, useMemo, act } from "react";

import PropertiesCtx from "../components/contexts/PropertiesCtx";
import ConfirmationModal from "../components/elements/modals/ConfirmationModal";

import penIcon from "../assets/pen-icon.svg";
import AddPropertyModal from "../components/elements/modals/AddPropertyModal";

const PropertiesPage = () => {
    const { ctxPropertyList, ctxUpdateProperty, ctxAddProperty } = useContext(PropertiesCtx);

    const [activeProperty, setActiveProperty] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [inputFields, setInputFields] = useState({
        name: "",
        address: "",
        property_type: "",
        number_of_units: "",
        rent: "",
        is_active: "",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState({
        type: null,
        payload: null,
    });

    // Filtering by search term
    useEffect(() => {
        if (ctxPropertyList) {
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            const filtered = ctxPropertyList.filter((property) =>
                property.name.toLowerCase().includes(lowercasedSearchTerm)
            );
            setFilteredProperties(filtered);
        }
    }, [searchTerm, ctxPropertyList]);

    // Setting fields to selected entity
    const focusProperty = (property) => {
        if (property) {
            setActiveProperty(property);
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
        ctxUpdateProperty({ id: activeProperty.id, ...inputFields });
        setIsEditing(false);
    };

    const handleDeleteClick = () => {
        setIsModalOpen(true);
        setConfirmAction({
            type: "delete_entry",
            payload: null,
        });
    };

    return (
        <>
            {isModalOpen &&
                confirmAction.type && ( // Only render if modal is open and type is set
                    <ConfirmationModal
                        text={getModalText()}
                        onConfirm={onConfirmModalAction}
                        onCancel={onCancelModalAction}
                    />
                )}

            {isAddModalOpen && <AddPropertyModal handleCloseModal={() => setIsAddModalOpen(false)} />}

            <div className={classes.mainContainer}>
                <div className={classes.searchBox}>
                    <div className={classes.searchBoxTools}>
                        <button className={classes.button} onClick={() => setIsAddModalOpen(true)}>
                            Add Property
                        </button>
                    </div>
                    <input
                        type="text"
                        className={classes.propertySearch}
                        placeholder="Search..."
                        spellCheck="false"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                        }}
                    ></input>
                    <div className={classes.propertyListing}>
                        {filteredProperties && filteredProperties.length > 0 ? (
                            filteredProperties.map((property, index) => (
                                <p key={index} onClick={() => handlePropertyClick(property)}>
                                    {property.name}
                                </p>
                            ))
                        ) : (
                            <p>No matching properties found.</p>
                        )}
                    </div>
                </div>
                <div className={classes.contentBox}>
                    <div className={classes.propertyInfo}>
                        <div className={`${classes.header} ${isEditing ? classes.editing : ""}`}>
                            <input
                                type="text"
                                name="name"
                                value={inputFields.name}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
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
                                <div className={`${classes.cluster} ${isEditing ? classes.editing : ""}`}>
                                    <p>Address:</p>
                                    <input
                                        type="text"
                                        name="address"
                                        value={inputFields.address}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className={`${classes.cluster} ${isEditing ? classes.editing : ""}`}>
                                    <p>Property Type:</p>
                                    <input
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
                            <div className={classes.financialInfo}>
                                <h3>Financial Information</h3>
                                <div className={`${classes.cluster} ${isEditing ? classes.editing : ""}`}>
                                    <p>Rent:</p>
                                    <input
                                        type="text"
                                        name="rent"
                                        value={inputFields.rent}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className={`${classes.cluster} ${isEditing ? classes.editing : ""}`}>
                                    <p>Units:</p>
                                    <input
                                        type="text"
                                        name="number_of_units"
                                        value={inputFields.number_of_units}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <p>What goes here?</p>
                </div>
            </div>
        </>
    );
};

export default PropertiesPage;
