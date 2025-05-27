import classes from "./EntitiesPage.module.css";

import BkpgContext from "../components/contexts/BkpgContext";
import { useState, useContext, useEffect } from "react";

import penIcon from "../assets/pen-icon.svg";

import TransactionItem from "../components/elements/items/TransactionItem";

const EntitiesPage = () => {
    const { populateCtxTransactions, populateCtxEntities, ctxEntityList } = useContext(BkpgContext);

    const [transactions, setTransactions] = useState([]);
    const [entities, setEntities] = useState([]);
    const [activeEntity, setActiveEntity] = useState({});
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
    const [isEditing, setIsEditing] = useState(true);

    const handleEditClick = () => {
        setIsEditing((prev) => !prev);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputFields((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (ctxEntityList && ctxEntityList.length > 0) {
            setEntities(ctxEntityList);
            setActiveEntity(ctxEntityList[0]);
            setInputFields({
                name: ctxEntityList[0].name || "",
                company: ctxEntityList[0].company || "",
                address: ctxEntityList[0].address || "",
                created_at: ctxEntityList[0].created_at || "",
                phone_number: ctxEntityList[0].phone_number || "",
                email: ctxEntityList[0].email || "",
            });
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

    useEffect(() => {
        if (entities) {
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            const filtered = entities.filter(
                (entity) =>
                    entity.name.toLowerCase().includes(lowercasedSearchTerm) ||
                    entity.company.toLowerCase().includes(lowercasedSearchTerm) ||
                    entity.address.toLowerCase().includes(lowercasedSearchTerm)
            );
            setFilteredEntities(filtered);
        }
    }, [searchTerm, entities]);

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
                        {entities && entities.length > 0 ? (
                            entities.map((entity, index) => <p key={index}>{entity.name}</p>)
                        ) : (
                            <p>No matching entities found.</p>
                        )}
                    </div>
                </div>
                <div className={classes.contentBox}>
                    <div className={classes.entityInfo}>
                        <div className={classes.header}>
                            <h2>{activeEntity ? activeEntity.name : "Select an Entity"}</h2>
                            <img src={penIcon} className={classes.icon} alt="Icon" onClick={handleEditClick} />
                        </div>
                        <div className={classes.inputs}>
                            <div className={classes.genInfo}>
                                <h3>General Information</h3>
                                <div>
                                    <div className={`${classes.cluster} ${isEditing ? classes.editing : ""}`}>
                                        <p>Company:</p>
                                        <input
                                            type="text"
                                            value={inputFields.company}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className={`${classes.cluster} ${isEditing ? classes.editing : ""}`}>
                                        <p>Address:</p>
                                        <input
                                            type="text"
                                            value={inputFields.address}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className={`${classes.cluster} ${isEditing ? classes.editing : ""}`}>
                                        <p>Added:</p>
                                        <input
                                            type="text"
                                            value={inputFields.created_at}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        />
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
