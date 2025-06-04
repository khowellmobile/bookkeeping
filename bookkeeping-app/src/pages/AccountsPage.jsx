import classes from "./AccountsPage.module.css";
import AccountsCtx from "../components/contexts/AccountsCtx";
import { useContext, useState, useEffect } from "react";
import AddAccountModal from "../components/elements/modals/AddAccountModal";
import AccountItem from "../components/elements/items/AccountItem";

const AccountsPage = () => {
    const { ctxAccountList } = useContext(AccountsCtx);

    const [searchTerm, setSearchTerm] = useState("");
    const [filteredAccounts, setFilteredAccounts] = useState(ctxAccountList);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (ctxAccountList) {
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            const filtered = ctxAccountList.filter(
                (account) =>
                    account.name.toLowerCase().includes(lowercasedSearchTerm) ||
                    account.type.toLowerCase().includes(lowercasedSearchTerm) ||
                    account.description.toLowerCase().includes(lowercasedSearchTerm)
            );
            setFilteredAccounts(filtered);
        }
    }, [searchTerm, ctxAccountList]);

    if (!ctxAccountList) {
        return <div>Accounts not loaded. Refresh Page.</div>;
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
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                }}
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
                        {filteredAccounts && filteredAccounts.length > 0 ? (
                            filteredAccounts.map((account, index) => <AccountItem account={account} key={index} />)
                        ) : (
                            <p>No matching accounts found.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AccountsPage;
