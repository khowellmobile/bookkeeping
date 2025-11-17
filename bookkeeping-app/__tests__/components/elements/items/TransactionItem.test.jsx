/*
 * Tests for TransactionItem component.
 *
 */

import { render, screen, fireEvent } from "@testing-library/react";
import TransactionItem from "@/src/components/elements/items/TransactionItem";

jest.mock("@/src/components/elements/modals/TransactionModal", () => ({ vals, handleCloseModal }) => (
    <div data-testid="transaction-modal" onClick={handleCloseModal}>
        Transaction Modal for Memo: {vals.memo}
    </div>
));

// Mock transaction data for testing
const mockTransaction = {
    date: "2025-10-24",
    entity: { name: "Grocery Store" },
    account: { name: "Primary Checking" },
    memo: "Groceries &lt;food&gt;",
    type: "debit",
    amount: "55.75",
    is_reconciled: false,
};

const mockCreditTransaction = {
    ...mockTransaction,
    memo: "Paycheck &amp; Bonus",
    type: "credit",
    amount: "1234.567",
};

const renderTransactionItem = (vals = mockTransaction) => {
    return render(<TransactionItem vals={vals} />);
};

describe("TransactionItem Rendering", () => {
    it("should display all transaction information correctly", () => {
        renderTransactionItem();
        expect(screen.getByText("2025-10-24")).toBeInTheDocument();
        expect(screen.getByText("Grocery Store")).toBeInTheDocument();
        expect(screen.getByText("Primary Checking")).toBeInTheDocument();
    });

    it("should correctly unescape HTML entities in the memo", () => {
        renderTransactionItem();
        // The unescaped text from "Groceries &lt;food&gt;" should be "Groceries <food>"
        expect(screen.getByText("Groceries <food>")).toBeInTheDocument();
    });

    it("should format debit amounts with parentheses and two decimal places", () => {
        renderTransactionItem();
        expect(screen.getByText("(55.75)")).toBeInTheDocument();
    });

    it("should format credit amounts without parentheses and with two decimal places (and handle rounding)", () => {
        renderTransactionItem(mockCreditTransaction);
        // The expected formatted credit amount (1234.567 rounded to 1234.57)
        expect(screen.getByText("1234.57")).toBeInTheDocument();
    });

    it("should display 'no' for an unreconciled transaction", () => {
        renderTransactionItem(mockTransaction);
        expect(screen.getByText("no")).toBeInTheDocument();
    });

    it("should display 'yes' for a reconciled transaction", () => {
        const reconciledTransaction = { ...mockTransaction, is_reconciled: true };
        renderTransactionItem(reconciledTransaction);
        expect(screen.getByText("yes")).toBeInTheDocument();
    });
});

describe("TransactionModal Functionality", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderTransactionItem();
    });

    it("should open the TransactionModal when the transaction item is clicked", () => {
        expect(screen.queryByTestId("transaction-modal")).not.toBeInTheDocument();
        fireEvent.click(screen.getByText("Groceries <food>"));

        const modal = screen.getByTestId("transaction-modal");
        expect(modal).toBeInTheDocument();
        expect(screen.getByText(`Transaction Modal for Memo: ${mockTransaction.memo}`)).toBeInTheDocument();
    });

    it("should close the TransactionModal when handleCloseModal is triggered", () => {
        fireEvent.click(screen.getByText("Groceries <food>"));
        const modal = screen.getByTestId("transaction-modal");

        expect(modal).toBeInTheDocument();

        fireEvent.click(modal);
        expect(screen.queryByTestId("transaction-modal")).not.toBeInTheDocument();
    });
});
