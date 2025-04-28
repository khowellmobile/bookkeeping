import classes from "./Menu.module.css";

import AccountsIcon from "../../assets/accounts-icon.svg";
import DashIcon from "../../assets/dashboard-icon.svg";
import TransactionIcon from "../../assets/transaction-icon.svg";
import JournalIcon from "../../assets/journal-icon.svg";
import ReportsIcon from "../../assets/reports-icon.svg";
import SettingsIcon from "../../assets/settings-icon.svg";
import SupportIcon from "../../assets/support-icon.svg";
import UserIcon from "../../assets/user-icon-white.svg";

import MenuLineItem from "../elements/items/MenuLineItem";

const Menu = () => {
    return (
        <div className={classes.mainContainer}>
            <section className={classes.logoSection}>
                <div className={classes.logo}>
                    <p>H</p>
                </div>
                <div className={classes.seperatorV}></div>
                <p>Dashboard</p>
            </section>
            <section className={classes.itemsSection}>
                <MenuLineItem itemName="Dashboard" link="/home" icon={<img src={DashIcon} alt="Icon" />} />
                <MenuLineItem itemName="Transactions" link="/transactions" icon={<img src={TransactionIcon} alt="Icon" />} />
                <MenuLineItem itemName="Accounts" link="/accounts" icon={<img src={AccountsIcon} alt="Icon" />} />
                <MenuLineItem itemName="Journals" link="/journals" icon={<img src={JournalIcon} alt="Icon" />} />
                <MenuLineItem itemName="Reports" link="/reports" icon={<img src={ReportsIcon} alt="Icon" />} />
                <div className={classes.seperatorH}></div>
                <MenuLineItem itemName="Support" link="/support" icon={<img src={SupportIcon} alt="Icon" />} />
                <MenuLineItem itemName="Settings" link="/settings" icon={<img src={SettingsIcon} alt="Icon" />} />
            </section>
            {/* <section className={classes.profileSection}>
                <div className={classes.profilePicture}></div>
                <div className={classes.profileInfo}>
                    <p className={classes.profileName}>John Doe</p>
                    <p className={classes.profileDate}>August 3rd, 2024 10:32am</p>
                </div>
            </section> */}
            <MenuLineItem className={classes.logoutItem} itemName="Logout" icon={<img src={UserIcon} alt="Icon" />} />
        </div>
    );
};

export default Menu;
