import classes from "./HomePage.module.css";

import Shortcuts from "../components/elements/misc/Shortcuts";
import DashBlock from "../components/elements/misc/DashBlock";

import { AccountListing, PropertyListing, ReportListing } from "../components/elements/listings/DashListings";
import MonthlyRentStat from "../components/elements/misc/MonthlyRentStat";

const HomePage = () => {
    const exampleText =
        "Your contractors W2s are ready for download! Head to the journals page to print them out right away!";

    return (
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
                        <MonthlyRentStat />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
