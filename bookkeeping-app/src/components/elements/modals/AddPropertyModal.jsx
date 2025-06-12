import { useContext, useState } from "react";
import classes from "./AddPropertyModal.module.css";

import PropertiesCtx from "../../contexts/PropertiesCtx";
import ConfirmationModal from "./ConfirmationModal";
import upChevIcon from "../../../assets/chevron-up-icon.svg";
import downChevIcon from "../../../assets/chevron-down-icon.svg";

const AddPropertyModal = ({ handleCloseModal }) => {
    const { ctxAddProperty } = useContext(PropertiesCtx);

    const [name, setName] = useState("");
    const [address, setAddress] = useState("")
    const [type, setType] = useState("");
    const [rent, setRent] = useState("");
    const [units, setUnits] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const propertyTypes = ["Commercial", "Residential", "Multi-Unit"];

    const handleSaveClick = () => {
        addProperty();
        handleCloseModal();
    };

    const addProperty = async () => {
        const propertyToAdd = {
            name: name,
            address: address,
            property_type: type.toLowerCase(),
            rent: rent,
            number_of_units: units,
        };

        ctxAddProperty(propertyToAdd);
    };

    const clickTypeHandler = (type) => {
        setType(type);
        setIsExpanded(false);
    };

    const handleCancelClose = () => {
        if (name !== "" || address!== "" || type !== "" || rent !== "" || units !== "") {
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
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className={classes.inputCluster}>
                            <p className={classes.label}>Property Address</p>
                            <input
                                type="text"
                                placeholder="Enter property Address (e.g., 123 Example St, City State 12345)"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                        <div className={classes.inputCluster}>
                            <p className={classes.label}>Property Type</p>
                            <div className={classes.accountTypeDiv} onClick={() => setIsExpanded((prev) => !prev)}>
                                {type ? <p>{type}</p> : <p className={classes.placeholder}>Select Property type</p>}

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
                                value={rent}
                                onChange={(e) => setRent(e.target.value)}
                            />
                        </div>
                        <div className={classes.inputCluster}>
                            <p className={classes.label}>Property Amount of Units</p>
                            <input
                                type="text"
                                placeholder="Enter Unit Amount"
                                value={units}
                                onChange={(e) => setUnits(e.target.value)}
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
