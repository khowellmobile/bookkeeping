import classes from "./EntityDropdown.module.css";

import { useState, useContext, useEffect, useRef } from "react";
import BkpgContext from "../../contexts/BkpgContext";

const EntityDropdown = ({ initalVal, onChange }) => {
    const { ctxEntityList } = useContext(BkpgContext);

    const [activeEntity, setActiveEntity] = useState(initalVal);
    const [isExpanded, setIsExpanded] = useState(false);

    const dropdownRef = useRef(null);

    const clickEntityHandler = (entity) => {
        setActiveEntity(entity);
        setIsExpanded(false);
        onChange(entity);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsExpanded(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className={classes.mainContainer} ref={dropdownRef}>
            <div className={classes.display} onClick={() => setIsExpanded((preVal) => !preVal)}>
                <p>{activeEntity && activeEntity.name}</p>
            </div>
            <div className={classes.arrow} onClick={() => setIsExpanded((preVal) => !preVal)}>
                <p>{isExpanded ? "△" : "▽"}</p>
            </div>
            {isExpanded && (
                <div className={classes.anchor}>
                    <div className={classes.dropDownContent}>
                        <p>Find Payee</p>
                        <input type="text" placeholder="Search..." spellCheck="false"></input>
                        <p>All Payees</p>
                        <div className={classes.separatorH}></div>
                        <div className={classes.clientListing}>
                            {ctxEntityList &&
                                ctxEntityList.map((entity, index) => {
                                    return (
                                        <p key={index} onClick={() => clickEntityHandler(entity)}>
                                            {entity.name}
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

export default EntityDropdown;
