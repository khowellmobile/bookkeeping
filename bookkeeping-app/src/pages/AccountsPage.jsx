import classes from "./AccountsPage.module.css";
import BkpgContext from "../components/contexts/BkpgContext";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddAccountModal from "../components/elements/modals/AddAccountModal";

const AccountsPage = () => {
    const navigate = useNavigate();

    const { ctxAccountList, changeCtxActiveAccount, ctxIsLoading, populateCtxAccounts } = useContext(BkpgContext);

    const [isModalOpen, setIsModalOpen] = useState(true);

    const accountClickHandler = (account) => {
        changeCtxActiveAccount(account);
        navigate("/transactions");
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    if (!ctxAccountList) {
        return <div>Accounts not loaded</div>;
    }

    return (
        <>
            {isModalOpen && <AddAccountModal handleCloseModal={handleCloseModal} />}

            <div className={classes.mainContainer}>
                <div className={classes.accountsHeader}>
                    <h2>Accounts</h2>
                    <div className={classes.tools}>
                        <div>
                            <input
                                type="text"
                                className={classes.accountSearch}
                                placeholder="Search..."
                                spellCheck="false"
                            ></input>
                        </div>
                        <div>
                            <button onClick={() => setIsModalOpen(true)}>Add Account</button>
                        </div>
                    </div>
                </div>
                <div className={classes.accountListing}>
                    <div className={classes.listingHeader}>
                        <p>Name</p>
                        <p>Type</p>
                        <p>Description</p>
                        <p>Balance</p>
                        <p>Action</p>
                    </div>
                    <div className={classes.listingItems}>
                        {ctxAccountList.map((account, index) => (
                            <div key={index}>
                                <p onClick={() => accountClickHandler(account.name)}>{account.name}</p>
                                <p>{account.type}</p>
                                <p>{account.description}</p>
                                <p>{account.balance}</p>
                                <p>{account.initial_balance}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AccountsPage;
