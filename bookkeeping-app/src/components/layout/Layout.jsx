import classes from "./Layout.module.css";

import Header from "../sections/Header";
import Menu from "../sections/Menu";

import NotificationIcon from "../../assets/notification-icon.svg";
import UserIcon from "../../assets/user-icon-black.svg";

const Layout = (props) => {
    return (
        <div className={classes.layoutContainer}>
            <div className={classes.menuContainer}>
                <Menu />
            </div>
            <div>
                <div className={classes.headerContainer}>
                    <Header />
                    <div className={classes.headerTools}>
                        <div>
                            <img className={classes.icon} src={NotificationIcon} alt="Icon" />
                        </div>
                        <div>
                            <p className={classes.userEmail}>Exampleemail@gmail.com</p>
                            <img className={classes.icon} src={UserIcon} alt="Icon" />
                        </div>
                    </div>
                </div>
                <div className={classes.contentContainer}>{props.children}</div>
            </div>
        </div>
    );
};

export default Layout;
