import AccountListing from "../components/elements/listings/AccountListing";
import Menu from "../components/sections/Menu";
import classes from "./HomePage.module.css";

const HomePage = () => {
    return (
        <div className={classes.mainContainer}>
            <div className={classes.menuContainer}>
                <Menu />
            </div>
            <div className={classes.contentContainer}>
                <div className={classes.headerContainer}></div>
                <div className={classes.contentContainer}>
                    <div className={classes.temp}>
                        <AccountListing />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
