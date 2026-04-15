import classes from "./AccountItem.module.css";

import AccountsCtx from "../../../contexts/AccountsCtx";
import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import AccountModal from "../modals/AccountModal";
import ThreeDotsIcon from "../../../assets/three-dots-icon.svg";
import { useConfirmModal } from "../../../contexts/ConfirmModalCtx";

const AccountItem = ({ account }) => {
    const navigate = useNavigate();

    const { setCtxActiveAccount, ctxDeleteAccount } = useContext(AccountsCtx);
    const { showConfirmModal } = useConfirmModal();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDropOpen, setIsDropOpen] = useState(false);

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

    const handleDeleteClick = () => {
        showConfirmModal(
            {
                msg: "Are you sure you wish to mark this Account inactive?",
                confirm_txt: "Delete",
                cancel_txt: "Cancel Deletion",
            },
            () => ctxDeleteAccount(account.id)
        );
    };

    return (
        <>
            {isModalOpen && <AccountModal account={account} handleCloseModal={handleCloseModal} />}

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
                                <p onClick={handleDeleteClick}>Mark Inactive</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AccountItem;
