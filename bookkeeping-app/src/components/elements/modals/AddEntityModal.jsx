import { useContext, useState } from "react";

import EntitiesCtx from "../../contexts/EntitiesCtx";

import ConfirmationModal from "./ConfirmationModal";

import classes from "./AddEntityModal.module.css";

const AddEntityModal = ({ handleCloseModal }) => {
    const { ctxAddEntity } = useContext(EntitiesCtx);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inputFields, setInputFields] = useState({
        name: "",
        company: "",
        address: "",
        phone_number: "",
        email: "",
        description: "",
    });

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

    const handleCancelClose = () => {
        if (
            inputFields.name !== "" ||
            inputFields.company !== "" ||
            inputFields.address !== "" ||
            inputFields.phone_number !== "" ||
            inputFields.email !== "" ||
            inputFields.description !== ""
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
                        <h2>New Entity Creation</h2>
                        <div className={classes.seperatorH} />
                        <div className={classes.inputCluster}>
                            <p className={classes.label}>Entity Name</p>
                            <input
                                type="text"
                                placeholder="Enter Entity Name"
                                name="name"
                                value={inputFields.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={classes.inputCluster}>
                            <p className={classes.label}>Entity Company</p>
                            <input
                                type="text"
                                placeholder="Enter Entity Company (optional)"
                                name="company"
                                value={inputFields.company}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={classes.inputCluster}>
                            <p className={classes.label}>Entity Address</p>
                            <input
                                type="text"
                                placeholder="Enter Entity Address (optional)"
                                name="address"
                                value={inputFields.address}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={classes.inputCluster}>
                            <p className={classes.label}>Entity Phone Number</p>
                            <input
                                type="text"
                                placeholder="Enter Entity Phone Number (optional)"
                                name="phone_number"
                                value={inputFields.phone_number}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={classes.inputCluster}>
                            <p className={classes.label}>Entity Email</p>
                            <input
                                type="text"
                                placeholder="Enter Entity Email (optional)"
                                name="email"
                                value={inputFields.email}
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

export default AddEntityModal;
