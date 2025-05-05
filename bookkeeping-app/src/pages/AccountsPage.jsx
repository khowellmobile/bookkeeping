import classes from "./AccountsPage.module.css";
import BkpgContext from "../components/contexts/BkpgContext";
import { useContext, useState } from "react";
import AddAccountModal from "../components/elements/modals/AddAccountModal";
import AccountItem from "../components/elements/items/AccountItem";

const AccountsPage = () => {
    const { ctxAccountList, ctxIsLoading } = useContext(BkpgContext);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    if (!ctxAccountList) {
        return <div>Accounts not loaded. Refresh Page.</div>;
    }

    return (
        <>
            {isModalOpen && <AddAccountModal handleCloseModal={handleCloseModal} />}

            {ctxIsLoading ? (
                <div>Accounts loading</div>
            ) : (
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
                                <AccountItem account={account} key={index} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AccountsPage;
