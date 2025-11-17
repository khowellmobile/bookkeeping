/*
 * Tests for AccountEntryDropdown component.
 *
 */

import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import AccountEntryDropdown from "@/src/components/elements/dropdowns/AccountEntryDropdown";
import AccountsCtx from "@/src/components/contexts/AccountsCtx";

// Mocking enviroment variables
jest.mock("@/src/constants", () => ({
    ENVIRONMENT: "test",
    BASE_URL: "http://test-url.com",
}));

// Mocking utilities and modals
jest.mock("@/src/components/elements/utilities/Button.jsx", () => ({ text, onClick }) => (
    <button onClick={onClick}>{text}</button>
));
jest.mock("@/src/components/elements/modals/AddAccountModal", () => ({ handleCloseModal }) => (
    <div data-testid="add-account-modal" onClick={handleCloseModal}>
        Add Account Modal
    </div>
));

// The scrollRef is mocked simply as it's not being tested
const mockScrollRef = {
    current: null,
};
// Use real timers for the handleBlur setTimeout
jest.useFakeTimers();

const mockAccountList = [
    { id: 1, name: "Checking" },
    { id: 2, name: "Savings" },
    { id: 3, name: "Credit Card" },
    { id: 4, name: "Money Market" },
];

// Mocking context provider
const MockAccountsCtxProvider = ({ children, accountList = mockAccountList }) => (
    <AccountsCtx.Provider value={{ ctxAccountList: accountList }}>{children}</AccountsCtx.Provider>
);

const mockAccount = {
    account: {
        id: 1,
        name: "Checking",
    },
};
const mockOnChange = jest.fn();

const renderAccountDropdown = (vals = mockAccount, props = {}) => {
    return render(
        <MockAccountsCtxProvider>
            <AccountEntryDropdown vals={vals} scrollRef={mockScrollRef} onChange={mockOnChange} {...props} />
        </MockAccountsCtxProvider>
    );
};

describe("AccountEntryDropdown Rendering and initial state", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should display the initial account name in the input field", () => {
        renderAccountDropdown();
        expect(screen.getByRole("textbox")).toHaveValue("Checking");
    });

    it("should not display the dropdown content initially", () => {
        renderAccountDropdown();
        expect(screen.queryByText("All Accounts")).not.toBeInTheDocument();
        expect(screen.queryByText("Savings")).not.toBeInTheDocument();
    });

    it("should display an empty input field when no account is initially selected", () => {
        renderAccountDropdown({ account: null });
        expect(screen.getByRole("textbox")).toHaveValue("");
    });
});

describe("AccountEntryDropdown Opening and Filtering", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderAccountDropdown();
    });

    it("should expand and remove noDisplay when input is focused", () => {
        const input = screen.getByRole("textbox");
        fireEvent.focus(input);

        // Clear search term to show all accounts
        fireEvent.change(input, { target: { value: "" } });

        expect(screen.getByText("All Accounts")).toBeInTheDocument();
        expect(screen.getByText("Add Account")).toBeInTheDocument();
        expect(screen.getByText("Savings")).toBeInTheDocument();
        expect(screen.getByText("Credit Card")).toBeInTheDocument();
        expect(screen.getByRole("dropdown-anchor")).not.toHaveClass("noDisplay");
    });

    it("should filter accounts based on user input", () => {
        const input = screen.getByRole("textbox");

        // Type 'cred'
        fireEvent.change(input, { target: { value: "cred" } });

        // Dropdown should be expanded and show only "Credit Card"
        expect(screen.getByText("All Accounts")).toBeInTheDocument();
        expect(screen.getByText("Credit Card")).toBeInTheDocument();
        expect(screen.queryByText("Checking")).not.toBeInTheDocument();
        expect(screen.queryByText("Savings")).not.toBeInTheDocument();
    });

    it("should display 'No matching accounts found.' when filter yields no results", () => {
        const input = screen.getByRole("textbox");

        // Type 'xyz'
        fireEvent.change(input, { target: { value: "xyz" } });

        expect(screen.getByText("No matching accounts found.")).toBeInTheDocument();
        expect(screen.queryByText("Checking")).not.toBeInTheDocument();
    });
});

describe("AccountEntryDropdown Selection and Closing", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderAccountDropdown();

        const input = screen.getByRole("textbox");
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: "" } });
    });

    // Add this test back in when issue #218 is completed
    /* it("should close and update input when a new account is selected", async () => {
        const savingsAccount = screen.getByText("Savings");
        fireEvent.click(savingsAccount);

        expect(screen.getByRole("textbox")).toHaveValue("Savings");
        await waitFor(() => {
            expect(screen.queryByRole("dropdown-anchor")).not.toBeInTheDocument();
            expect(screen.queryByText("All Accounts")).not.toBeInTheDocument();
            expect(screen.queryByText("Checking")).not.toBeInTheDocument();
        });

        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(mockOnChange).toHaveBeenCalledWith({ id: 2, name: "Savings" });
    }); */

    it("should close the dropdown after blur delay", async () => {
        const input = screen.getByRole("textbox");

        fireEvent.blur(input);

        // Dropdown should still be visible immediately after blur (due to setTimeout)
        expect(screen.getByText("All Accounts")).toBeInTheDocument();

        // Fast-forward time
        await act(async () => {
            jest.advanceTimersByTime(150);
        });

        // Dropdown should be closed after 150ms
        await waitFor(() => {
            expect(screen.queryByText("All Accounts")).not.toBeInTheDocument();
        });
    });
});

describe("AccountEntryDropdown Add Account Modal", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderAccountDropdown();
    });

    it("should open the Add Account Modal when the button is clicked", () => {
        fireEvent.focus(screen.getByRole("textbox"));
        expect(screen.queryByTestId("add-account-modal")).not.toBeInTheDocument();

        const addButton = screen.getByText("Add Account");
        fireEvent.click(addButton);

        expect(screen.getByTestId("add-account-modal")).toBeInTheDocument();
    });

    it("should close the Add Account Modal when handleCloseModal is called", () => {
        fireEvent.focus(screen.getByRole("textbox"));
        fireEvent.click(screen.getByText("Add Account"));

        const modal = screen.getByTestId("add-account-modal");
        fireEvent.click(modal);

        expect(screen.queryByTestId("add-account-modal")).not.toBeInTheDocument();
    });
});
