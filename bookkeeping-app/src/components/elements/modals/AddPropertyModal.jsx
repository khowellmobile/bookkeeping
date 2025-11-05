import { useContext, useState } from "react";

import classes from "./AddModalStyle.module.css";

import PropertiesCtx from "../../contexts/PropertiesCtx";
import BaseAddModal from "./BaseAddModal";
import upChevIcon from "../../../assets/chevron-up-icon.svg";
import downChevIcon from "../../../assets/chevron-down-icon.svg";
import AddInputCluster from "../utilities/AddInputCluster";

const AddPropertyModal = ({ handleCloseModal }) => {
    const { ctxAddProperty } = useContext(PropertiesCtx);

    const [inputFields, setInputFields] = useState({
        name: "",
        address: "",
        property_type: "",
        rent: "",
        number_of_units: "",
    });
    const [isExpanded, setIsExpanded] = useState(false);
    const [errorText, setErrorText] = useState("");

    const hasUnsavedChanges =
        inputFields.name !== "" ||
        inputFields.address !== "" ||
        inputFields.property_type !== "" ||
        inputFields.rent !== "" ||
        inputFields.number_of_units !== "";

    const propertyTypes = ["Commercial", "Residential", "Multi-Unit"];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputFields((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const addProperty = async () => {
        const propertyToAdd = {
            ...inputFields,
            property_type: inputFields.property_type.toLowerCase(),
        };
        ctxAddProperty(propertyToAdd);
    };

    const handleSaveClick = () => {
        if (validateInputs()) {
            addProperty();
            handleCloseModal();
        }
    };

    const clickTypeHandler = (type) => {
        setInputFields((prev) => ({
            ...prev,
            property_type: type,
        }));
        setIsExpanded(false);
    };

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

        setErrorText(errTxt);
        return errTxt === "";
    };

    return (
        <BaseAddModal
            handleCloseModal={handleCloseModal}
            hasUnsavedChanges={hasUnsavedChanges}
            handleSaveClick={handleSaveClick}
            title="New Property Creation"
        >
            <span className={classes.errors}>
                {errorText.split("\n").map((str, index) => {
                    return <p key={index}>{str}</p>;
                })}
            </span>
            <AddInputCluster
                type="text"
                label="Property Name"
                placeholder="Enter property name (e.g., West House, Green Marsh 024, Beach Rental)"
                name="name"
                value={inputFields.name}
                onChange={handleInputChange}
                isOptional={false}
            />
            <AddInputCluster
                type="text"
                label="Property Address"
                placeholder="Enter property Address (e.g., 123 Example St, City State 12345)"
                name="address"
                value={inputFields.address}
                onChange={handleInputChange}
                isOptional={false}
            />
            <div className={classes.inputCluster}>
                <p className={classes.label}>Property Type</p>
                <div className={classes.typeDiv} onClick={() => setIsExpanded((prev) => !prev)}>
                    {inputFields.property_type ? (
                        <p>{inputFields.property_type}</p>
                    ) : (
                        <p className={classes.placeholder}>Select Property type</p>
                    )}

                    <img src={isExpanded ? upChevIcon : downChevIcon} className={classes.icon} alt="chevron icon" />
                </div>
                <div className={`${classes.anchor} ${isExpanded ? "" : classes.noDisplay}`}>
                    <div className={classes.dropdown}>
                        {propertyTypes.map((type, index) => {
                            return (
                                <p key={index} onClick={() => clickTypeHandler(type)}>
                                    {type}
                                </p>
                            );
                        })}
                    </div>
                </div>
            </div>
            <AddInputCluster
                type="number"
                label="Property Rent"
                placeholder="Enter Rent Amount (optional)"
                name="rent"
                value={inputFields.rent}
                onChange={handleInputChange}
            />
            <AddInputCluster
                type="number"
                label="Property Amount of Units"
                placeholder="Enter Unit Amount"
                name="number_of_units"
                value={inputFields.number_of_units}
                onChange={handleInputChange}
                isOptional={false}
            />
        </BaseAddModal>
    );
};

export default AddPropertyModal;
