import { useState } from "react";
import classes from "./TransactionItem.module.css";

import TransactionModal from "../modals/TransactionModal";

const TransactionItem = ({ vals }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const unescapeHTML = (str) => {
        return str
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/&#x27;/g, "'")
            .replace(/&#x2F;/g, "/");
    };

    return (
        <>
            {isModalOpen && <TransactionModal vals={vals} handleCloseModal={handleCloseModal} />}

            <div className={classes.mainContainer} onClick={() => setIsModalOpen(true)}>
                <p>{vals.date}</p>
                <p>{vals.entity && vals.entity.name}</p>
                <p>{vals.account && vals.account.name}</p>
                <p>{unescapeHTML(vals.memo)}</p>
                <p>{vals.type === "debit" ? `(${Number(vals.amount).toFixed(2)})` : Number(vals.amount).toFixed(2)}</p>
                <p>{vals.is_reconciled ? "yes" : "no"}</p>
            </div>
        </>
    );
};

export default TransactionItem;
