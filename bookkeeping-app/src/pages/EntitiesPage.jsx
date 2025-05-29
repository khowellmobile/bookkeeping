import classes from "./EntitiesPage.module.css";

import BkpgContext from "../components/contexts/BkpgContext";
import { useState, useContext, useEffect } from "react";

import penIcon from "../assets/pen-icon.svg";

import TransactionItem from "../components/elements/items/TransactionItem";

const EntitiesPage = () => {
    const { populateCtxTransactions, populateCtxEntities, ctxEntityList } = useContext(BkpgContext);

    const [transactions, setTransactions] = useState([]);
    const [entities, setEntities] = useState([]);
    const [activeEntity, setActiveEntity] = useState();
    const [filteredEntities, setFilteredEntities] = useState([]);
    const [inputFields, setInputFields] = useState({
        name: "",
        company: "",
        address: "",
        created_at: "",
        phone_number: "",
        email: "",
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(name, " ", value);
        setInputFields((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        const ctxAccessToken = localStorage.getItem("accessToken");
        try {
            const response = await fetch(`http://localhost:8000/api/entities/${activeEntity.id}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ctxAccessToken}`,
                },
                body: JSON.stringify(inputFields),
            });
            const data = await response.json();
            console.log(data);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (e) {
            console.log("Error: " + e);
        }

        setIsEditing(false);
    };

    useEffect(() => {
        if (ctxEntityList && ctxEntityList.length > 0) {
            setEntities(ctxEntityList);
        }
    }, [ctxEntityList]);

    // load transactions on mount
    useEffect(() => {
        const fetchTran = async () => {
            const data = await populateCtxTransactions();
            setTransactions(data);
        };

        fetchTran();
    }, []);

    // Filtering results by search term
    useEffect(() => {
        if (entities) {
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            const filtered = entities.filter((entity) => entity.name.toLowerCase().includes(lowercasedSearchTerm));
            setFilteredEntities(filtered);
        }
    }, [searchTerm, entities]);

    // Setting fields to selected entity
    useEffect(() => {
        if (activeEntity) {
            setInputFields({
                name: activeEntity.name || "",
                company: activeEntity.company || "",
                address: activeEntity.address || "",
                created_at: activeEntity.created_at || "",
                phone_number: activeEntity.phone_number || "",
                email: activeEntity.email || "",
            });
        }
    }, [activeEntity]);

    return (
        <>
            <div className={classes.mainContainer}>
                <div className={classes.searchBox}>
                    <input
                        type="text"
                        className={classes.entitySerach}
                        placeholder="Search..."
                        spellCheck="false"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                        }}
                    ></input>
                    <div className={classes.entityListing}>
                        {filteredEntities && filteredEntities.length > 0 ? (
                            filteredEntities.map((entity, index) => (
                                <p key={index} onClick={() => setActiveEntity(entity)}>
                                    {entity.name}
                                </p>
                            ))
                        ) : (
                            <p>No matching entities found.</p>
                        )}
                    </div>
                </div>
                <div className={classes.contentBox}>
                    <div className={classes.entityInfo}>
                        <div className={`${classes.header} ${isEditing ? classes.editing : ""}`}>
                            <input
                                type="text"
                                name="name"
                                value={inputFields.name}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                            {isEditing ? (
                                <div>
                                    <button onClick={handleSave}>Save</button>
                                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                                </div>
                            ) : (
                                <img
                                    src={penIcon}
                                    className={classes.icon}
                                    alt="Icon"
                                    onClick={() => setIsEditing(true)}
                                />
                            )}
                        </div>
                        <div className={classes.inputs}>
                            <div className={classes.genInfo}>
                                <h3>General Information</h3>
                                <div>
                                    <div className={`${classes.cluster} ${isEditing ? classes.editing : ""}`}>
                                        <p>Company:</p>
                                        <input
                                            type="text"
                                            name="company"
                                            value={inputFields.company}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className={`${classes.cluster} ${isEditing ? classes.editing : ""}`}>
                                        <p>Address:</p>
                                        <input
                                            type="text"
                                            name="address"
                                            value={inputFields.address}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className={classes.cluster}>
                                        <p>Added:</p>
                                        <input type="text" value={inputFields.created_at} disabled={true} />
                                    </div>
                                </div>
                            </div>
                            <div className={classes.contactInfo}>
                                <h3>Contact</h3>
                                <div>
                                    <div className={`${classes.cluster} ${isEditing ? classes.editing : ""}`}>
                                        <p>Phone Number:</p>
                                        <input
                                            type="text"
                                            name="phone_number"
                                            value={inputFields.phone_number}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className={`${classes.cluster} ${isEditing ? classes.editing : ""}`}>
                                        <p>Email:</p>
                                        <input
                                            type="text"
                                            name="email"
                                            value={inputFields.email}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={classes.transactionListing}>
                        <div className={classes.listingHeader}>
                            <p>Date</p>
                            <p>Payee</p>
                            <p>Account</p>
                            <p>Memo</p>
                            <p>Amount</p>
                            <p>Reconciled</p>
                        </div>
                        <div className={classes.listingItems}>
                            {transactions && transactions.length > 0 ? (
                                transactions.map((transaction, index) => (
                                    <TransactionItem vals={transaction} setPageTrans={setTransactions} key={index} />
                                ))
                            ) : (
                                <p>No matching transactions listed.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EntitiesPage;
