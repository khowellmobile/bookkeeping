import Dropdown from "../elements/dropdowns/Dropdown";
import classes from "./Header.module.css";

const Header = () => {
    return (
        <div className={classes.mainContainer}>
            <Dropdown />
        </div>
    );
};

export default Header;
