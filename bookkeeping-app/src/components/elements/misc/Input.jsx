import { useState, useEffect } from "react";

import classes from "./Input.module.css";

const Input = ({ type, name, value, onChange, customStyle, placeholder, isOptional = false }) => {
    const [warnUser, setWarnUser] = useState(false);

    const unescapeHTML = (str) => {
        return str
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/&#x27;/g, "'")
            .replace(/&#x2F;/g, "/");
    };

    useEffect(() => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;

        let isValid = true;
        if (value.trim().length === 0) {
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
                    break;
                default:
                    isValid = true;
                    break;
            }
        }
        setWarnUser(!isValid);
    }, [value, type]);

    useEffect(() => {
        console.log(warnUser);
    }, [warnUser]);

    return (
        <input
            type="text"
            name={name}
            className={`${classes.input} ${warnUser && classes.warn}`}
            value={unescapeHTML(value)}
            placeholder={placeholder}
            onChange={onChange}
            style={customStyle}
        />
    );
};

export default Input;
