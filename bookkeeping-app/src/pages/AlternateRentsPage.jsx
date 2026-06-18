import classes from "./AlternateRentsPage.module.css";

import Button from "../components/elements/utilities/Button";

const AlternateRentsPage = () => {
    return (
        <div className={classes.mainContainer}>
            <div className={classes.header}>
                <h2>Rents</h2>
                <div className={classes.tools}>
                    <div className={classes.filters}>
                        <input
                            type="text"
                            className={classes.searchBar}
                            placeholder="Search..."
                            spellCheck="false"
                            value={() => {}}
                            onChange={() => {}}
                        ></input>
                    </div>
                    <div className={classes.buttons}>
                        <Button text={"Default View"} onClick={() => {}} />
                    </div>
                </div>
            </div>
            <div className={classes.listing}></div>
        </div>
    );
};

export default AlternateRentsPage;
