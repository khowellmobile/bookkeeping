import classes from "./Input.module.css";

const Input = ({ type, name, value, onChange, customStyle, placeholder }) => {
    const unescapeHTML = (str) => {
        return str
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/&#x27;/g, "'")
            .replace(/&#x2F;/g, "/");
    };

    return (
        <input
            type="text"
            name={name}
            className={classes.input}
            value={unescapeHTML(value)}
            placeholder={placeholder}
            onChange={onChange}
            style={customStyle}
        />
    );
};

export default Input;
