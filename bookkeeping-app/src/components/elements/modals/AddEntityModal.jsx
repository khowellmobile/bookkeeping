import { useContext, useState } from "react";

import EntitiesCtx from "../../contexts/EntitiesCtx";
import BaseAddModal from "./BaseAddModal";
import AddInputCluster from "../misc/AddInputCluster";

const AddEntityModal = ({ handleCloseModal }) => {
    const { ctxAddEntity } = useContext(EntitiesCtx);

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
        ctxAddEntity(inputFields);
        handleCloseModal();
    };

    return (
        <BaseAddModal
            handleCloseModal={handleCloseModal}
            hasUnsavedChanges={hasUnsavedChanges}
            handleSaveClick={handleSaveClick}
            title="New Entity Creation"
        >
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
                placeholder="Enter Entity Phone Number (optional)"
                name="phone_number"
                value={inputFields.phone_number}
                onChange={handleInputChange}
            />
            <AddInputCluster
                type="email"
                label="Entity Email"
                placeholder="Enter Entity Email (optional)"
                name="email"
                value={inputFields.email}
                onChange={handleInputChange}
            />
        </BaseAddModal>
    );
};

export default AddEntityModal;
