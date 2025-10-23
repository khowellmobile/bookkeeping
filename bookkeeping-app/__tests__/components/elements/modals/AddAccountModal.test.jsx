/*
 *   Tests for AddAccountModal component.
 *
 */

import { render, screen, fireEvent, act } from "@testing-library/react";
import AddAccountModal from "@/src/components/elements/modals/AddAccountModal";
import AccountsCtx from "@/src/components/contexts/AccountsCtx";

// Mocking enviroment variables
jest.mock("@/src/constants", () => ({
    ENVIRONMENT: "test",
    BASE_URL: "http://test-url.com",
}));

// Mocking functions
const mockHandleCloseModal = jest.fn();
const mockAddAccount = jest.fn();
const mockGetNonPropertyAccounts = jest.fn();
// Ensure the mock resolves with some data
mockGetNonPropertyAccounts.mockResolvedValue([
    { id: 1, name: "Existing Account 1" },
    { id: 2, name: "Existing Account 2" },
]);

// Mocking context provider
const MockAccountsCtxProvider = ({ children }) => (
    <AccountsCtx.Provider
        value={{ ctxAddAccount: mockAddAccount, ctxGetNonPropertyAccounts: mockGetNonPropertyAccounts }}
    >
        {children}
    </AccountsCtx.Provider>
);

// Mocking child components used within AccountModal
jest.mock("@/src/components/elements/misc/AddInputCluster.jsx", () => ({ name, value, onChange }) => (
    <input data-testid={`input-${name}`} name={name} value={value} onChange={onChange} />
));
jest.mock("@/src/components/elements/modals/BaseAddModal", () => ({ handleSaveClick, title, children }) => (
    <div>
        <h1>{title}</h1>
        <button onClick={handleSaveClick}>Save & Close</button>
        {children}
    </div>
));

// Functon to create a AddAccountModal with context
const renderAddAccountModal = async () => {
    let result;
    await act(async () => {
        result = render(
            <MockAccountsCtxProvider>
                <AddAccountModal handleCloseModal={mockHandleCloseModal} />
            </MockAccountsCtxProvider>
        );
    });
    return result;
};

// Test suite to test input changes
describe("AddAccountModal Input Changes", () => {
    beforeEach(async () => {
        await renderAddAccountModal();
    });

    it("should update name on user input of good value", () => {
        const newName = "new_account_name";

        const nameInput = screen.getByTestId("input-name");
        fireEvent.change(nameInput, { target: { value: newName, name: "name" } });

        expect(nameInput.value).toBe(newName);
    });

    it("should update account_number on user input of good value", () => {
        const accountNum = "12345-78941";

        const accNuminput = screen.getByTestId("input-account_number");
        fireEvent.change(accNuminput, { target: { value: accountNum, name: "account_number" } });

        expect(accNuminput.value).toBe(accountNum);
    });

    it("should update initial_balance on user input of good value", () => {
        const newInitalBalance = "500.00";

        const balanceInput = screen.getByTestId("input-initial_balance");
        fireEvent.change(balanceInput, { target: { value: newInitalBalance, name: "initial_balance" } });

        expect(balanceInput.value).toBe(newInitalBalance);
    });

    it("should update description on user input of good value", () => {
        const newDescription = "newDescription";

        const descriptionInput = screen.getByTestId("input-description");
        fireEvent.change(descriptionInput, { target: { value: newDescription, name: "description" } });

        expect(descriptionInput.value).toBe(newDescription);
    });
});

// Function to simulate user input and wait for state update
const fillInput = async (name, value) => {
    const input = screen.getByTestId(`input-${name}`);
    // Use act() to be safe with the state updates
    await act(async () => {
        fireEvent.change(input, { target: { value, name } });
    });
};

// Simulates seelecting an account type from the dropdown
const selectAccountType = async (type) => {
    const typeDiv = screen.getByText("Select account type").closest("div");
    await act(async () => {
        fireEvent.click(typeDiv);
    });

    const typeOption = screen.getByText(type);
    await act(async () => {
        fireEvent.click(typeOption);
    });
};

const fillValidInputs = async () => {
    await fillInput("name", "Valid Account Name");
    await fillInput("account_number", "12345");
    await fillInput("initial_balance", "100.00");
    await fillInput("description", "A valid account description");
    await selectAccountType("Asset");
};

const clickSave = async () => {
    const saveButton = screen.getByRole("button", { name: "Save & Close" });
    await act(async () => {
        fireEvent.click(saveButton);
    });
};

describe("AddAccountModal Validation (validateInputs)", () => {
    beforeEach(async () => {
        await renderAddAccountModal();
    });

    it("should prevent save and display error when name is empty", async () => {
        // Fill fields
        await fillValidInputs();

        // Clear required 'name' field
        await fillInput("name", "");

        await clickSave();

        expect(mockAddAccount).not.toHaveBeenCalled();
        expect(screen.getByText("Account Name cannot be empty.")).toBeInTheDocument();
    });

    it("should prevent save and display error when type is NOT selected", async () => {
        await fillInput("name", "GoodName");
        await fillInput("initial_balance", "10.00");

        await clickSave();

        expect(mockAddAccount).not.toHaveBeenCalled();
        expect(screen.getByText("Account type set to unsupported type.")).toBeInTheDocument();
    });

    it("should prevent save and display error when initial balance is empty", async () => {
        await fillValidInputs();
        await fillInput("initial_balance", "");
        await clickSave();

        expect(mockAddAccount).not.toHaveBeenCalled();
        expect(screen.getByText("Initial Balance must be a number and cannot be empty.")).toBeInTheDocument();
    });

    it("should prevent save and display error when initial balance is NaN", async () => {
        await fillValidInputs();
        await fillInput("initial_balance", "abc");
        await clickSave();

        expect(mockAddAccount).not.toHaveBeenCalled();
        expect(screen.getByText("Initial Balance must be a number and cannot be empty.")).toBeInTheDocument();
    });

    it("should prevent save and display error when account_number has invalid characters", async () => {
        await fillValidInputs();
        await fillInput("account_number", "123x-456");
        await clickSave();

        expect(mockAddAccount).not.toHaveBeenCalled();
        expect(screen.getByText("Account Number can only include numbers, dashes, and periods.")).toBeInTheDocument();
    });

    // Checks valid save
    it("should allow save when all required fields are valid", async () => {
        await fillValidInputs();
        await clickSave();

        expect(mockAddAccount).toHaveBeenCalledTimes(1);
        expect(mockHandleCloseModal).toHaveBeenCalledTimes(1);
    });
});
