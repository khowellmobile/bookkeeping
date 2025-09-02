import classes from "./entityEntryDropdown.module.css";

import EntitiesCtx from "../../contexts/EntitiesCtx";

import { useState, useContext, useEffect, useRef } from "react";
import AddEntityModal from "../modals/AddEntityModal";

const EntityEntryDropdown = ({ scrollRef, onChange, hasLeftBorder = false }) => {
    const { ctxEntityList } = useContext(EntitiesCtx);

    const [searchTerm, setSearchTerm] = useState("");
    const [filteredEntitys, setFilteredEntitys] = useState(ctxEntityList);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isOffScreenBottom, setIsOffScreenBottom] = useState();
    const [pxScroll, setPxScroll] = useState(0);

    const inputRef = useRef();

    let style = isOffScreenBottom
        ? { bottom: `calc(1.5rem + ${pxScroll}px + 1px)` }
        : { top: `calc(1.5rem - ${pxScroll}px)` };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const checkOffScreen = () => {
        try {
            const r = inputRef.current;

            if (r) {
                const rectR = r.getBoundingClientRect();
                const windowHeight = window.innerHeight || document.documentElement.clientHeight;
                const isOffScreenBottom = rectR.bottom + 320 > windowHeight;
                setIsOffScreenBottom(isOffScreenBottom);
            }
        } catch (error) {
            console.log(error, "Safe to ignore");
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (scrollRef.current) {
                setIsExpanded(false);
                setPxScroll(scrollRef.current.scrollTop);
            } else {
                console.log("scrollRef.current is null");
            }
        };

        const scrollableDiv = scrollRef.current;
        if (scrollableDiv) {
            scrollableDiv.addEventListener("scroll", handleScroll);
        }
    }, []);

    useEffect(() => {
        if (ctxEntityList) {
            const filtered = ctxEntityList.filter((entity) =>
                entity.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredEntitys(filtered);
        }

        // Clear selection in components further up tree when user clears search box
        if (searchTerm == "") {
            onChange("");
        }
    }, [searchTerm, ctxEntityList]);

    const clickEntityHandler = (entity) => {
        setIsExpanded(false);
        setSearchTerm(entity.name);
        onChange(entity);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const handleBlur = () => {
        setTimeout(() => {
            setIsExpanded(false);
        }, 100);
    };

    return (
        <>
            {isModalOpen && <AddEntityModal handleCloseModal={handleCloseModal} />}

            <div className={classes.mainContainer} onFocus={() => checkOffScreen()}>
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
                    style={hasLeftBorder ? {borderLeft: "1px dashed var(--border-color)"} : {}}
                />
                <div className={`${classes.anchor} ${isExpanded ? "" : classes.noDisplay}`}>
                    <div className={classes.dropDownContent} style={style}>
                        <div className={classes.dropdownHeader}>
                            <p>All entitys</p>
                            <button onClick={() => setIsModalOpen(true)}>Add Entity</button>
                        </div>
                        <div className={classes.separatorH}></div>
                        <div className={classes.entityListing}>
                            {filteredEntitys && filteredEntitys.length > 0 ? ( // Use filteredentitys
                                filteredEntitys.map((entity, index) => (
                                    <p key={index} onClick={() => clickEntityHandler(entity)}>
                                        {entity.name}
                                    </p>
                                ))
                            ) : (
                                <p>No matching entitys found.</p> // Show message if no matches
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EntityEntryDropdown;
