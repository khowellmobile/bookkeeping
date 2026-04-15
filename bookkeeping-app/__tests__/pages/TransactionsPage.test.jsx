/*
 *   Tests for TransactionsPage component.
 *
 */

import { render, screen, fireEvent } from "@testing-library/react";
import TransactionsPage from "@/src/pages/TransactionsPage";
import TransactionsCtx from "@/src/contexts/TransactionsCtx";
import AccountsCtx from "@/src/contexts/AccountsCtx";

jest.mock("@/src/contexts/TransactionsCtx", () => {
    const React = require("react");
    return {
        __esModule: true,
        default: React.createContext({}),
    };
});
jest.mock("@/src/contexts/AccountsCtx", () => {
    const React = require("react");
    return {
        __esModule: true,
        default: React.createContext({}),
    };
});

const mockUseTransactions = jest.fn();
const mockSetCtxFilterBy = jest.fn();
const mockSetCtxActiveAccount = jest.fn();
const mockAddEmptyTransaction = jest.fn();
const mockHandleChange = jest.fn();
const mockAddTransactions = jest.fn();
const mockSetSearchTerm = jest.fn();

// Mocking enviroment variables
jest.mock("@/src/constants", () => ({
    ENVIRONMENT: "test",
    BASE_URL: "http://test-url.com",
}));

jest.mock("@/src/hooks/useTransactions", () => ({
    useTransactions: () => mockUseTransactions(),
}));
jest.mock("@/src/components/elements/dropdowns/AccountDropdown", () => ({ initalVal, onChange }) => (
    <div data-testid="account-dropdown">
        <p>{initalVal?.name || "No Account Selected"}</p>
        <button onClick={() => onChange({ id: 3, name: "Savings Account" })}>Select Account</button>
    </div>
));
jest.mock("@/src/components/elements/items/TransactionItem", () => ({ vals }) => (
    <div data-testid={`transaction-item-${vals.id}`}>
        <p>{vals.memo}</p>
    </div>
));
jest.mock("@/src/components/elements/items/InputEntryItems", () => ({
    TransactionEntryItem: ({ vals, index, onItemChange }) => (
        <div data-testid={`transaction-entry-item-${index}`} onClick={() => onItemChange(index, vals)}>
            <p>{vals.memo || "New Transaction"}</p>
        </div>
    ),
}));
jest.mock("@/src/components/elements/utilities/NoResultsDisplay", () => ({ mainText, guideText }) => (
    <div data-testid="no-results-display">
        <p>{mainText}</p>
        <span>{guideText}</span>
    </div>
));
jest.mock("@/src/components/elements/utilities/Button", () => ({ text, onClick }) => (
    <button onClick={onClick}>{text}</button>
));

const getMockTransactionsReturn = (overrides = {}) => ({
    transToAdd: [],
    filteredTransactions: [],
    searchTerm: "",
    setSearchTerm: mockSetSearchTerm,
    addEmptyTransaction: mockAddEmptyTransaction,
    handleChange: mockHandleChange,
    addTransactions: mockAddTransactions,
    ...overrides,
});

const renderTransactionsPage = (activeAccount = null) => {
    return render(
        <TransactionsCtx.Provider value={{ setCtxFilterBy: mockSetCtxFilterBy }}>
            <AccountsCtx.Provider
                value={{ ctxActiveAccount: activeAccount, setCtxActiveAccount: mockSetCtxActiveAccount }}
            >
                <TransactionsPage />
            </AccountsCtx.Provider>
        </TransactionsCtx.Provider>,
    );
};

describe("TransactionsPage initial render", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseTransactions.mockReturnValue(getMockTransactionsReturn());
        renderTransactionsPage();
    });

    it("should set the account filter and show the empty state on mount", () => {
        expect(mockSetCtxFilterBy).toHaveBeenCalledWith("account");
        expect(screen.getByTestId("no-results-display")).toBeInTheDocument();
        expect(screen.queryByText("Add Transcation")).not.toBeInTheDocument();
    });
});

describe("TransactionsPage basic interactions", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseTransactions.mockReturnValue(
            getMockTransactionsReturn({
                transToAdd: [{ memo: "Draft transaction" }],
                filteredTransactions: [{ id: 11, memo: "Saved transaction" }],
            }),
        );
        renderTransactionsPage({ id: 1, name: "Checking Account" });
    });

    it("should render transaction tools and call the button handlers", () => {
        expect(screen.getByText(/Empty transactions will not be saved/i)).toBeInTheDocument();
        expect(screen.getByTestId("transaction-entry-item-0")).toBeInTheDocument();
        expect(screen.getByTestId("transaction-item-11")).toBeInTheDocument();

        fireEvent.click(screen.getByText("Add Transcation"));
        fireEvent.click(screen.getByText("Save Transactions"));

        expect(mockAddEmptyTransaction).toHaveBeenCalled();
        expect(mockAddTransactions).toHaveBeenCalled();
    });

    it("should update the search term from user input", () => {
        fireEvent.change(screen.getByPlaceholderText("Search..."), { target: { value: "saved" } });

        expect(mockSetSearchTerm).toHaveBeenCalledWith("saved");
    });

    it("should update the active account from the dropdown", () => {
        fireEvent.click(screen.getByText("Select Account"));

        expect(mockSetCtxActiveAccount).toHaveBeenCalledWith({ id: 3, name: "Savings Account" });
    });
});
