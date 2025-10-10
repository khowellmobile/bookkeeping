import classes from "./AccountItem.module.css";

import AccountsCtx from "../../contexts/AccountsCtx";
import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import AccountModal from "../modals/AccountModal";
import ThreeDotsIcon from "../../../assets/three-dots-icon.svg";
import ConfirmationModal from "../modals/ConfirmationModal";

const AccountItem = ({ account }) => {
    const navigate = useNavigate();

    const { setCtxActiveAccount, ctxDeleteAccount } = useContext(AccountsCtx);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDropOpen, setIsDropOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const dropdownRef = useRef(null);

    const accountClickHandler = (account) => {
        setCtxActiveAccount(account);
        navigate("/app/transactions");
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isDropOpen && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropOpen, dropdownRef]);

    const onConfirmDelete = () => {
        ctxDeleteAccount(account.id);
        setIsDeleteModalOpen(false);
    };

    const onCancelDelete = () => {
        setIsDeleteModalOpen(false);
    };

    return (
        <>
            {isModalOpen && <AccountModal account={account} handleCloseModal={handleCloseModal} />}
            {isDeleteModalOpen && (
                <ConfirmationModal
                    text={{
                        msg: "Are you sure you wish to mark this Account inactive?",
                        confirm_txt: "Delete",
                        cancel_txt: "Cancel Deletion",
                    }}
                    onConfirm={onConfirmDelete}
                    onCancel={onCancelDelete}
                />
            )}

            <div className={classes.mainContainer}>
                <p>{account.name}</p>
                <p>{account.type.charAt(0).toUpperCase() + account.type.slice(1)}</p>
                <p>{account.description}</p>
                <p>{account.balance}</p>
                <div className={classes.actionDiv}>
                    <img
                        src={ThreeDotsIcon}
                        className={classes.icon}
                        alt="Icon"
                        onClick={() => setIsDropOpen(!isDropOpen)}
                    />
                    {isDropOpen && (
                        <div className={classes.actionDropdown} ref={dropdownRef}>
                            <div onClick={() => accountClickHandler(account)}>
                                <p>Go to Transactions</p>
                            </div>
                            <div onClick={() => setIsModalOpen(true)}>
                                <p>Edit</p>
                            </div>
                            <div>
                                <p onClick={() => setIsDeleteModalOpen(true)}>Mark Inactive</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AccountItem;
