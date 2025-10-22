/*
 *   Tests for TransactionModal component.
 *
 */

import { render, screen, fireEvent } from "@testing-library/react";
import TransactionModal from "@/src/components/elements/modals/TransactionModal";
import TransactionsCtx from "@/src/components/contexts/TransactionsCtx";

// Mocking enviroment variables
jest.mock("@/src/constants", () => ({
    ENVIRONMENT: "test",
    BASE_URL: "http://test-url.com",
}));

// Mocking context provider
const mockUpdateTransaction = jest.fn();
const MockTransactionsCtxProvider = ({ children }) => (
    <TransactionsCtx.Provider value={{ ctxUpdateTransaction: mockUpdateTransaction }}>
        {children}
    </TransactionsCtx.Provider>
);

// Mocking child components used within TransactionModal
jest.mock("@/src/components/elements/dropdowns/AccountDropdown.jsx", () => (props) => (
    <div data-testid="account-dropdown" onClick={() => props.onChange("New Account")} />
));
jest.mock("@/src/components/elements/dropdowns/EntityDropdown.jsx", () => (props) => (
    <div data-testid="entity-dropdown" onClick={() => props.onChange("New Entity")} />
));
jest.mock("@/src/components/elements/modals/ConfirmationModal.jsx", () => ({ text, onConfirm }) => (
    <div data-testid="confirmation-modal">
        <button data-testid="confirm-delete-action" onClick={onConfirm}>
            {text.confirm_txt}
        </button>
    </div>
));
jest.mock("@/src/components/elements/misc/Input.jsx", () => ({ name, value, onChange }) => (
    <input data-testid={`input-${name}`} name={name} value={value} onChange={onChange} />
));
jest.mock("@/src/components/elements/utilities/Button.jsx", () => ({ text, onClick }) => (
    <button onClick={onClick}>{text}</button>
));

// Defining mocked props
const mockProps = {
    vals: {
        id: 1,
        date: "2025-10-21",
        entity: "Payee Name",
        account: "Checking",
        amount: "100.00",
        type: "debit",
        memo: "Test Memo",
    },
    handleCloseModal: jest.fn(),
};

// Functon to create a transaction modal with context and props
const renderTransactionModal = (props = mockProps) => {
    return render(
        <MockTransactionsCtxProvider>
            <TransactionModal {...props} />
        </MockTransactionsCtxProvider>
    );
};

// Test suite to test input changes
describe("TransactionModal Input Changes", () => {
    beforeEach(() => {
        mockUpdateTransaction.mockClear();
        renderTransactionModal();
    });

    it("should update memo on user input of good value", () => {
        const newMemo = "Updated Memo for groceries";

        const memoInput = screen.getByTestId("input-memo");
        fireEvent.change(memoInput, { target: { value: newMemo, name: "memo" } });

        expect(memoInput.value).toBe(newMemo);
    });

    it("should allow input of valid numeric values in the debit field", () => {
        const newValue = 100.0;

        const amountInput = screen.getByTestId("input-debit");
        fireEvent.change(amountInput, { target: { value: newValue, name: "debit" } });

        expect(amountInput.value).toBe(newValue.toString());
    });

    it("should allow input of valid numeric values in the credit field", () => {
        const newValue = 200.0;

        const amountInput = screen.getByTestId("input-credit");
        fireEvent.change(amountInput, { target: { value: newValue, name: "credit" } });

        expect(amountInput.value).toBe(newValue.toString());
    });

    it("should NOT allow input of invalid alphabetic values in the debit field and clear input", () => {
        const invalidValue = "abc";

        const amountInput = screen.getByTestId("input-debit");
        fireEvent.change(amountInput, { target: { value: invalidValue, name: "debit" } });

        expect(amountInput.value).not.toBe(invalidValue);
        expect(amountInput.value).toBe("");
    });

    it("should NOT allow input of invalid alphabetic values in the credit field and clear input", () => {
        const invalidValue = "cba";

        const amountInput = screen.getByTestId("input-credit");
        fireEvent.change(amountInput, { target: { value: invalidValue, name: "credit" } });

        expect(amountInput.value).not.toBe(invalidValue);
        expect(amountInput.value).toBe("");
    });

    it("should NOT allow input of invalid alphanumeric values in the debit field and clear input", () => {
        const invalidValues = ["00.00.", "00..", "..", "100.ab", "..00", ".0.", "-10.00"];
        const amountInput = screen.getByTestId("input-debit");

        invalidValues.forEach((invalidValue) => {
            fireEvent.change(amountInput, { target: { value: "", name: "debit" } });
            fireEvent.change(amountInput, { target: { value: invalidValue, name: "debit" } });

            expect(amountInput.value).not.toBe(invalidValue);
            expect(amountInput.value).toBe("");
        });
    });

    it("should NOT allow input of invalid alphanumeric values in the credit field and clear input", () => {
        const invalidValues = ["00.00.", "00..", "..", "100.ab", "..00", ".0.", "-10.00"];
        const amountInput = screen.getByTestId("input-credit");

        invalidValues.forEach((invalidValue) => {
            fireEvent.change(amountInput, { target: { value: "", name: "credit" } });
            fireEvent.change(amountInput, { target: { value: invalidValue, name: "credit" } });

            expect(amountInput.value).not.toBe(invalidValue);
            expect(amountInput.value).toBe("");
        });
    });

    it("should update date on user input of good value", () => {
        const newDate = "2025-05-05";

        const dateInput = screen.getByTestId("input-date");
        fireEvent.change(dateInput, { target: { value: newDate, name: "date" } });

        expect(dateInput.value).toBe(newDate);
    });
});

