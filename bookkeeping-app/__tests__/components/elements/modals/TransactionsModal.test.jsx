/*
 *   Tests for TransactionModal component.
 *
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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
jest.mock("@/src/components/elements/dropdowns/AccountDropdown.jsx", () => () => (
    <div data-testid="account-dropdown" />
));
jest.mock("@/src/components/elements/dropdowns/EntityDropdown.jsx", () => () => <div data-testid="entity-dropdown" />);
jest.mock("@/src/components/elements/modals/ConfirmationModal.jsx", () => () => (
    <div data-testid="confirmation-modal" />
));
jest.mock("@/src/components/elements/misc/Input.jsx", () => ({ name, value, onChange }) => (
    <input data-testid={`input-${name}`} name={name} value={value} onChange={onChange} />
));
jest.mock("@/src/components/elements/utilities/Button.jsx", () => ({ text, onClick }) => <button onClick={onClick}>{text}</button>);

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

        await waitFor(() => {
            expect(mockUpdateTransaction).toHaveBeenCalledTimes(1);
        });

        expect(mockUpdateTransaction).toHaveBeenCalledWith({
            id: mockProps.vals.id,
            memo: newMemo,
        });
    });
});
