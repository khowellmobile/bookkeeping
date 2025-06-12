import { useContext, useState } from "react";

import classes from "./AddModalStyle.module.css";

import AccountsCtx from "../../contexts/AccountsCtx";
import BaseAddModal from "./BaseAddModal";
import AddInputCluster from "../misc/AddInputCluster";
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
    const [isExpanded, setIsExpanded] = useState(false);

    const hasUnsavedChanges =
        inputFields.name !== "" ||
        inputFields.account_number !== "" ||
        inputFields.type !== "" ||
        inputFields.initial_balance !== "" ||
        inputFields.description !== "";

    const accountTypes = ["Asset", "Bank", "Equity", "Liability"];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputFields((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const addAccount = async () => {
        const accountToAdd = {
            ...inputFields,
            type: inputFields.type.toLowerCase(),
        };

        ctxAddAccount(accountToAdd);
    };

    const handleSaveClick = () => {
        addAccount();
        handleCloseModal();
    };

    const clickTypeHandler = (type) => {
        setInputFields((prev) => ({
            ...prev,
            type: type,
        }));
        setIsExpanded(false);
    };

    return (
        <BaseAddModal
            handleCloseModal={handleCloseModal}
            hasUnsavedChanges={hasUnsavedChanges}
            handleSaveClick={handleSaveClick}
            title="New Account Creation"
        >
            <AddInputCluster
                label="Account Name"
                placeholder="Enter account name (e.g., Checking, Savings, Credit Card)"
                name="name"
                value={inputFields.name}
                onChange={handleInputChange}
            />
            <AddInputCluster
                label="Account Number"
                placeholder="Enter account number (optional)"
                name="account_number"
                value={inputFields.account_number}
                onChange={handleInputChange}
            />
            <div className={classes.inputCluster}>
                <p className={classes.label}>Account Type</p>
                <div className={classes.typeDiv} onClick={() => setIsExpanded((prev) => !prev)}>
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
            <AddInputCluster
                label="Initial Balance"
                placeholder="Enter starting balance (e.g., 0.00)"
                name="initial_balance"
                value={inputFields.initial_balance}
                onChange={handleInputChange}
            />
            <textarea
                value={inputFields.description}
                className={classes.textArea}
                name="description"
                onChange={handleInputChange}
            ></textarea>
        </BaseAddModal>
    );
};

export default AddAccountModal;
