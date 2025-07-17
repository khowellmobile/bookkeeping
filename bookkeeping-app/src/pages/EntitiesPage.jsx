import { useState, useContext, useEffect } from "react";

import classes from "./EntitiesPage.module.css";

import EntitiesCtx from "../components/contexts/EntitiesCtx";
import TransactionsCtx from "../components/contexts/TransactionsCtx";
import penIcon from "../assets/pen-icon.svg";
import TransactionItem from "../components/elements/items/TransactionItem";
import AddEntityModal from "../components/elements/modals/AddEntityModal";
import ConfirmationModal from "../components/elements/modals/ConfirmationModal";
import SearchBox from "../components/elements/misc/SearchBox";
import NoResultsDisplay from "../components/elements/misc/NoResultsDisplay";

const EntitiesPage = () => {
    const { ctxEntityList, ctxUpdateEntity, ctxActiveEntity, setCtxActiveEntity } = useContext(EntitiesCtx);
    const { ctxTranList, setCtxTranList, setCtxFilterBy } = useContext(TransactionsCtx);

    const [inputFields, setInputFields] = useState({
        name: "",
        company: "",
        address: "",
        created_at: "",
        phone_number: "",
        email: "",
        is_deleted: "",
    });

    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const [confirmAction, setConfirmAction] = useState({
        type: null,
        payload: null,
    });

    useEffect(() => {
        setCtxFilterBy("entity");
    }, []);

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

    const isEntityChanged = () => {
        return (
            inputFields.name != ctxActiveEntity.name ||
            inputFields.company != ctxActiveEntity.company ||
            inputFields.address != ctxActiveEntity.address ||
            inputFields.phone_number != ctxActiveEntity.phone_number ||
            inputFields.email != ctxActiveEntity.email
        );
    };

    const handleEntitySwitch = (item) => {
        if (ctxActiveEntity && item.id !== ctxActiveEntity.id && isEntityChanged()) {
            setIsConfirmModalOpen(true);
            setConfirmAction({
                type: "switch_active",
                payload: item,
            });
        } else {
            setCtxActiveEntity(item);
        }
    };

    const handleCancelClick = () => {
        if (isEntityChanged()) {
            setIsConfirmModalOpen(true);
            setConfirmAction({
                type: "switch_active",
                payload: ctxActiveEntity,
            });
        } else {
            setIsEditing(false);
        }
    };

    const handleDeleteClick = () => {
        setIsConfirmModalOpen(true);
        setConfirmAction({
            type: "delete_entity",
            payload: null,
        });
    };

    const handleSaveClick = () => {
        ctxUpdateEntity({ id: ctxActiveEntity.id, ...inputFields });
        setIsEditing(false);
    };

    const onConfirmModalAction = () => {
        setIsConfirmModalOpen(false);
        switch (confirmAction.type) {
            case "switch_active":
                setCtxActiveEntity(confirmAction.payload);
                setIsEditing(false);
                return;
            case "delete_entity":
                ctxUpdateEntity({ id: ctxActiveEntity.id, is_deleted: true });
                setIsEditing(false);
                return;
            default:
        }
    };

    const onCancelModalAction = () => {
        setIsConfirmModalOpen(false);
        setConfirmAction({ type: null, payload: null });
    };

    const getModalText = () => {
        switch (confirmAction.type) {
            case "switch_active":
                return {
                    msg: "You have unsaved changes. Are you sure you want to discard them?",
                    confirm_txt: "Discard Changes",
                    cancel_txt: "Keep Editing",
                };
            case "delete_entity":
                return {
                    msg: "Are you sure you wish to delete this Entity?",
                    confirm_txt: "Delete",
                    cancel_txt: "Cancel Deletion",
                };
            default:
                return { msg: "", confirm_txt: "", cancel_txt: "" };
        }
    };

    // Setting fields to selected entity
    useEffect(() => {
        if (ctxActiveEntity) {
            setInputFields({
                name: ctxActiveEntity.name || "",
                company: ctxActiveEntity.company || "",
                address: ctxActiveEntity.address || "",
                created_at: ctxActiveEntity.created_at || "",
                phone_number: ctxActiveEntity.phone_number || "",
                email: ctxActiveEntity.email || "",
            });
        }
    }, [ctxActiveEntity]);

    return (
        <>
            {isModalOpen && <AddEntityModal handleCloseModal={handleCloseModal} />}

            {isConfirmModalOpen && confirmAction.type && (
                <ConfirmationModal
                    text={getModalText()}
                    onConfirm={onConfirmModalAction}
                    onCancel={onCancelModalAction}
                />
            )}

            <div className={classes.mainContainer}>
                <SearchBox
                    itemName={"Entity"}
                    items={ctxEntityList}
                    onItemClick={handleEntitySwitch}
                    onAddButtonClick={() => setIsModalOpen(true)}
                />
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
                                    <button className={classes.button} onClick={handleSaveClick}>
                                        Save
                                    </button>
                                    <button className={classes.button} onClick={handleDeleteClick}>
                                        Delete
                                    </button>
                                    <button className={classes.button} onClick={handleCancelClick}>
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {ctxActiveEntity && (
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
                                <NoResultsDisplay
                                    mainText={"No Transactions to load."}
                                    guideText={"Have you chosen a Property and Entity?"}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EntitiesPage;
