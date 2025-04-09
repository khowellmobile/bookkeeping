import classes from "./AccountsPage.module.css";

import BkpgContext from "../components/contexts/BkpgContext";

import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

const AccountsPage = () => {
    const { changeCtxActiveAccount } = useContext(BkpgContext);
    const navigate = useNavigate();

    const data = [
        ["Huntington 1234", "Expense", "Opened 2024/01/24", "$12,157", "Actions"],
        ["Wells Fargo 5678", "Income", "Opened 2023/11/10", "$2,500", "Actions"],
        ["Chase 9101", "Expense", "Opened 2024/02/15", "$3,000", "Actions"],
        ["Bank of America 1122", "Income", "Opened 2023/09/05", "$5,400", "Actions"],
        ["Citibank 3344", "Expense", "Opened 2024/01/05", "$1,200", "Actions"],
        ["TD Bank 5566", "Income", "Opened 2024/03/20", "$6,800", "Actions"],
        ["Capital One 7788", "Expense", "Opened 2023/12/10", "$4,500", "Actions"],
        ["PNC 9900", "Income", "Opened 2023/10/15", "$7,000", "Actions"],
        ["HSBC 2233", "Expense", "Opened 2024/01/12", "$2,800", "Actions"],
        ["U.S. Bank 4455", "Income", "Opened 2023/08/25", "$8,200", "Actions"],
        ["KeyBank 6677", "Expense", "Opened 2024/03/01", "$1,600", "Actions"],
        ["Regions 8899", "Income", "Opened 2023/11/20", "$4,750", "Actions"],
        ["SunTrust 1123", "Expense", "Opened 2024/01/30", "$3,200", "Actions"],
        ["American Express 2234", "Income", "Opened 2023/07/15", "$9,500", "Actions"],
        ["M&T Bank 3345", "Expense", "Opened 2024/02/05", "$1,000", "Actions"],
        ["Fifth Third 4456", "Income", "Opened 2023/12/25", "$6,100", "Actions"],
        ["BB&T 5567", "Expense", "Opened 2024/01/10", "$2,300", "Actions"],
        ["Citizens Bank 6678", "Income", "Opened 2023/10/05", "$4,800", "Actions"],
        ["Santander 7789", "Expense", "Opened 2024/02/20", "$3,500", "Actions"],
        ["Comerica 8890", "Income", "Opened 2023/09/15", "$5,600", "Actions"],
    ];

    const [accounts, setAccounts] = useState(data);

    const accountClickHandler = (val) => {
        changeCtxActiveAccount(val);
        navigate("/transactions");
    };

    return (
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
                        <button>Add Account</button>
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
                    {accounts.map((account, index) => (
                        <div key={index}>
                            <p onClick={() => accountClickHandler(account[0])}>{account[0]}</p>
                            <p>{account[1]}</p>
                            <p>{account[2]}</p>
                            <p>{account[3]}</p>
                            <p>{account[4]}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AccountsPage;
