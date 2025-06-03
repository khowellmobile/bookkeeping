import classes from "./AccountItem.module.css";
import BkpgContext from "../../contexts/BkpgContext";
import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AccountModal from "../modals/AccountModal";
import ThreeDotsIcon from "../../../assets/three-dots-icon.svg";

const AccountItem = ({ account }) => {
    const navigate = useNavigate();

    const { setCtxActiveAccount } = useContext(BkpgContext);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDropOpen, setIsDropOpen] = useState(false);

    const dropdownRef = useRef(null);

    const accountClickHandler = (account) => {
        setCtxActiveAccount(account);
        navigate("/transactions");
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

    const deleteAccount = async () => {
        const accessToken = localStorage.getItem("accessToken");

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/accounts/${account.id}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ is_deleted: true }),
            });

            if (!response.ok) {
                console.log("Error:", response.error);
                return;
            }
        } catch (error) {
            console.error("Error marking account inactive:", error);
        }
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
                                <p onClick={() => deleteAccount()}>Mark Inactive</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AccountItem;
