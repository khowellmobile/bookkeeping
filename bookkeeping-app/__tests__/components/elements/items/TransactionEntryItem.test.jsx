/*
 * Tests for TransactionEntryItem component.
 *
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { TransactionEntryItem } from "@/src/components/elements/items/InputEntryItems";

// Mocking components
jest.mock("@/src/components/elements/utilities/Input", () => ({ name, value, onChange }) => (
    <input data-testid={`${name}-input`} type="text" name={name} value={value} onChange={onChange} />
));
jest.mock("@/src/components/elements/dropdowns/EntityEntryDropdown", () => ({ onChange }) => (
    <div data-testid="entity-dropdown">
        <button onClick={() => onChange({ id: 99, name: "New Entity" })}>Select Entity</button>
    </div>
));
jest.mock("@/src/components/elements/dropdowns/AccountEntryDropdown", () => ({ onChange }) => (
    <div data-testid="account-dropdown">
        <button onClick={() => onChange({ id: 88, name: "New Account" })}>Select Account</button>
    </div>
));

// Mock props for rendering
const mockVals = {
    date: "2025-10-24",
    entity: { id: 1, name: "Initial Entity" },
    account: { id: 2, name: "Initial Account" },
    memo: "Initial Memo",
    amount: "100.00",
    type: "debit",
};
const mockOnFocus = jest.fn();
const mockOnItemChange = jest.fn();
const mockScrollRef = { current: document.createElement("div") };

// Helper function to render the component
const renderTransactionEntryItem = (props = {}) => {
    const defaultProps = {
        vals: mockVals,
        index: 0,
        onFocus: mockOnFocus,
        onItemChange: mockOnItemChange,
        scrollRef: mockScrollRef,
        ...props,
    };
    return render(<TransactionEntryItem {...defaultProps} />);
};

describe("TransactionEntryItem Initialization and Rendering", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should initialize and display inputs based on vals prop", () => {
        renderTransactionEntryItem();

        expect(screen.getByDisplayValue("2025-10-24")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Initial Memo")).toBeInTheDocument();

        const debitInput = screen.getByTestId("debit-input");
        const creditInput = screen.getByTestId("credit-input");
        expect(debitInput).toHaveValue("100.00");
        expect(creditInput).toHaveValue("");
    });

    it("should correctly render when initial type is 'credit'", () => {
        const creditVals = { ...mockVals, type: "credit", amount: "50.00" };
        renderTransactionEntryItem({ vals: creditVals });

        // Initial type is 'credit', so credit field gets amount, debit field is empty
        const debitInput = screen.getByTestId("debit-input");
        const creditInput = screen.getByTestId("credit-input");
        expect(creditInput).toHaveValue("50.00");
        expect(debitInput).toHaveValue("");
    });
});

describe("Input Change Handlers (valueChange)", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderTransactionEntryItem();
    });

    it("should update state for simple text inputs like 'date'", () => {
        const dateInput = screen.getByTestId("date-input");
        fireEvent.change(dateInput, { target: { name: "date", value: "2025-10-25" } });

        expect(dateInput).toHaveValue("2025-10-25");
    });

    it("should update state for simple text inputs like 'memo'", () => {
        const memoInput = screen.getByTestId("memo-input");
        fireEvent.change(memoInput, { target: { name: "memo", value: "New Memo Text" } });

        expect(memoInput).toHaveValue("New Memo Text");
    });

    it("should update amount and set type to 'debit' when debit field is changed", () => {
        const debitInput = screen.getByTestId("debit-input");
        const creditInput = screen.getByTestId("credit-input");

        fireEvent.change(debitInput, { target: { name: "debit", value: "250.75" } });

        expect(debitInput).toHaveValue("250.75");
        expect(creditInput).toHaveValue("");
    });

    it("should update amount and set type to 'credit' when credit field is changed", () => {
        const debitInput = screen.getByTestId("debit-input");
        const creditInput = screen.getByTestId("credit-input");

        fireEvent.change(creditInput, { target: { name: "credit", value: "75.50" } });

        expect(creditInput).toHaveValue("75.50");
        expect(debitInput).toHaveValue("");
    });

    it("should clear the amount state if a non-numeric value is entered in amount fields", () => {
        const debitInput = screen.getByTestId("debit-input");

        fireEvent.change(debitInput, { target: { name: "debit", value: "abc" } });

        expect(debitInput).toHaveValue("");
    });
});

describe("Dropdown Change Handlers", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderTransactionEntryItem();
    });

    it("should update state when a new entity is selected from the dropdown", () => {
        const entityButton = screen.getByText("Select Entity");
        fireEvent.click(entityButton);

        expect(entityButton).toBeInTheDocument();

        // After selecting, trigger blur to confirm state change via onItemChange
        fireEvent.blur(screen.getByRole("application"));

        expect(mockOnItemChange).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ entity: { id: 99, name: "New Entity" } })
        );
    });

    it("should update state when a new account is selected from the dropdown", () => {
        const accountButton = screen.getByText("Select Account");
        fireEvent.click(accountButton);

        // After selecting, trigger blur to confirm state change via onItemChange
        fireEvent.blur(screen.getByRole("application"));

        expect(mockOnItemChange).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ account: { id: 88, name: "New Account" } })
        );
    });
});

describe("Focus and Blur Handlers", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderTransactionEntryItem();
    });

    it("should call onFocus prop when the component receives focus", () => {
        const container = screen.getByRole("application"); 

        fireEvent.focus(container);

        expect(mockOnFocus).toHaveBeenCalledTimes(1);
    });

    it("should call onItemChange prop with the current state when the component loses focus (onBlur)", () => {
        const container = screen.getByRole("application");

        const memoInput = screen.getByTestId("memo-input");
        fireEvent.change(memoInput, { target: { name: "memo", value: "Updated Memo" } });

        fireEvent.blur(container);

        expect(mockOnItemChange).toHaveBeenCalledTimes(1);
        expect(mockOnItemChange).toHaveBeenCalledWith(
            0, 
            expect.objectContaining({
                memo: "Updated Memo",
                date: mockVals.date,
                type: mockVals.type,
            })
        );
    });
});
