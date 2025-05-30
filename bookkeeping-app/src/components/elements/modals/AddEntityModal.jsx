import { useState } from "react";
import classes from "./AddEntityModal.module.css";

const AddEntityModal = ({ setEntities, handleCloseModal }) => {
    const [name, setName] = useState("");
    const [company, setCompany] = useState("");
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");

    const handleSaveClick = async () => {
        const accessToken = localStorage.getItem("accessToken");

        const entityToAdd = {
            name: name,
            company: company,
            address: address,
            phone_number: phoneNumber,
            email: email,
            description: "",
        };

        try {
            const response = await fetch("http://127.0.0.1:8000/api/entities/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(entityToAdd),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Backend Error:", errorData);
            }

            console.log("Entity sent (check your Django backend)");
        } catch (error) {
            console.error("Error sending Account Info:", error);
        }
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
                    <button onClick={handleCloseModal}>Close</button>
                </section>
            </div>
        </div>
    );
};

export default AddEntityModal;
