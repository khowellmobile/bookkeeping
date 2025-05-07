import classes from "./entityEntryDropdown.module.css";

import BkpgContext from "../../contexts/BkpgContext";

import { useState, useContext, useEffect, useRef } from "react";

const EntityEntryDropdown = ({ onChange }) => {
    const { ctxEntityList } = useContext(BkpgContext);

    const [searchTerm, setSearchTerm] = useState("");
    const [filteredEntitys, setFilteredEntitys] = useState(ctxEntityList);
    const [isExpanded, setIsExpanded] = useState(false);

    const inputRef = useRef();

    useEffect(() => {
        if (ctxEntityList) {
            const filtered = ctxEntityList.filter((entity) =>
                entity.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredEntitys(filtered);
        }
    }, [searchTerm, ctxEntityList]);

    const clickentityHandler = (entity) => {
        setIsExpanded(false);
        setSearchTerm(entity.name);
        onChange(entity);
        inputRef.current = entity.name;
    };

    const handleBlur = () => {
        setTimeout(() => {
            setIsExpanded(false);
        }, 100);
    };

    return (
        <div className={classes.mainContainer}>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsExpanded(true);
                }}
                onFocus={() => setIsExpanded(true)}
                onBlur={handleBlur}
                ref={inputRef}
            />
            {isExpanded && (
                <div className={classes.anchor}>
                    <div className={classes.dropDownContent}>
                        <p>All entitys</p>
                        <div className={classes.separatorH}></div>
                        <div className={classes.entityListing}>
                            {filteredEntitys && filteredEntitys.length > 0 ? ( // Use filteredentitys
                                filteredEntitys.map((entity, index) => (
                                    <p key={index} onClick={() => clickentityHandler(entity)}>
                                        {entity.name}
                                    </p>
                                ))
                            ) : (
                                <p>No matching entitys found.</p> // Show message if no matches
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EntityEntryDropdown;
