/*
 * Tests for AccountDropdown component.
 *
 */

import { render, screen, fireEvent } from "@testing-library/react";
import AccountDropdown from "@/src/components/elements/dropdowns/AccountDropdown";
import AccountsCtx from "@/src/components/contexts/AccountsCtx";

// Mocking enviroment variables
jest.mock("@/src/constants", () => ({
    ENVIRONMENT: "test",
    BASE_URL: "http://test-url.com",
}));

const mockAccountList = [
    { id: 1, name: "Checking" },
    { id: 2, name: "Savings" },
    { id: 3, name: "Credit Card" },
];

// Mocking context provider
const MockAccountsCtxProvider = ({ children }) => (
    <AccountsCtx.Provider value={{ ctxAccountList: mockAccountList }}>{children}</AccountsCtx.Provider>
);

const mockAccount = {
    id: 1,
    name: "Checking",
    type: "asset",
    description: "Daily spending account",
    balance: "1000.50",
};
const mockOnChange = jest.fn();

const renderAccountItem = (account = mockAccount) => {
    return render(
        <MockAccountsCtxProvider>
            <AccountDropdown initalVal={account} onChange={mockOnChange} />
        </MockAccountsCtxProvider>
    );
};

describe("AccountDropdown Rendering and opening", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderAccountItem();
    });

    it("should display the initial account name and not display other accounts", () => {
        expect(screen.getByText("Checking")).toBeInTheDocument();
        expect(screen.queryByText("Savings")).not.toBeInTheDocument();
        expect(screen.queryByText("Credit Card")).not.toBeInTheDocument();
    });

    it("should expand and display all accounts (and activeAccount) when display div is clicked", () => {
        const displayDiv = screen.getByText("Checking");
        fireEvent.click(displayDiv);

        expect(screen.getAllByText("Checking")[0]).toBeInTheDocument();
        expect(screen.getAllByText("Checking")[1]).toBeInTheDocument();
        expect(screen.getByText("Savings")).toBeInTheDocument();
        expect(screen.getByText("Credit Card")).toBeInTheDocument();
    });
});

describe("AccountDropdown Closing", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderAccountItem();
    });

    const expandDropdown = () => {
        const displayDiv = screen.getByText("Checking");
        fireEvent.click(displayDiv);
    };

    it("should close when clicked outside of", () => {
        expandDropdown();

        fireEvent.mouseDown(document);

        expect(screen.getByText("Checking")).toBeInTheDocument();
        expect(screen.queryByText("Savings")).not.toBeInTheDocument();
        expect(screen.queryByText("Credit Card")).not.toBeInTheDocument();
    });

    it("should close when account is selected", () => {
        expandDropdown();

        fireEvent.click(screen.getByText("Savings"));

        expect(screen.getByText("Savings")).toBeInTheDocument();
        expect(screen.queryByText("Checking")).not.toBeInTheDocument();
        expect(screen.queryByText("Credit Card")).not.toBeInTheDocument();
    });
});

describe("AccountDropdown onChange call", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderAccountItem();
    });

    it("should call onChange with correct information when account is clicked", () => {
        const displayDiv = screen.getByText("Checking");
        fireEvent.click(displayDiv);

        fireEvent.click(screen.getByText("Savings"));

        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(mockOnChange).toHaveBeenCalledWith({ id: 2, name: "Savings" });
    });
});
