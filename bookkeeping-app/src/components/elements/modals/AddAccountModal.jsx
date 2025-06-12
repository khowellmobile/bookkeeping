import { useContext, useEffect, useState } from "react";
import classes from "./AddAccountModal.module.css";

import AccountsCtx from "../../contexts/AccountsCtx";
import ConfirmationModal from "./ConfirmationModal";
import upChevIcon from "../../../assets/chevron-up-icon.svg";
import downChevIcon from "../../../assets/chevron-down-icon.svg";

const AddAccountModal = ({ handleCloseModal }) => {
    const { ctxAddAccount } = useContext(AccountsCtx);
    const [inputFields, setInputFields] = useState({
        name: "",
        type: "",
        initial_balance: "",
        description: "",
        account_number: "",
    });

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isExpanded, setIsExpanded] = useState(false);

    const accountTypes = ["Asset", "Bank", "Equity", "Liability"];

    const handleSaveClick = () => {
        addAccount();
        handleCloseModal();
    };

    const addAccount = async () => {
        const accountToAdd = {
            ...inputFields,
            type: inputFields.type.toLowerCase(),
        };

        ctxAddAccount(accountToAdd);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputFields((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const clickTypeHandler = (type) => {
        setInputFields((prev) => ({
            ...prev,
            type: type,
        }));
        setIsExpanded(false);
    };

    const handleCancelClose = () => {
        if (
            inputFields.name !== "" ||
            inputFields.account_number !== "" ||
            inputFields.type !== "" ||
            inputFields.initial_balance !== "" ||
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
                        <h2>New Account Creation</h2>
                        <div className={classes.seperatorH} />
                        <div className={classes.inputCluster}>
                            <p className={classes.label}>Account Name</p>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter account name (e.g., Checking, Savings, Credit Card)"
                                value={inputFields.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={classes.inputCluster}>
                            <p className={classes.label}>Account Number</p>
                            <input
                                type="text"
                                name="account_number"
                                placeholder="Enter account number (optional)"
                                value={inputFields.account_number}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={classes.inputCluster}>
                            <p className={classes.label}>Account Type</p>
                            <div className={classes.accountTypeDiv} onClick={() => setIsExpanded((prev) => !prev)}>
                                {inputFields?.type ? (
                                    <p>{inputFields.type}</p>
                                ) : (
                                    <p className={classes.placeholder}>Select account type</p>
                                )}

                                <img src={isExpanded ? upChevIcon : downChevIcon} className={classes.icon} />
                            </div>
                            <div className={`${classes.anchor} ${isExpanded ? "" : classes.noDisplay}`}>
                                <div className={classes.dropdown}>
                                    {accountTypes.map((type, index) => {
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
                            <p className={classes.label}>Initial Balance</p>
                            <input
                                type="text"
                                name="initial_balance"
                                placeholder="Enter starting balance (e.g., 0.00)"
                                value={inputFields.initial_balance}
                                onChange={handleInputChange}
                            />
                        </div>
                        <textarea
                            value={inputFields.description}
                            name="description"
                            onChange={handleInputChange}
                        ></textarea>
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

export default AddAccountModal;
