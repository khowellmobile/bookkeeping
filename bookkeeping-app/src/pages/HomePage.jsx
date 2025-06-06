import classes from "./HomePage.module.css";

import Shortcuts from "../components/elements/misc/Shortcuts";
import DashBlock from "../components/elements/misc/DashBlock";

import TransactionsCtx from "../components/contexts/TransactionsCtx";
import AccountsCtx from "../components/contexts/AccountsCtx";
import EntitiesCtx from "../components/contexts/EntitiesCtx";
import PropertiesCtx from "../components/contexts/PropertiesCtx";
import JournalsCtx from "../components/contexts/JournalsCtx";

import { useContext, useEffect } from "react";

import { AccountListing, PropertyListing, ReportListing } from "../components/elements/listings/DashListings";

const HomePage = () => {
    const { populateCtxTransactions } = useContext(TransactionsCtx);
    const { populateCtxAccounts } = useContext(AccountsCtx);
    const { populateCtxEntities } = useContext(EntitiesCtx);
    const { populateCtxProperties } = useContext(PropertiesCtx);
    const { populateCtxJournals } = useContext(JournalsCtx);

    const exampleText =
        "Your contractors W2s are ready for download! Head to the journals page to print them out right away!";

    useEffect(() => {
        populateCtxAccounts();
        populateCtxEntities();
        populateCtxTransactions();
        populateCtxProperties();
        populateCtxJournals();
    }, []);

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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