describe("TransactionModal editedTransaction changes", () => {
    beforeEach(() => {
        mockUpdateTransaction.mockClear();
        renderTransactionModal();
    });

    it("should update editedTransaction memo on user input of good value and pass it to ctxUpdateTransaction on save", async () => {
        const newMemo = "Updated Memo for utilities";

        const memoInput = screen.getByTestId("input-memo");
        fireEvent.change(memoInput, { target: { value: newMemo, name: "memo" } });

        const saveButton = screen.getByRole("button", { name: "Save & Close" });
        fireEvent.click(saveButton);

        expect(mockUpdateTransaction).toHaveBeenCalledTimes(1);
        expect(mockUpdateTransaction).toHaveBeenCalledWith({
            id: mockProps.vals.id,
            memo: newMemo,
        });
    });

    it("should update editedTransaction amount and type on user input of good debit value and pass it to ctxUpdateTransaction on save", async () => {
        const newValue = 200.0;

        const amountInput = screen.getByTestId("input-debit");
        fireEvent.change(amountInput, { target: { value: newValue, name: "debit" } });

        const saveButton = screen.getByRole("button", { name: "Save & Close" });
        fireEvent.click(saveButton);

        expect(mockUpdateTransaction).toHaveBeenCalledTimes(1);
        expect(mockUpdateTransaction).toHaveBeenCalledWith({
            id: mockProps.vals.id,
            amount: newValue.toString(),
            type: "debit",
        });
    });

    it("should update editedTransaction amount and type on user input of good credit value and pass it to ctxUpdateTransaction on save", async () => {
        const newValue = 200.0;

        const amountInput = screen.getByTestId("input-credit");
        fireEvent.change(amountInput, { target: { value: newValue, name: "credit" } });

        const saveButton = screen.getByRole("button", { name: "Save & Close" });
        fireEvent.click(saveButton);

        expect(mockUpdateTransaction).toHaveBeenCalledTimes(1);
        expect(mockUpdateTransaction).toHaveBeenCalledWith({
            id: mockProps.vals.id,
            amount: newValue.toString(),
            type: "credit",
        });
    });

    it("should update editedTransaction date on user input of good value and pass it to ctxUpdateTransaction on save", async () => {
        const newDate = "2025-05-05";

        const dateInput = screen.getByTestId("input-date");
        fireEvent.change(dateInput, { target: { value: newDate, name: "date" } });

        const saveButton = screen.getByRole("button", { name: "Save & Close" });
        fireEvent.click(saveButton);

        expect(mockUpdateTransaction).toHaveBeenCalledTimes(1);
        expect(mockUpdateTransaction).toHaveBeenCalledWith({
            id: mockProps.vals.id,
            date: newDate,
        });
    });

    it("should update editedTransaction account on good value return from AccountDropdown", () => {
        const dropdown = screen.getByTestId("account-dropdown");

        fireEvent.click(dropdown);
        const saveButton = screen.getByRole("button", { name: "Save & Close" });
        fireEvent.click(saveButton);

        expect(mockUpdateTransaction).toHaveBeenCalledWith(
            expect.objectContaining({
                account: "New Account",
            })
        );
    });

    it("should update editedTransaction entity on good value return from EntityDropdown", () => {
        const dropdown = screen.getByTestId("entity-dropdown");

        fireEvent.click(dropdown);
        const saveButton = screen.getByRole("button", { name: "Save & Close" });
        fireEvent.click(saveButton);

        expect(mockUpdateTransaction).toHaveBeenCalledWith(
            expect.objectContaining({
                entity: "New Entity",
            })
        );
    });
});

