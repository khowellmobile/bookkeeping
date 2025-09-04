import { useContext, useState } from "react";

import classes from "./AddModalStyle.module.css";

import EntitiesCtx from "../../contexts/EntitiesCtx";
import BaseAddModal from "./BaseAddModal";
import AddInputCluster from "../misc/AddInputCluster";

const AddEntityModal = ({ handleCloseModal }) => {
    const { ctxAddEntity } = useContext(EntitiesCtx);
    const [errorText, setErrorText] = useState("");

    const [inputFields, setInputFields] = useState({
        name: "",
        company: "",
        address: "",
        phone_number: "",
        email: "",
        description: "",
    });

    const hasUnsavedChanges =
        inputFields.name !== "" ||
        inputFields.company !== "" ||
        inputFields.address !== "" ||
        inputFields.phone_number !== "" ||
        inputFields.email !== "" ||
        inputFields.description !== "";

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputFields((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSaveClick = async () => {
        if (validateInputs()) {
            ctxAddEntity(inputFields);
            setErrorText("");
            handleCloseModal();
        }
    };

    const validateInputs = () => {
        let errTxt = "";

        const phoneRegex = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (inputFields.name.trim() === "") {
            errTxt += "Entity Name cannot be empty.\n";
        }

        if (inputFields.phone_number !== "" && !phoneRegex.test(inputFields.phone_number)) {
            errTxt += "Phone Number must be 10 digits.\n";
        }

        if (inputFields.email !== "" && !emailRegex.test(inputFields.email)) {
            errTxt += "Email must follow standard format. \n";
        }

        setErrorText(errTxt);
        return errTxt === "";
    };

    return (
        <BaseAddModal
            handleCloseModal={handleCloseModal}
            hasUnsavedChanges={hasUnsavedChanges}
            handleSaveClick={handleSaveClick}
            title="New Entity Creation"
        >
            <span className={classes.errors}>
                {errorText.split("\n").map((str, index) => {
                    return <p key={index}>{str}</p>;
                })}
            </span>
            <AddInputCluster
                type="text"
                label="Entity Name"
                placeholder="Enter Entity Name"
                name="name"
                value={inputFields.name}
                onChange={handleInputChange}
                isOptional={false}
            />
            <AddInputCluster
                type="text"
                label="Entity Company"
                placeholder="Enter Entity Company (optional)"
                name="company"
                value={inputFields.company}
                onChange={handleInputChange}
            />
            <AddInputCluster
                type="text"
                label="Entity Address"
                placeholder="Enter Entity Address (optional)"
                name="address"
                value={inputFields.address}
                onChange={handleInputChange}
            />
            <AddInputCluster
                type="phoneNumber"
                label="Entity Phone Number"
                placeholder="eg. (123) 123-4567 (optional)"
                name="phone_number"
                value={inputFields.phone_number}
                onChange={handleInputChange}
            />
            <AddInputCluster
                type="email"
                label="Entity Email"
                placeholder="eg. Example@gmail.com (optional)"
                name="email"
                value={inputFields.email}
                onChange={handleInputChange}
            />
        </BaseAddModal>
    );
};

export default AddEntityModal;
