import { useState, useEffect } from "react";

import classes from "./Input.module.css";

const Input = ({ type, name, value, onChange, customStyle, placeholder, isOptional = true, disabled = false }) => {
    const [warnUser, setWarnUser] = useState(false);
    const [style, setStyle] = useState(customStyle);

    const unescapeHTML = (str) => {
        if (typeof str === "string") {
            return str
                .replace(/&amp;/g, "&")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&quot;/g, '"')
                .replace(/&#x27;/g, "'")
                .replace(/&#x2F;/g, "/");
        } else {
            return str;
        }
    };

    useEffect(() => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

        let isValid = true;
        if (!value || value.trim().length === 0) {
            if (isOptional) {
                isValid = true;
            } else {
                isValid = false;
            }
        } else {
            switch (type) {
                case "number":
                    const unescapedValue = unescapeHTML(value);
                    if (isNaN(unescapedValue) || unescapedValue < 0) {
                        isValid = false;
                    }
                    break;
                case "email":
                    isValid = emailRegex.test(value);
                    break;
                case "phoneNumber":
                    isValid = phoneRegex.test(value);
                    break;
                case "date":
                    isValid = dateRegex.test(value);
                    break;
                default:
                    isValid = true;
                    break;
            }
        }
        setWarnUser(!isValid);
        if (isValid) {
            setStyle(customStyle);
        } else {
            setStyle(() => ({
                ...customStyle,
                backgroundColor: "rgba(250, 180, 180, 0.356)",
            }));
        }
    }, [value, type]);

    /* useEffect(() => {
        console.log(warnUser);
    }, [warnUser]); */

    return (
        <input
            type="text"
            name={name}
            className={`${classes.input} ${warnUser && classes.warn}`}
            value={unescapeHTML(value)}
            placeholder={placeholder}
            onChange={onChange}
            style={style}
            disabled={disabled}
        />
    );
};

export default Input;
