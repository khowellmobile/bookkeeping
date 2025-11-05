import classes from "./AddInputCluster.module.css";
import Input from "../utilities/Input";

const AddInputCluster = ({ label, placeholder, name, value, onChange, type = "text", isOptional }) => {
    return (
        <div className={classes.inputCluster}>
            <p className={classes.label}>{label}</p>
            <Input type={type} placeholder={placeholder} name={name} value={value} onChange={onChange} isOptional={isOptional}/>
        </div>
    );
};

export default AddInputCluster;
