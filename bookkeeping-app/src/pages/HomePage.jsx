import classes from "./HomePage.module.css";

import Shortcuts from "../components/elements/misc/Shortcuts";
import DashBlock from "../components/elements/misc/DashBlock";

import { useToast } from "../components/contexts/ToastCtx";
import { AccountListing, PropertyListing, ReportListing } from "../components/elements/listings/DashListings";
import ToastNotification from "../components/elements/misc/ToastNotification";
import { useEffect } from "react";

const HomePage = () => {
    const { showToast, hideToast } = useToast();

    /* useEffect(() => {
        showToast("hello", "success", 300);
    }, []);
 */
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
                        <p>What goes here?</p>
                        <button onClick={() => showToast("hello", "success", 3000)}>TOAST1</button>
                        <button onClick={() => showToast("hello", "warning", 3000)}>TOAST2</button>
                        <button onClick={() => showToast("hello", "error", 3000)}>TOAST3</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
