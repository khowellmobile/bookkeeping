import classes from "./HomePage.module.css";

import Shortcuts from "../components/elements/misc/Shortcuts";
import Menu from "../components/sections/Menu";
import Header from "../components/sections/Header";
import DashBlock from "../components/elements/misc/DashBlock";

import { AccountListing, PropertyListing, ReportListing } from "../components/elements/listings/DashListings";

const HomePage = () => {
    return (
        <div className={classes.mainContainer}>
            <div className={classes.menuContainer}>
                <Menu />
            </div>
            <div className={classes.contentContainer}>
                <div className={classes.headerContainer}>
                    <Header />
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
                                <DashBlock />
                                <DashBlock />
                                <DashBlock />
                            </div>
                            <div className={classes.subTwoLeftBot}>
                                <div className={classes.shortWideBlock}>
                                    <ReportListing />
                                </div>
                            </div>
                        </div>
                        <div className={classes.subTwoRight}>
                            <div className={classes.largeBlock}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
