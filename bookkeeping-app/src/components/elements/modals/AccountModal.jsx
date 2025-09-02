import classes from "./AccountModal.module.css";

import AccountsCtx from "../../contexts/AccountsCtx";
import { useContext, useState } from "react";

import ConfirmationModal from "./ConfirmationModal";

import upChevIcon from "../../../assets/chevron-up-icon.svg";
import downChevIcon from "../../../assets/chevron-down-icon.svg";
import Input from "../misc/Input";

const AccountModal = ({ account, handleCloseModal }) => {
    const { ctxUpdateAccount } = useContext(AccountsCtx);

    const [accountName, setAccountName] = useState(account.name);
    const [accountType, setAccountType] = useState(account.type.charAt(0).toUpperCase() + account.type.slice(1));
    const [accountInitBalance, setAccountInitBalance] = useState(account.initial_balance);
    const [accountDescription, setAccountDescription] = useState(account.description);
    const [editedAccount, setEditedAccount] = useState({});
    const [isExpanded, setIsExpanded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const accountTypes = ["Asset", "Bank", "Equity", "Liability"];

    const handleNameChange = (event) => {
        setAccountName(event.target.value);
        setEditedAccount((prev) => ({ ...prev, name: event.target.value }));
    };

    const clickTypeHandler = (type) => {
        setAccountType(type);
        setEditedAccount((prev) => ({ ...prev, type: type.toLowerCase() }));
        setIsExpanded(false);
    };

    const handleInitBalanceChange = (event) => {
        setAccountInitBalance(event.target.value);
        setEditedAccount((prev) => ({ ...prev, initial_balance: event.target.value }));
    };

    const handleDescChange = (event) => {
        setAccountDescription(event.target.value);
        setEditedAccount((prev) => ({ ...prev, description: event.target.value }));
    };

    const updateAccount = async () => {
        ctxUpdateAccount({ ...editedAccount, id: account.id });
        handleCloseModal();
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
                        <Input type="text" value={accountName} onChange={handleNameChange} isOptional={false} />
                    </div>
                    <div className={classes.inputCluster}>
                        <p className={classes.label}>Account Type</p>
                        <div className={classes.accountTypeDiv} onClick={() => setIsExpanded((prev) => !prev)}>
                            {accountType ? (
                                <p>{accountType}</p>
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
                            value={accountInitBalance}
                            onChange={handleInitBalanceChange}
                            isOptional={false}
                        />
                    </div>

                    <div className={`${classes.inputCluster}`}>
                        <p>Description</p>
                        <Input type="text" value={accountDescription} onChange={handleDescChange} />
                    </div>
                    <div className={classes.buttons}>
                        <button onClick={updateAccount}>Save & Close</button>
                        <button onClick={handleCancelClose}>Close</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AccountModal;
