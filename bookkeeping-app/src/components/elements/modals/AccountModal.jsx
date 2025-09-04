import classes from "./AccountModal.module.css";

import AccountsCtx from "../../contexts/AccountsCtx";
import { useContext, useState } from "react";

import ConfirmationModal from "./ConfirmationModal";

import upChevIcon from "../../../assets/chevron-up-icon.svg";
import downChevIcon from "../../../assets/chevron-down-icon.svg";
import Input from "../misc/Input";

const AccountModal = ({ account, handleCloseModal }) => {
    const { ctxUpdateAccount } = useContext(AccountsCtx);

    const [editedAccount, setEditedAccount] = useState({});
    const [errorText, setErrorText] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [inputFields, setInputFields] = useState({
        name: account.name,
        type: account.type.charAt(0).toUpperCase() + account.type.slice(1),
        initial_balance: account.initial_balance,
        description: account.description,
    });

    const accountTypes = ["Asset", "Bank", "Equity", "Liability"];

    const handleValueChange = (event) => {
        const name = event.target.name;
        const newValue = event.target.value;

        setInputFields((prev) => ({
            ...prev,
            [name]: newValue,
        }));
        setEditedAccount((prev) => ({ ...prev, [name]: newValue }));
    };

    const clickTypeHandler = (type) => {
        setInputFields((prev) => ({
            ...prev,
            type: type,
        }));
        setEditedAccount((prev) => ({ ...prev, type: type.toLowerCase() }));
        setIsExpanded(false);
    };

    const updateAccount = async () => {
        if (validateInputs()) {
            ctxUpdateAccount({ ...editedAccount, id: account.id });
            handleCloseModal();
        }
    };

    const handleCancelClose = () => {
        if (Object.keys(editedAccount).length > 1) {
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

    const validateInputs = () => {
        let errTxt = "";

        if (inputFields.name.trim() === "") {
            errTxt += "Account Name cannot be empty.\n";
        }

        const validAccountTypes = new Set(accountTypes);
        if (!validAccountTypes.has(inputFields.type)) {
            errTxt += "Account type set to unsupported type.\n";
        }

        if (inputFields.initial_balance.trim() === "" || isNaN(Number(inputFields.initial_balance.trim()))) {
            errTxt += "Initial Balance must be a number and cannot be empty.\n";
        }

        setErrorText("Error: Invalid fields. Edits were not saved.");
        return errTxt === "";
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
                    <h2>Edit Account</h2>
                    <div className={classes.seperatorH} />
                    <div className={`${classes.inputCluster}`}>
                        <p>Name</p>
                        <Input
                            type="text"
                            name="name"
                            value={inputFields.name}
                            onChange={handleValueChange}
                            isOptional={false}
                        />
                    </div>
                    <div className={classes.inputCluster}>
                        <p className={classes.label}>Account Type</p>
                        <div className={classes.accountTypeDiv} onClick={() => setIsExpanded((prev) => !prev)}>
                            {inputFields.type ? (
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
                    <div className={`${classes.inputCluster}`}>
                        <p>Initial Balance</p>
                        <Input
                            type="number"
                            name="initial_balance"
                            value={inputFields.initial_balance}
                            onChange={handleValueChange}
                            isOptional={false}
                        />
                    </div>

                    <div className={`${classes.inputCluster}`}>
                        <p>Description</p>
                        <Input
                            type="text"
                            name="description"
                            value={inputFields.description}
                            onChange={handleValueChange}
                        />
                    </div>
                    <div className={classes.actionItems}>
                        <p>{errorText}</p>
                        <span>
                            <button onClick={updateAccount}>Save & Close</button>
                            <button onClick={handleCancelClose}>Close</button>
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AccountModal;
