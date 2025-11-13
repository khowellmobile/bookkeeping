/*
 * Tests for JournalEntryItem component.
 *
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { JournalEntryItem } from "@/src/components/elements/items/InputEntryItems";

// Mocking enviroment variables
jest.mock("@/src/constants", () => ({
    ENVIRONMENT: "test",
    BASE_URL: "http://test-url.com",
}));

// Mocking required child components
jest.mock("@/src/components/elements/utilities/Input", () => ({ type, name, value, onChange }) => (
    <input data-testid={`${name}-input`} type="text" name={name} value={value} onChange={onChange} />
));
jest.mock("@/src/components/elements/dropdowns/AccountEntryDropdown", () => ({ vals, onChange }) => (
    <div data-testid="account-dropdown">
        <button onClick={() => onChange({ id: 88, name: "New Account" })}>Select Account</button>
    </div>
));

// Mock props for rendering
const mockVals = {
    account: { id: 2, name: "Initial Account" },
    memo: "Initial Memo",
    amount: "200.50",
    type: "debit",
};
const mockIndex = 1;
const mockOnFocus = jest.fn();
const mockOnItemChange = jest.fn();
const mockScrollRef = { current: document.createElement("div") };

// Helper function to render the component
const renderJournalEntryItem = (props = {}) => {
    const defaultProps = {
        vals: mockVals,
        index: mockIndex,
        onFocus: mockOnFocus,
        onItemChange: mockOnItemChange,
        scrollRef: mockScrollRef,
        ...props,
    };
    return render(<JournalEntryItem {...defaultProps} />);
};

describe("JournalEntryItem Initialization and Rendering", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should initialize and display inputs based on vals prop (type: debit)", () => {
        renderJournalEntryItem();

        expect(screen.getByDisplayValue("Initial Memo")).toBeInTheDocument();

        const debitInput = screen.getByTestId("debit-input");
        const creditInput = screen.getByTestId("credit-input");

        expect(debitInput).toHaveValue("200.50");
        expect(creditInput).toHaveValue("");
    });

    it("should correctly render when initial type is 'credit'", () => {
        const creditVals = { ...mockVals, type: "credit", amount: "150.00" };
        renderJournalEntryItem({ vals: creditVals });

        const debitInput = screen.getByTestId("debit-input");
        const creditInput = screen.getByTestId("credit-input");

        expect(creditInput).toHaveValue("150.00");
        expect(debitInput).toHaveValue("");
    });
});

describe("Input Change Handlers (Immediate Callbacks)", () => {
    beforeEach(() => {
        renderJournalEntryItem();
        jest.clearAllMocks();
    });

    it("should call onItemChange immediately when the memo input is changed", () => {
        const memoInput = screen.getByTestId("memo-input");

        fireEvent.change(memoInput, { target: { value: "Updated Memo Entry" } });

        expect(mockOnItemChange).toHaveBeenCalledTimes(1);
        expect(mockOnItemChange).toHaveBeenCalledWith(mockIndex, "memo", "Updated Memo Entry");
    });

    it("should call onItemChange immediately and set type to 'debit' when debit field is changed", () => {
        const debitInput = screen.getByTestId("debit-input");

        fireEvent.change(debitInput, { target: { name: "debit", value: "300.00" } });

        expect(mockOnItemChange).toHaveBeenCalledTimes(1);
        expect(mockOnItemChange).toHaveBeenCalledWith(mockIndex, "debit", "300.00");
    });

    it("should call onItemChange immediately and set type to 'credit' when credit field is changed", () => {
        const creditInput = screen.getByTestId("credit-input");

        fireEvent.change(creditInput, { target: { name: "credit", value: "75.25" } });

        expect(mockOnItemChange).toHaveBeenCalledTimes(1);
        expect(mockOnItemChange).toHaveBeenCalledWith(mockIndex, "credit", "75.25");
    });
});

describe("Dropdown Change Handler (Immediate Callback)", () => {
    beforeEach(() => {
        renderJournalEntryItem();
        jest.clearAllMocks();
    });

    it("should call onItemChange immediately when a new account is selected", () => {
        const selectButton = screen.getByText("Select Account");

        fireEvent.click(selectButton);

        const newAccount = { id: 88, name: "New Account" };

        expect(mockOnItemChange).toHaveBeenCalledTimes(1);
        expect(mockOnItemChange).toHaveBeenCalledWith(mockIndex, "account", newAccount);
    });
});

describe("Focus Handler", () => {
    beforeEach(() => {
        renderJournalEntryItem();
        jest.clearAllMocks();
    });

    it("should call onFocus prop when the component receives focus", () => {
        const container = screen.getByRole("application");

        fireEvent.focus(container);

        expect(mockOnFocus).toHaveBeenCalledTimes(1);
    });
});
