import { useState, useContext } from "react";

import classes from "./PropertyDropdown.module.css";

import PropertiesCtx from "../../contexts/PropertiesCtx";

import upChevIcon from "../../../assets/chevron-up-icon.svg";
import downChevIcon from "../../../assets/chevron-down-icon.svg";

const Dropdown = () => {
    const { ctxPropertyList, ctxActiveProperty, setCtxActiveProperty } = useContext(PropertiesCtx);

    const [isExpanded, setIsExpanded] = useState(false);

    const propertyClickHandler = (property) => {
        setCtxActiveProperty(property);
        setIsExpanded(false);
    };

    /* console.log(ctxPropertyList) */

    return (
        <div className={classes.mainContainer}>
            <div className={classes.display}>
                <p>{ctxActiveProperty ? ctxActiveProperty?.name : "None Selected"}</p>
            </div>
            <div className={classes.arrow} onClick={() => setIsExpanded((preVal) => !preVal)}>
                <img src={isExpanded ? upChevIcon : downChevIcon} className={classes.icon} />
            </div>
            {isExpanded && (
                <div className={classes.anchor}>
                    <div className={classes.dropDownContent}>
                        <p>Find Property</p>
                        <input type="text" placeholder="Search..." spellCheck="false"></input>
                        <p>All Properties</p>
                        <div className={classes.separatorH}></div>
                        <div className={classes.propertyListing}>
                            {ctxPropertyList.map((property, index) => {
                                return (
                                    <p key={index} onClick={() => propertyClickHandler(property)}>
                                        {property.name}
                                    </p>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dropdown;
