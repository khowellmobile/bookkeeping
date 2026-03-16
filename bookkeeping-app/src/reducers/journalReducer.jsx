const EMPTY_ITEM = {
    account: "",
    amount: "",
    memo: "",
    type: "",
};

const makeEmptyItems = (count = 14) => Array.from({ length: count }, () => ({ ...EMPTY_ITEM }));

const createInitialJournalState = () => ({
    name: "",
    date: "",
    items: makeEmptyItems(),
    activeJournal: null,
    isEditing: false,
});

const initialJournalState = createInitialJournalState();

function journalReducer(state, action) {
    switch (action.type) {
        case "UPDATE_FIELD":
            return { ...state, [action.field]: action.value };
        case "UPDATE_ITEM": {
            const newItems = [...state.items];
            newItems[action.index] = { ...newItems[action.index], ...action.payload };
            return { ...state, items: newItems };
        }
        case "ADD_ROW":
            return { ...state, items: [...state.items, { ...EMPTY_ITEM }] };
        case "SET_ACTIVE":
            return {
                name: action.payload.name,
                date: action.payload.date,
                items: action.payload.journal_items || [],
                activeJournal: action.payload,
                isEditing: true,
            };
        case "TOGGLE_EDITING":
            return { ...state, isEditing: !state.isEditing };
        case "RESET":
            return createInitialJournalState();
        default:
            return state;
    }
}

export { initialJournalState };
export default journalReducer;
