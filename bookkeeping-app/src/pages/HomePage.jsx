import Menu from "../components/sections/Menu";
import classes from "./HomePage.module.css";

const HomePage = () => {
    return (
        <div className={classes.mainContainer}>
            <div className={classes.menuContainer}>
                <Menu />
            </div>
        </div>
    );
};

export default HomePage;
