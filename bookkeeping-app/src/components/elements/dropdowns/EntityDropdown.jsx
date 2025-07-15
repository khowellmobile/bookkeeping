import classes from "./EntityDropdown.module.css";

import { useState, useContext, useEffect, useRef } from "react";
import EntitiesCtx from "../../contexts/EntitiesCtx";

import upChevIconB from "../../../assets/chevron-up-icon.svg";
import downChevIconB from "../../../assets/chevron-down-icon.svg";
import upChevIconW from "../../../assets/chevron-up-icon-white.svg";
import downChevIconW from "../../../assets/chevron-down-icon-white.svg";

const EntityDropdown = ({ initalVal, onChange, altClass }) => {
    const { ctxEntityList } = useContext(EntitiesCtx);

    const [activeEntity, setActiveEntity] = useState(initalVal);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isOffBotScreen, setIsOffBotScreen] = useState(false);

    const displayRef = useRef(null);
    const dropdownRef = useRef(null);

    const topOffsetStyle = {
        top: altClass ? (isOffBotScreen ? "-20rem" : "1.5rem") : "2rem",
    };
    let upChevIcon, downChevIcon;

    if (altClass) {
        upChevIcon = upChevIconW;
        downChevIcon = downChevIconW;
    } else {
        upChevIcon = upChevIconB;
        downChevIcon = downChevIconB;
    }

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

    const clickEntityHandler = (entity) => {
        setActiveEntity(entity);
        setIsExpanded(false);
        onChange(entity);
    };

    const checkOffScreen = () => {
        try {
            const r = dropdownRef.current;

            if (r) {
                const rectR = r.getBoundingClientRect();
                const windowHeight = window.innerHeight || document.documentElement.clientHeight;
                const isOffScreenBottom = rectR.bottom + 320 > windowHeight;
                setIsOffBotScreen(isOffScreenBottom);
            }
        } catch (error) {
            console.log(error, "Safe to ignore");
        }
    };

    return (
        <div
            className={`${classes.mainContainer} ${classes[altClass] || ""}`}
            ref={dropdownRef}
            onClick={checkOffScreen}
        >
            <div className={classes.display} onClick={() => setIsExpanded((preVal) => !preVal)}>
                <p>{activeEntity && activeEntity.name}</p>
            </div>
            <div className={classes.arrow} onClick={() => setIsExpanded((preVal) => !preVal)}>
                <img src={isExpanded ? upChevIcon : downChevIcon} className={classes.icon} />
            </div>
            {isExpanded && (
                <div className={classes.anchor}>
                    <div className={classes.dropDownContent} style={topOffsetStyle}>
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
