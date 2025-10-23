/*
 *   Tests for AccountModal component.
 *
 */

import { render, screen, fireEvent } from "@testing-library/react";
import AccountModal from "@/src/components/elements/modals/AccountModal";
import AccountsCtx from "@/src/components/contexts/AccountsCtx";

// Mocking enviroment variables
jest.mock("@/src/constants", () => ({
    ENVIRONMENT: "test",
    BASE_URL: "http://test-url.com",
}));

// Mocking context provider
const mockUpdateAccount = jest.fn();
const MockAccountsCtxProvider = ({ children }) => (
    <AccountsCtx.Provider value={{ ctxUpdateAccount: mockUpdateAccount }}>{children}</AccountsCtx.Provider>
);

// Mocking child components used within AccountModal
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
    account: {
        id: 1,
        name: "test_account",
        type: "bank",
        initial_balance: "0.00",
        description: "test description",
    },
    handleCloseModal: jest.fn(),
};

// Functon to create a account modal with context and props
const renderAccountModal = (props = mockProps) => {
    return render(
        <MockAccountsCtxProvider>
            <AccountModal {...props} />
        </MockAccountsCtxProvider>
    );
};

// Test suite to test input changes
describe("AccountModal Input Changes", () => {
    beforeEach(() => {
        mockUpdateAccount.mockClear();
        renderAccountModal();
    });

    it("should update name on user input of good value", () => {
        const newName = "new_account_name";

        const nameInput = screen.getByTestId("input-name");
        fireEvent.change(nameInput, { target: { value: newName, name: "name" } });

        expect(nameInput.value).toBe(newName);
    });

    it("should update initial_balance on user input of good value", () => {
        const newInitalBalance = "500.00";

        const balanceInput = screen.getByTestId("input-initial_balance");
        fireEvent.change(balanceInput, { target: { value: newInitalBalance, name: "initial_balance" } });

        expect(balanceInput.value).toBe(newInitalBalance);
    });

    it("should update name on user input of good value", () => {
        const newDescription = "newDescription";

        const descriptionInput = screen.getByTestId("input-description");
        fireEvent.change(descriptionInput, { target: { value: newDescription, name: "description" } });

        expect(descriptionInput.value).toBe(newDescription);
    });
});

describe("AccountModal editedAccount changes", () => {
    const renderModal = (props) => {
        mockUpdateAccount.mockClear();
        renderAccountModal(props);
    };

    it("should update account name on user input of good value and pass it to ctxUpdateAccount on save", async () => {
        const props = {
            account: { id: 1, name: "old_name", type: "bank", initial_balance: "0.0", description: "test description" },
            handleCloseModal: jest.fn(),
        };
        renderModal(props);

        const newName = "new_name";
        const nameInput = screen.getByTestId("input-name");
        fireEvent.change(nameInput, { target: { value: newName, name: "name" } });

        const saveButton = screen.getByRole("button", { name: "Save & Close" });
        fireEvent.click(saveButton);

        expect(mockUpdateAccount).toHaveBeenCalledTimes(1);
        expect(mockUpdateAccount).toHaveBeenCalledWith({
            id: mockProps.account.id,
            name: newName,
        });
    });

    it("should update account initial balance on user input of good value and pass it to ctxUpdateAccount on save", async () => {
        const props = {
            account: {
                id: 1,
                name: "test_account",
                type: "bank",
                initial_balance: "100.0",
                description: "test description",
            },
            handleCloseModal: jest.fn(),
        };
        renderModal(props);

        const newInitalBalance = "0.00";

        const nameInput = screen.getByTestId("input-initial_balance");
        fireEvent.change(nameInput, { target: { value: newInitalBalance, name: "initial_balance" } });

        const saveButton = screen.getByRole("button", { name: "Save & Close" });
        fireEvent.click(saveButton);

        expect(mockUpdateAccount).toHaveBeenCalledTimes(1);
        expect(mockUpdateAccount).toHaveBeenCalledWith({
            id: mockProps.account.id,
            initial_balance: newInitalBalance,
        });
    });

    it("should update account description on user input of good value and pass it to ctxUpdateAccount on save", async () => {
        const props = {
            account: {
                id: 1,
                name: "test_account",
                type: "bank",
                initial_balance: "0.0",
                description: "old description",
            },
            handleCloseModal: jest.fn(),
        };
        renderModal(props);

        const newDescription = "new description";

        const nameInput = screen.getByTestId("input-description");
        fireEvent.change(nameInput, { target: { value: newDescription, name: "description" } });

        const saveButton = screen.getByRole("button", { name: "Save & Close" });
        fireEvent.click(saveButton);

        expect(mockUpdateAccount).toHaveBeenCalledTimes(1);
        expect(mockUpdateAccount).toHaveBeenCalledWith({
            id: mockProps.account.id,
            description: newDescription,
        });
    });
});

describe("AccountModal Validation (validateInputs)", () => {
    const renderModal = (props) => {
        mockUpdateAccount.mockClear();
        renderAccountModal(props);
    };

    it("should prevent save and display error when name is empty", () => {
        const invalidProps = {
            account: { id: 1, name: "", type: "bank", initial_balance: "0.0", description: "test description" },
            handleCloseModal: jest.fn(),
        };
        renderModal(invalidProps);

        const saveButton = screen.getByRole("button", { name: "Save & Close" });
        fireEvent.click(saveButton);

        expect(mockUpdateAccount).not.toHaveBeenCalled();
        expect(screen.getByText("Error: Invalid fields. Edits were not saved.")).toBeInTheDocument();
    });

    it("should prevent save and display error when type invalid is empty", () => {
        const invalidProps = {
            account: {
                id: 1,
                name: "GoodName",
                type: "InvalidType",
                initial_balance: "0.0",
                description: "test description",
            },
            handleCloseModal: jest.fn(),
        };
        renderModal(invalidProps);

        const saveButton = screen.getByRole("button", { name: "Save & Close" });
        fireEvent.click(saveButton);

        expect(mockUpdateAccount).not.toHaveBeenCalled();
        expect(screen.getByText("Error: Invalid fields. Edits were not saved.")).toBeInTheDocument();
    });

    it("should prevent save and display error when initial balance is empty", () => {
        const invalidProps = {
            account: { id: 1, name: "GoodName", type: "bank", initial_balance: "", description: "test description" },
            handleCloseModal: jest.fn(),
        };
        renderModal(invalidProps);

        const saveButton = screen.getByRole("button", { name: "Save & Close" });
        fireEvent.click(saveButton);

        expect(mockUpdateAccount).not.toHaveBeenCalled();
        expect(screen.getByText("Error: Invalid fields. Edits were not saved.")).toBeInTheDocument();
    });

    it("should prevent save and display error when initial balance is Nan", () => {
        const invalidProps = {
            account: { id: 1, name: "GoodName", type: "bank", initial_balance: "abc", description: "test description" },
            handleCloseModal: jest.fn(),
        };
        renderModal(invalidProps);

        const saveButton = screen.getByRole("button", { name: "Save & Close" });
        fireEvent.click(saveButton);

        expect(mockUpdateAccount).not.toHaveBeenCalled();
        expect(screen.getByText("Error: Invalid fields. Edits were not saved.")).toBeInTheDocument();
    });
});
