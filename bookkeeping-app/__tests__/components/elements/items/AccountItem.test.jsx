/*
 *   Tests for AccountItem component.
 *
 */

import { render, screen, fireEvent } from "@testing-library/react";

import AccountItem from "@/src/components/elements/items/AccountItem";
import AccountsCtx from "@/src/components/contexts/AccountsCtx";

// Mocking enviroment variables
jest.mock("@/src/constants", () => ({
    ENVIRONMENT: "test",
    BASE_URL: "http://test-url.com",
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
}));

const mockSetActiveCcount = jest.fn();
const mockDeleteAccount = jest.fn();

// Mocking context provider
const MockAccountsCtxProvider = ({ children }) => (
    <AccountsCtx.Provider value={{ setCtxActiveAccount: mockSetActiveCcount, ctxDeleteAccount: mockDeleteAccount }}>
        {children}
    </AccountsCtx.Provider>
);

jest.mock("@/src/components/elements/modals/AccountModal", () => ({ account, handleCloseModal }) => (
    <div data-testid="account-modal" onClick={handleCloseModal}>
        Edit Modal for {account.name}
    </div>
));
jest.mock("@/src/components/elements/modals/ConfirmationModal", () => ({ text, onConfirm, onCancel }) => (
    <div data-testid="confirmation-modal">
        <button onClick={onConfirm}>Confirm Delete</button>
        <button onClick={onCancel}>Cancel Delete</button>
    </div>
));

const mockAccount = {
    id: 1,
    name: "Checking",
    type: "asset",
    description: "Daily spending account",
    balance: "1000.50",
};

const renderAccountItem = (account = mockAccount) => {
    return render(
        <MockAccountsCtxProvider>
            <AccountItem account={account} />
        </MockAccountsCtxProvider>
    );
};

describe("AccountItem Rendering and Navigation", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderAccountItem();
    });

    it("should display the account information correctly", () => {
        expect(screen.getByText("Checking")).toBeInTheDocument();
        expect(screen.getByText("Asset")).toBeInTheDocument();
        expect(screen.getByText("Daily spending account")).toBeInTheDocument();
        expect(screen.getByText("1000.50")).toBeInTheDocument();
    });

    it("should navigate to transactions and set active account on dropdown click", () => {
        fireEvent.click(screen.getByAltText("Icon"));
        fireEvent.click(screen.getByText("Go to Transactions"));

        expect(mockSetActiveCcount).toHaveBeenCalledWith(mockAccount);
        expect(mockNavigate).toHaveBeenCalledWith("/app/transactions");
    });
});

describe("Dropdown Toggling and Outside Click Handling", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderAccountItem();
    });

    it("should open the dropdown menu when the icon is clicked", () => {
        const icon = screen.getByAltText("Icon");
        fireEvent.click(icon);

        // Checking to see if dropdown items are present
        expect(screen.getByText("Edit")).toBeInTheDocument();
        expect(screen.getByText("Mark Inactive")).toBeInTheDocument();
    });

    it("should close the dropdown menu when the icon is clicked again", () => {
        const icon = screen.getByAltText("Icon");
        fireEvent.click(icon);
        expect(screen.getByText("Edit")).toBeInTheDocument();
        fireEvent.click(icon);

        // Use queryByText to return null if not found
        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    });

    it("should close the dropdown when a click occurs outside of it", () => {
        const icon = screen.getByAltText("Icon");
        fireEvent.click(icon);
        expect(screen.getByText("Edit")).toBeInTheDocument();
        fireEvent.mouseDown(document.body);

        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    });
});

describe("AccountModal (Edit Modal) Functionality", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderAccountItem();

        fireEvent.click(screen.getByAltText("Icon"));
        expect(screen.getByText("Edit")).toBeInTheDocument();
    });

    it("should open the AccountModal when 'Edit' is clicked", () => {
        fireEvent.click(screen.getByText("Edit"));

        // Assert that the mocked modal is visible
        expect(screen.getByTestId("account-modal")).toBeInTheDocument();
        expect(screen.getByText("Edit Modal for Checking")).toBeInTheDocument();
    });

    it("should close the AccountModal when handleCloseModal is triggered", () => {
        // Open the modal
        fireEvent.click(screen.getByText("Edit"));
        const modal = screen.getByTestId("account-modal");

        expect(modal).toBeInTheDocument();
        fireEvent.click(modal);

        expect(screen.queryByTestId("account-modal")).not.toBeInTheDocument();
    });
});

describe("ConfirmationModal (Delete/Inactive) Functionality", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderAccountItem();

        fireEvent.click(screen.getByAltText("Icon"));
        expect(screen.getByText("Mark Inactive")).toBeInTheDocument();
    });

    it("should open the ConfirmationModal when 'Mark Inactive' is clicked", () => {
        fireEvent.click(screen.getByText("Mark Inactive"));
        expect(screen.getByTestId("confirmation-modal")).toBeInTheDocument();
    });

    it("should delete the account and close the modal when 'Confirm Delete' is clicked", () => {
        fireEvent.click(screen.getByText("Mark Inactive"));
        fireEvent.click(screen.getByText("Confirm Delete"));

        expect(mockDeleteAccount).toHaveBeenCalledWith(mockAccount.id);
        expect(screen.queryByTestId("confirmation-modal")).not.toBeInTheDocument();
    });

    it("should close the modal without deleting the account when 'Cancel Delete' is clicked", () => {
        fireEvent.click(screen.getByText("Mark Inactive"));
        fireEvent.click(screen.getByText("Cancel Delete"));

        expect(mockDeleteAccount).not.toHaveBeenCalled();
        expect(screen.queryByTestId("confirmation-modal")).not.toBeInTheDocument();
    });
});
