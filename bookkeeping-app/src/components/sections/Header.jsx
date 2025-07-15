import PropertyDropdown from "../elements/dropdowns/PropertyDropdown";
import classes from "./Header.module.css";

const Header = () => {
    return (
        <div className={classes.mainContainer}>
            <PropertyDropdown />
        </div>
    );
};

export default Header;
