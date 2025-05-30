import { useState } from "react";
import classes from "./AddEntityModal.module.css";

const AddEntityModal = ({ setEntities, handleCloseModal }) => {
    const [name, setName] = useState("");
    const [company, setCompany] = useState("");
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");

    const handleSaveClick = () => {
        console.log("saved");
    };

    return (
        <div className={classes.modalOverlay}>
            <div className={classes.mainContainer}>
                <section className={classes.top}>
                    <h2>New Account Creation</h2>
                    <div className={classes.seperatorH} />
                    <div className={classes.inputCluster}>
                        <p className={classes.label}>Entity Name</p>
                        <input
                            type="text"
                            placeholder="Enter entity name (e.g., Checking, Savings, Credit Card)"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className={classes.inputCluster}>
                        <p className={classes.label}>Account Number</p>
                        <input
                            type="text"
                            placeholder="Enter entity company (optional)"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                        />
                    </div>
                    <div className={classes.inputCluster}>
                        <p className={classes.label}>Account Number</p>
                        <input
                            type="text"
                            placeholder="Enter entity address (optional)"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <div className={classes.inputCluster}>
                        <p className={classes.label}>Initial Balance</p>
                        <input
                            type="text"
                            placeholder="Enter entity phone number (optional)"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>
                    <div className={classes.inputCluster}>
                        <p className={classes.label}>Initial Balance</p>
                        <input
                            type="text"
                            placeholder="Enter entity email (optional)"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </section>
                <section className={classes.buttons}>
                    <button onClick={handleSaveClick}>Save & Close</button>
                    <button onClick={handleCloseModal}>Close</button>
                </section>
            </div>
        </div>
    );
};

export default AddEntityModal;
