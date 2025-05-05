import classes from "./AccountItem.module.css";

import BkpgContext from "../../contexts/BkpgContext";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AccountModal from "../modals/AccountModal";

const AccountItem = ({ account }) => {
    const navigate = useNavigate();

    const { changeCtxActiveAccount } = useContext(BkpgContext);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const accountClickHandler = (account) => {
        changeCtxActiveAccount(account);
        navigate("/transactions");
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            {isModalOpen && <AccountModal account={account} handleCloseModal={handleCloseModal}/>}

            <div className={classes.mainContainer} onClick={() => setIsModalOpen(true)}>
                <p onClick={() => accountClickHandler(account.name)}>{account.name}</p>
                <p>{account.type}</p>
                <p>{account.description}</p>
                <p>{account.balance}</p>
                <p>{account.initial_balance}</p>
            </div>
        </>
    );
};

export default AccountItem;
