import classes from "./AddInputCluster.module.css";
import Input from "./Input";

const AddInputCluster = ({ label, placeholder, name, value, onChange, type = "text" }) => {
    return (
        <div className={classes.inputCluster}>
            <p className={classes.label}>{label}</p>
            <Input type={type} placeholder={placeholder} name={name} value={value} onChange={onChange} />
        </div>
    );
};

export default AddInputCluster;
