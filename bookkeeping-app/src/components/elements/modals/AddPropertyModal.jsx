import { useContext, useState } from "react";
import classes from "./AddPropertyModal.module.css";

import PropertiesCtx from "../../contexts/PropertiesCtx";
import ConfirmationModal from "./ConfirmationModal";
import upChevIcon from "../../../assets/chevron-up-icon.svg";
import downChevIcon from "../../../assets/chevron-down-icon.svg";

const AddPropertyModal = ({ handleCloseModal }) => {
    const { ctxAddProperty } = useContext(PropertiesCtx);

    const [inputFields, setInputFields] = useState({
        name: "",
        address: "",
        property_type: "",
        rent: "",
        number_of_units: "",
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const propertyTypes = ["Commercial", "Residential", "Multi-Unit"];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputFields((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSaveClick = () => {
        addProperty();
        handleCloseModal();
    };

    const addProperty = async () => {
        const propertyToAdd = {
            ...inputFields,
            property_type: inputFields.property_type.toLowerCase(),
        };

        ctxAddProperty(propertyToAdd);
    };

    const clickTypeHandler = (type) => {
        setInputFields((prev) => ({
            ...prev,
            property_type: type,
        }));
        setIsExpanded(false);
    };

    const handleCancelClose = () => {
        if (
            inputFields.name !== "" ||
            inputFields.address !== "" ||
            inputFields.property_type !== "" ||
            inputFields.rent !== "" ||
            inputFields.number_of_units !== ""
        ) {
            setIsModalOpen(true);
        } else {
            handleCloseModal();
        }
    };

    const onConfirm = () => {
        setIsModalOpen(false);
        handleCloseModal();
    };

    const onCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            {isModalOpen && (
                <ConfirmationModal
                    text={{
                        msg: "You have unsaved changes. Are you sure you want to discard them?",
                        confirm_txt: "Discard Changes",
                        cancel_txt: "Keep Editing",
                    }}
                    onConfirm={onConfirm}
                    onCancel={onCancel}
                />
            )}
            <div className={classes.modalOverlay}>
                <div className={classes.mainContainer}>
                    <section className={classes.top}>
                        <h2>New Property Creation</h2>
                        <div className={classes.seperatorH} />
                        <div className={classes.inputCluster}>
                            <p className={classes.label}>Property Name</p>
                            <input
                                type="text"
                                placeholder="Enter property name (e.g., West House, Green Marsh 024, Beach Rental)"
                                name="name"
                                value={inputFields.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={classes.inputCluster}>
                            <p className={classes.label}>Property Address</p>
                            <input
                                type="text"
                                placeholder="Enter property Address (e.g., 123 Example St, City State 12345)"
                                name="address"
                                value={inputFields.address}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={classes.inputCluster}>
                            <p className={classes.label}>Property Type</p>
                            <div className={classes.accountTypeDiv} onClick={() => setIsExpanded((prev) => !prev)}>
                                {inputFields.property_type ? (
                                    <p>{inputFields.property_type}</p>
                                ) : (
                                    <p className={classes.placeholder}>Select Property type</p>
                                )}

                                <img src={isExpanded ? upChevIcon : downChevIcon} className={classes.icon} />
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
                        <div className={classes.inputCluster}>
                            <p className={classes.label}>Property Rent</p>
                            <input
                                type="text"
                                placeholder="Enter Rent Amount (optional)"
                                name="rent"
                                value={inputFields.rent}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={classes.inputCluster}>
                            <p className={classes.label}>Property Amount of Units</p>
                            <input
                                type="text"
                                placeholder="Enter Unit Amount"
                                name="number_of_units"
                                value={inputFields.number_of_units}
                                onChange={handleInputChange}
                            />
                        </div>
                    </section>
                    <section className={classes.buttons}>
                        <button onClick={handleSaveClick}>Save & Close</button>
                        <button onClick={handleCancelClose}>Close</button>
                    </section>
                </div>
            </div>
        </>
    );
};

export default AddPropertyModal;
