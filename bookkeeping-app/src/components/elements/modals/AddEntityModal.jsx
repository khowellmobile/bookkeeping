import { useContext, useState } from "react";

import EntitiesCtx from "../../contexts/EntitiesCtx";

import ConfirmationModal from "./ConfirmationModal";

import classes from "./AddEntityModal.module.css";

const AddEntityModal = ({ handleCloseModal }) => {
    const { ctxAddEntity } = useContext(EntitiesCtx);

    const [name, setName] = useState("");
    const [company, setCompany] = useState("");
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSaveClick = async () => {
        const entityToAdd = {
            name: name,
            company: company,
            address: address,
            phone_number: phoneNumber,
            email: email,
            description: "",
        };

        ctxAddEntity(entityToAdd);
        handleCloseModal();
    };

    const handleCancelClose = () => {
        if (name !== "" || company !== "" || address !== "" || phoneNumber !== "" || email !== "") {
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
                        msg: "You are above to leave without saving.",
                        confirm_txt: "Leave",
                        cancel_txt: "Stay",
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
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className={classes.inputCluster}>
                            <p className={classes.label}>Entity Company</p>
                            <input
                                type="text"
                                placeholder="Enter Entity Company (optional)"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                            />
                        </div>
                        <div className={classes.inputCluster}>
                            <p className={classes.label}>Entity Address</p>
                            <input
                                type="text"
                                placeholder="Enter Entity Address (optional)"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                        <div className={classes.inputCluster}>
                            <p className={classes.label}>Entity Phone Number</p>
                            <input
                                type="text"
                                placeholder="Enter Entity Phone Number (optional)"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </div>
                        <div className={classes.inputCluster}>
                            <p className={classes.label}>Entity Email</p>
                            <input
                                type="text"
                                placeholder="Enter Entity Email (optional)"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
