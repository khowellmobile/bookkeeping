import { useState, useEffect } from "react";

import classes from "./SearchBox.module.css";

const SearchBox = ({ itemName, items, onItemClick, onAddButtonClick }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredItems, setFilteredItems] = useState([]);

    // Filtering results by search term
    useEffect(() => {
        if (items) {
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            const filtered = items.filter((item) => item.name.toLowerCase().includes(lowercasedSearchTerm));
            setFilteredItems(filtered);
        }
    }, [searchTerm, items]);

    return (
        <div className={classes.searchBox}>
            <div className={classes.searchBoxTools}>
                <button className={classes.button} onClick={onAddButtonClick}>
                    Add {itemName}
                </button>
            </div>
            <input
                type="text"
                className={classes.itemSearch}
                placeholder="Search..."
                spellCheck="false"
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                }}
            ></input>
            <div className={classes.itemListing}>
                {filteredItems && filteredItems.length > 0 ? (
                    filteredItems.map((item, index) => (
                        <p key={index} onClick={() => onItemClick(item)}>
                            {item.name}
                        </p>
                    ))
                ) : (
                    <p>No matching entities found.</p>
                )}
            </div>
        </div>
    );
};

export default SearchBox;
