import classes from "./HomePage.module.css";

import Shortcuts from "../components/elements/misc/Shortcuts";
import Menu from "../components/sections/Menu";
import Header from "../components/sections/Header";
import DashBlock from "../components/elements/misc/DashBlock";

import NotificationIcon from "../assets/notification-icon.svg";
import UserIcon from "../assets/user-icon-black.svg";

import { AccountListing, PropertyListing, ReportListing } from "../components/elements/listings/DashListings";

const HomePage = () => {
    const exampleText =
        "Your contractors W2s are ready for download! Head to the journals page to print them out right away!";

    return (
        <div className={classes.mainContainer}>
            <div className={classes.menuContainer}>
                <Menu />
            </div>
            <div className={classes.contentContainer}>
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
                <div className={classes.featuresContainer}>
                    <div className={classes.featuresSubOne}>
                        <div className={classes.temp1}>
                            <Shortcuts />
                        </div>
                        <div className={classes.temp2}>
                            <AccountListing />
                        </div>
                        <div className={classes.temp3}>
                            <PropertyListing />
                        </div>
                    </div>
                    <div className={classes.featuresSubTwo}>
                        <div className={classes.subTwoLeft}>
                            <div className={classes.subTwoLeftTop}>
                                <DashBlock title="Notification" text={exampleText} link="/journals/" />
                                <DashBlock title="Notification" text={exampleText} link="/journals/" />
                                <DashBlock title="Notification" text={exampleText} link="/journals/" />
                            </div>
                            <div className={classes.subTwoLeftBot}>
                                <div className={classes.shortWideBlock}>
                                    <ReportListing />
                                </div>
                            </div>
                        </div>
                        <div className={classes.subTwoRight}>
                            <div className={classes.largeBlock}>
                                <p>What goes here?</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
