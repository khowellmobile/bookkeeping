import classes from "./Menu.module.css";

import { useContext } from "react";
import AuthCtx from "../contexts/AuthCtx";

import CalendarIcon from "../../assets/calendar-icon.svg";
import AccountsIcon from "../../assets/accounts-icon.svg";
import EntitiesIcon from "../../assets/entities-icon.svg";
import DashIcon from "../../assets/dashboard-icon.svg";
import TransactionIcon from "../../assets/transaction-icon.svg";
import JournalIcon from "../../assets/journal-icon.svg";
import ReportsIcon from "../../assets/reports-icon.svg";
import PropertiesIcon from "../../assets/properties-icon.svg";
import SettingsIcon from "../../assets/settings-icon.svg";
import SupportIcon from "../../assets/support-icon.svg";
import UserIcon from "../../assets/user-icon-white.svg";

import MenuLineItem from "../elements/items/MenuLineItem";

const Menu = () => {
    const { logoutUser } = useContext(AuthCtx);

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
                <MenuLineItem
                    itemName="Transactions"
                    link="/transactions"
                    icon={<img src={TransactionIcon} alt="Icon" />}
                />
                <MenuLineItem itemName="Rents" link="/rents" icon={<img src={CalendarIcon} alt="Icon" />} />
                <MenuLineItem itemName="Accounts" link="/accounts" icon={<img src={AccountsIcon} alt="Icon" />} />
                <MenuLineItem itemName="Entities" link="/entities" icon={<img src={EntitiesIcon} alt="Icon" />} />
                <MenuLineItem itemName="Journals" link="/journals" icon={<img src={JournalIcon} alt="Icon" />} />
                <MenuLineItem itemName="Reports" link="/reports" icon={<img src={ReportsIcon} alt="Icon" />} />
                <div className={classes.seperatorH}></div>
                <MenuLineItem itemName="Properties" link="/properties" icon={<img src={PropertiesIcon} alt="Icon" />} />
                <div className={classes.seperatorH}></div>
                <MenuLineItem itemName="Support" link="/support" icon={<img src={SupportIcon} alt="Icon" />} />
                <MenuLineItem itemName="Settings" link="/settings" icon={<img src={SettingsIcon} alt="Icon" />} />
            </section>
            <MenuLineItem
                className={classes.logoutItem}
                itemName="Logout"
                link="/"
                icon={<img src={UserIcon} alt="Icon" />}
                onClick={logoutUser}
            />
        </div>
    );
};

export default Menu;
