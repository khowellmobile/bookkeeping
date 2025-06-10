import { useState } from "react";
import classes from "./TransactionItem.module.css";

import TransactionModal from "../modals/TransactionModal";

const TransactionItem = ({ vals }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            {isModalOpen && (
                <TransactionModal vals={vals} handleCloseModal={handleCloseModal} />
            )}

            <div className={classes.mainContainer} onClick={() => setIsModalOpen(true)}>
                <p>{vals.date}</p>
                <p>{vals.entity && vals.entity.name}</p>
                <p>{vals.account && vals.account.name}</p>
                <p>{vals.memo}</p>
                <p>{vals.amount < 0 ? `(${Math.abs(vals.amount).toFixed(2)})` : (vals.amount * 1).toFixed(2)}</p>
                <p>{vals.is_reconciled ? "yes" : "no"}</p>
            </div>
        </>
    );
};

export default TransactionItem;
