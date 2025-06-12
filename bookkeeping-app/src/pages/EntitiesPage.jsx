import classes from "./EntitiesPage.module.css";

import EntitiesCtx from "../components/contexts/EntitiesCtx";
import TransactionsCtx from "../components/contexts/TransactionsCtx";

import { useState, useContext, useEffect } from "react";

import penIcon from "../assets/pen-icon.svg";

import TransactionItem from "../components/elements/items/TransactionItem";
import AddEntityModal from "../components/elements/modals/AddEntityModal";
import ConfirmationModal from "../components/elements/modals/ConfirmationModal";

const EntitiesPage = () => {
    const { ctxEntityList, ctxUpdateEntity } = useContext(EntitiesCtx);
    const { populateCtxTransactions, ctxTranList, setCtxTranList } = useContext(TransactionsCtx);

    const [activeEntity, setActiveEntity] = useState();
    const [filteredEntities, setFilteredEntities] = useState([]);
    const [inputFields, setInputFields] = useState({
        name: "",
        company: "",
        address: "",
        created_at: "",
        phone_number: "",
        email: "",
        is_deleted: "",
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputFields((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Filtering results by search term
    useEffect(() => {
        if (ctxEntityList) {
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            const filtered = ctxEntityList.filter((entity) => entity.name.toLowerCase().includes(lowercasedSearchTerm));
            setFilteredEntities(filtered);
        }
    }, [searchTerm, ctxEntityList]);

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

    const handleConfirmAction = (action) => {
        if (action == "closeEdit") {
            const entityWasEdited =
                inputFields.name != activeEntity.name ||
                inputFields.company != activeEntity.company ||
                inputFields.address != activeEntity.address ||
                inputFields.phone_number != activeEntity.phone_number ||
                inputFields.email != activeEntity.email;

            if (entityWasEdited) {
                setIsConfirmModalOpen(true);
            } else {
                setIsEditing(false);
            }
        } else if (action == "update") {
            ctxUpdateEntity({ id: activeEntity.id, ...inputFields });
            setIsEditing(false);
        } else if (action == "delete") {
            setIsDeleteModalOpen(true);
        } else {
            console.error("Action not recognized");
        }
    };

    const onConfirm = () => {
        setIsConfirmModalOpen(false);
        setIsEditing(false);
    };

    const onCancel = () => {
        setIsConfirmModalOpen(false);
    };

    const onConfirmDelete = () => {
        ctxUpdateEntity({ id: activeEntity.id, is_deleted: true });
        setIsDeleteModalOpen(false);
    };

    const onCancelDelete = () => {
        setIsDeleteModalOpen(false);
    };

    return (
        <>
            {isModalOpen && <AddEntityModal handleCloseModal={handleCloseModal} />}
            {isConfirmModalOpen && (
                <ConfirmationModal
                    text={{
                        msg: "You are above to leave without saving.",
                        confirm_txt: "Leave",
                        cancel_txt: "Stay",
                    }}
                    onConfirm={onConfirm}
                    onCancel={onCancel}
                />
            )}

            {isDeleteModalOpen && (
                <ConfirmationModal
                    text={{
                        msg: "Are you sure you wish to delete this Entity?",
                        confirm_txt: "Delete",
                        cancel_txt: "Cancel Deletion",
                    }}
                    onConfirm={onConfirmDelete}
                    onCancel={onCancelDelete}
                />
            )}

            <div className={classes.mainContainer}>
                <div className={classes.searchBox}>
                    <div className={classes.searchBoxTools}>
                        <button className={classes.button} onClick={() => setIsModalOpen(true)}>
                            Add Entity
                        </button>
                    </div>
                    <input
                        type="text"
                        className={classes.entitySearch}
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
                                    <button className={classes.button} onClick={() => handleConfirmAction("update")}>
                                        Save
                                    </button>
                                    <button className={classes.button} onClick={() => handleConfirmAction("delete")}>
                                        Delete
                                    </button>
                                    <button className={classes.button} onClick={() => handleConfirmAction("closeEdit")}>
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {activeEntity && (
                                        <img
                                            src={penIcon}
                                            className={classes.icon}
                                            alt="Icon"
                                            onClick={() => setIsEditing(true)}
                                        />
                                    )}
                                </>
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
                            {ctxTranList && ctxTranList.length > 0 ? (
                                ctxTranList.map((transaction, index) => (
                                    <TransactionItem vals={transaction} setPageTrans={setCtxTranList} key={index} />
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
