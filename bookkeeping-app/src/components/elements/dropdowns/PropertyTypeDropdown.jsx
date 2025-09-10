import { useState } from "react";

import classes from "./PropertyTypeDropdown.module.css";

import upChevIcon from "../../../assets/chevron-up-icon.svg";
import downChevIcon from "../../../assets/chevron-down-icon.svg";

const PropertyTypeDropdown = ({ val, clickTypeHandler, isEditing }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const propertyTypes = ["Commercial", "Residential", "Multi-Unit"];

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
            >
                {val && <p>{val}</p>}
                {isEditing && (
                    <img src={isExpanded ? upChevIcon : downChevIcon} className={classes.icon} alt="chevron icon" />
                )}
            </div>
            <div className={`${classes.anchor} ${isExpanded ? "" : classes.noDisplay}`}>
                <div className={classes.dropdown}>
                    {propertyTypes.map((type, index) => {
                        return (
                            <p
                                key={index}
                                onClick={() => {
                                    isEditing ? handleClick(type) : "";
                                }}
                            >
                                {type}
                            </p>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default PropertyTypeDropdown;
