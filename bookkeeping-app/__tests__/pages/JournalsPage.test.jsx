/*
 *   Tests for JournalsPage component.
 *
 */

import { render, screen, fireEvent } from "@testing-library/react";
import JournalsPage from "@/src/pages/JournalsPage";

const mockUseJournal = jest.fn();
const mockShowConfirmModal = jest.fn();
const mockResetJournal = jest.fn();
const mockSetToJournal = jest.fn();
const mockCancelEdits = jest.fn();
const mockHandleItemChange = jest.fn();
const mockUpdateField = jest.fn();
const mockDeleteJournal = jest.fn();
const mockSaveInfo = jest.fn();

jest.mock("@/src/hooks/useJournal", () => ({
    useJournal: () => mockUseJournal(),
}));
jest.mock("@/src/contexts/ConfirmModalCtx", () => ({
    useConfirmModal: () => ({
        showConfirmModal: mockShowConfirmModal,
    }),
}));
jest.mock("@/src/components/elements/utilities/NoResultsDisplay", () => ({ mainText, guideText }) => (
    <div data-testid="no-results-display">
        <p>{mainText}</p>
        <span>{guideText}</span>
    </div>
));
jest.mock("@/src/components/elements/utilities/Input", () => ({ type, value, onChange, placeholder }) => (
    <input data-testid={`input-${type}`} type={type} value={value} onChange={onChange} placeholder={placeholder} />
));
jest.mock("@/src/components/elements/items/InputEntryItems", () => ({
    JournalEntryItem: ({ vals, index, onItemChange }) => (
        <div data-testid={`journal-entry-item-${index}`} onClick={() => onItemChange(index, vals)}>
            <p>{vals.memo || "Journal Entry Item"}</p>
        </div>
    ),
}));
jest.mock("@/src/components/elements/utilities/Button", () => ({ text, onClick }) => (
    <button onClick={onClick}>{text}</button>
));

const getMockJournalValues = (overrides = {}) => {
    const baseState = {
        name: "Opening Entry",
        date: "2026-04-01",
        items: [{ id: 1, memo: "Rent collected" }],
        activeJournal: null,
        isEditing: false,
    };

    return {
        state: { ...baseState, ...(overrides.state || {}) },
        journalList: [
            { id: 1, date: "2026-04-01", name: "Opening Entry" },
            { id: 2, date: "2026-04-10", name: "Repair Entry" },
        ],
        resetJournal: mockResetJournal,
        setToJournal: mockSetToJournal,
        cancelEdits: mockCancelEdits,
        debitTotal: 100,
        creditTotal: 100,
        isJournalChanged: false,
        handleFocusLastItem: jest.fn(),
        handleItemChange: mockHandleItemChange,
        updateField: mockUpdateField,
        deleteJournal: mockDeleteJournal,
        saveInfo: mockSaveInfo,
        ...overrides,
        state: { ...baseState, ...(overrides.state || {}) },
    };
};

const renderJournalsPage = (overrides = {}) => {
    mockUseJournal.mockReturnValue(getMockJournalValues(overrides));
    return render(<JournalsPage />);
};

describe("JournalsPage initial render", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderJournalsPage();
    });

    it("should render the journal history and entry form on mount", () => {
        expect(screen.getByText("Journal History")).toBeInTheDocument();
        expect(screen.getByText("Make an Entry")).toBeInTheDocument();
        expect(screen.getByText("Opening Entry")).toBeInTheDocument();
        expect(screen.getByText("Rent collected")).toBeInTheDocument();
        expect(screen.getByText("Save Entry")).toBeInTheDocument();
    });

    it("should show the totals error when debits and credits do not match", () => {
        jest.clearAllMocks();
        renderJournalsPage({ debitTotal: 100, creditTotal: 50 });

        expect(screen.getByText("Totals need to match")).toBeInTheDocument();
    });
});

describe("JournalsPage history interactions", () => {
    it("should load a journal directly when there are no unsaved changes", () => {
        jest.clearAllMocks();
        renderJournalsPage();

        fireEvent.click(screen.getByText("Repair Entry"));

        expect(mockSetToJournal).toHaveBeenCalledWith(1);
        expect(mockShowConfirmModal).not.toHaveBeenCalled();
    });

    it("should show a discard confirmation when unsaved changes exist", () => {
        jest.clearAllMocks();
        renderJournalsPage({ isJournalChanged: true });

        fireEvent.click(screen.getByText("Repair Entry"));

        expect(mockShowConfirmModal).toHaveBeenCalled();
    });
});

describe("JournalsPage entry actions", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderJournalsPage({
            state: {
                activeJournal: { id: 1, name: "Opening Entry" },
                isEditing: true,
            },
            isJournalChanged: true,
        });
    });

    it("should call saveInfo when the save button is clicked", () => {
        fireEvent.click(screen.getByText("Save Edits"));

        expect(mockSaveInfo).toHaveBeenCalled();
    });

    it("should confirm and run the delete flow when delete is clicked", () => {
        mockShowConfirmModal.mockImplementationOnce((text, onConfirm) => onConfirm());

        fireEvent.click(screen.getByText("Delete Entry"));

        expect(mockDeleteJournal).toHaveBeenCalledWith(1);
        expect(mockResetJournal).toHaveBeenCalled();
    });
});
