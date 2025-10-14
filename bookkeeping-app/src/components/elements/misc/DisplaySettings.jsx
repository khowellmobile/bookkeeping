import { useState, useEffect } from "react";

import classes from "./DisplaySettings.module.css";

import Button from "../utilities/Button";

const DisplaySettings = () => {
    const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

    useEffect(() => {
        if (localStorage.getItem("theme") === "dark") {
            setDarkMode(true);
        } else {
            setDarkMode(false);
        }
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add("dark-mode");
            localStorage.setItem("theme", "dark");
        } else {
            document.body.classList.remove("dark-mode");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    const buttonText = darkMode ? "Light Toggle" : "Dark Toggle";

    return (
        <div className={classes.mainContainer}>
            <section>
                <p>Application Theme</p>
                <p>Control colors and theme of the application</p>
                <Button onClick={() => setDarkMode((prev) => !prev)} text={buttonText} />
            </section>
        </div>
    );
};

export default DisplaySettings;
