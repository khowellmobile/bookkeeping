import classes from "./Button.module.css";

const Button = ({ onClick, text, customStyle }) => {
    return (
        <button className={classes.button} onClick={onClick} style={customStyle}>
            {text}
        </button>
    );
};

export default Button;
