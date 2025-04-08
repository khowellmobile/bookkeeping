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
            {isModalOpen && <TransactionModal vals={vals} handleCloseModal={handleCloseModal} />}

            <div className={classes.mainContainer} onClick={() => (setIsModalOpen(true))}>
                <p>{vals[0]}</p>
                <p>{vals[1]}</p>
                <p>{vals[2]}</p>
                <p>{vals[3]}</p>
                <p>{vals[4]}</p>
                <p>{vals[5]}</p>
            </div>
        </>
    );
};

export default TransactionItem;
