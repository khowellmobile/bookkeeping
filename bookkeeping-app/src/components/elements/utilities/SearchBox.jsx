import { useState, useEffect } from "react";

import classes from "./SearchBox.module.css";
import Button from "./Button";

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
                <Button onClick={onAddButtonClick} text={`Add ${itemName}`} />
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
                    <p>No matching items found.</p>
                )}
            </div>
        </div>
    );
};

export default SearchBox;