describe("TransactionModal Delete Functionality", () => {
    beforeEach(() => {
        mockUpdateTransaction.mockClear();
        renderTransactionModal();
    });

    it("should updated edited transaction when delete is confirmed", () => {
        const saveButton = screen.getByRole("button", { name: "Delete" });
        fireEvent.click(saveButton);

        const confirmDeleteButton = screen.getByTestId("confirm-delete-action");
        fireEvent.click(confirmDeleteButton);

        expect(mockUpdateTransaction).toHaveBeenCalledTimes(1);
        expect(mockUpdateTransaction).toHaveBeenCalledWith({
            id: mockProps.vals.id,
            is_deleted: true,
        });
    });
});

describe("TransactionModal Validation (validateInputs", () => {
    const renderModal = (props) => {
        mockUpdateTransaction.mockClear();
        renderTransactionModal(props);
    };

    it("should prevent save and display error when Payee (entity) is empty", () => {
        const invalidProps = {
            vals: { id: 1, entity: "" },
            handleCloseModal: jest.fn(),
        };
        renderModal(invalidProps);

        const saveButton = screen.getByRole("button", { name: "Save & Close" });
        fireEvent.click(saveButton);

        expect(mockUpdateTransaction).not.toHaveBeenCalled();
        expect(screen.getByText("Error: Invalid fields. Edits were not saved.")).toBeInTheDocument();
    });

    it("should prevent save and display error when Account is empty", () => {
        const invalidProps = {
            vals: { id: 1, account: "" },
            handleCloseModal: jest.fn(),
        };
        renderModal(invalidProps);

        const saveButton = screen.getByRole("button", { name: "Save & Close" });
        fireEvent.click(saveButton);

        expect(mockUpdateTransaction).not.toHaveBeenCalled();
        expect(screen.getByText("Error: Invalid fields. Edits were not saved.")).toBeInTheDocument();
    });

    it("should prevent save and display error when Amount is empty", () => {
        const invalidProps = {
            vals: { id: 1, amount: "" },
            handleCloseModal: jest.fn(),
        };
        renderModal(invalidProps);

        const saveButton = screen.getByRole("button", { name: "Save & Close" });
        fireEvent.click(saveButton);

        expect(mockUpdateTransaction).not.toHaveBeenCalled();
        expect(screen.getByText("Error: Invalid fields. Edits were not saved.")).toBeInTheDocument();
    });

    it("should prevent save and display error when Amount is NaN", () => {
        const invalidProps = {
            vals: { id: 1, amount: "abd" },
            handleCloseModal: jest.fn(),
        };
        renderModal(invalidProps);

        const saveButton = screen.getByRole("button", { name: "Save & Close" });
        fireEvent.click(saveButton);

        expect(mockUpdateTransaction).not.toHaveBeenCalled();
        expect(screen.getByText("Error: Invalid fields. Edits were not saved.")).toBeInTheDocument();
    });
});
