import { useState } from "react";

import classes from "./PropertyTypeDropdown.module.css";

import upChevIcon from "../../../assets/chevron-up-icon.svg";
import downChevIcon from "../../../assets/chevron-down-icon.svg";

const PropertyTypeDropdown = ({ val, clickTypeHandler, isEditing }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const propertyTypes = ["commercial", "residential", "multi-unit"];

    const editingStyle = {
        border: "1px solid var(--border-color)",
    };

    const handleClick = (type) => {
        clickTypeHandler(type);
        setIsExpanded(false);
    };

    return (
        <>
            <div
                className={classes.typeDiv}
                style={isEditing ? editingStyle : {}}
                onClick={() => {
                    isEditing ? setIsExpanded((prev) => !prev) : "";
                }}
                role="expansion-button"
            >
                {val && <p>{val.charAt(0).toUpperCase() + val.slice(1)}</p>}
                {isEditing && (
                    <img src={isExpanded ? upChevIcon : downChevIcon} className={classes.icon} alt="chevron icon" />
                )}
            </div>
            <div className={`${classes.anchor} ${isExpanded ? "" : classes.noDisplay}`} role="dropdown-menu">
                <div className={classes.dropdown}>
                    {propertyTypes.map((type, index) => {
                        return (
                            <p
                                key={index}
                                onClick={() => {
                                    isEditing ? handleClick(type) : "";
                                }}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </p>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default PropertyTypeDropdown;
