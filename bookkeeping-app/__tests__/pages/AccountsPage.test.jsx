/*
 *   Tests for AccountsPage component.
 *
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useMemo } from "react";
import AccountsPage from "@/src/pages/AccountsPage";
import AccountsCtx from "@/src/contexts/AccountsCtx";

// Mocking enviroment variables
jest.mock("@/src/constants", () => ({
    ENVIRONMENT: "test",
    BASE_URL: "http://test-url.com",
}));

const mockCtxAccountList = [
    {
        id: 1,
        name: "Checking Account",
        type: "Asset",
        description: "Main operating account",
        balance: "500.00",
    },
    {
        id: 2,
        name: "Repair Expense",
        type: "Expense",
        description: "Property repair costs",
        balance: "120.00",
    },
];

const MockAccountsCtxProvider = ({ children, accounts = mockCtxAccountList }) => {
    const mockedValue = useMemo(
        () => ({
            ctxAccountList: accounts,
        }),
        [accounts],
    );

    return <AccountsCtx.Provider value={mockedValue}>{children}</AccountsCtx.Provider>;
};

jest.mock("@/src/components/elements/modals/AddAccountModal", () => ({ handleCloseModal }) => (
    <div data-testid="add-account-modal" onClick={handleCloseModal}>
        Add Account Modal
    </div>
));
jest.mock("@/src/components/elements/items/AccountItem", () => ({ account }) => (
    <div data-testid={`account-item-${account.id}`}>
        <p>{account.name}</p>
        <p>{account.type}</p>
        <p>{account.description}</p>
        <p>{account.balance}</p>
    </div>
));
jest.mock("@/src/components/elements/utilities/NoResultsDisplay", () => ({ mainText, guideText }) => (
    <div data-testid="no-results-display">
        <p>{mainText}</p>
        <span>{guideText}</span>
    </div>
));
jest.mock("@/src/components/elements/utilities/Button", () => ({ text, onClick }) => (
    <button onClick={onClick}>{text}</button>
));

const renderAccountsPage = (accounts = mockCtxAccountList) => {
    return render(
        <MockAccountsCtxProvider accounts={accounts}>
            <AccountsPage />
        </MockAccountsCtxProvider>,
    );
};

describe("AccountsPage initial render", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderAccountsPage();
    });

    it("should render the account list and headings on mount", () => {
        expect(screen.getByText("Accounts")).toBeInTheDocument();
        expect(screen.getByText("Checking Account")).toBeInTheDocument();
        expect(screen.getByText("Repair Expense")).toBeInTheDocument();
        expect(screen.getByText("Add Account")).toBeInTheDocument();
    });
});

describe("AccountsPage basic interactions", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderAccountsPage();
    });

    it("should filter accounts based on user search input", async () => {
        fireEvent.change(screen.getByPlaceholderText("Search..."), { target: { value: "repair" } });

        await waitFor(() => {
            expect(screen.getByText("Repair Expense")).toBeInTheDocument();
            expect(screen.queryByText("Checking Account")).not.toBeInTheDocument();
        });
    });

    it("should open and close the Add Account modal", () => {
        expect(screen.queryByTestId("add-account-modal")).not.toBeInTheDocument();

        fireEvent.click(screen.getByText("Add Account"));
        expect(screen.getByTestId("add-account-modal")).toBeInTheDocument();

        fireEvent.click(screen.getByTestId("add-account-modal"));
        expect(screen.queryByTestId("add-account-modal")).not.toBeInTheDocument();
    });
});

describe("AccountsPage empty state", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderAccountsPage([]);
    });

    it("should show the no results display when there are no accounts", () => {
        expect(screen.getByTestId("no-results-display")).toBeInTheDocument();
        expect(screen.getByText("No Accounts to load.")).toBeInTheDocument();
    });
});
