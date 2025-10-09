import classes from "./Button.module.css";

const Button = ({ text, onClick, customStyle }) => {
    return (
        <button className={classes.button} onClick={onClick} style={customStyle}>
            {text}
        </button>
    );
};

export default Button;
