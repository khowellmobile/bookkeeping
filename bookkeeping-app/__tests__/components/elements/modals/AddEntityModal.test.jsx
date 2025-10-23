/*
 *   Tests for AddEntityModal component.
 *
 */

import { render, screen, fireEvent, act } from "@testing-library/react";
import AddEntityModal from "@/src/components/elements/modals/AddEntityModal";
import EntitiesCtx from "@/src/components/contexts/EntitiesCtx";

// Mocking enviroment variables
jest.mock("@/src/constants", () => ({
    ENVIRONMENT: "test",
    BASE_URL: "http://test-url.com",
}));

// Mocking functions
const mockHandleCloseModal = jest.fn();
const mockAddEntity = jest.fn();

// Mocking context provider
const MockEntitiesCtxProvider = ({ children }) => (
    <EntitiesCtx.Provider value={{ ctxAddEntity: mockAddEntity }}>{children}</EntitiesCtx.Provider>
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

// Functon to create a AddEntityModal with context
const renderAddEntityModal = async () => {
    let result;
    await act(async () => {
        result = render(
            <MockEntitiesCtxProvider>
                <AddEntityModal handleCloseModal={mockHandleCloseModal} />
            </MockEntitiesCtxProvider>
        );
    });
    return result;
};

const fillInput = async (name, value) => {
    const input = screen.getByTestId(`input-${name}`);
    await act(async () => {
        fireEvent.change(input, { target: { value, name } });
    });
};

const fillValidInputs = async () => {
    await fillInput("name", "Valid Entity Name");
    await fillInput("company", "Valid Company");
    await fillInput("address", "123 Example St");
    await fillInput("phone_number", "123-456-7890");
    await fillInput("email", "test@example.com");
};

const clickSave = async () => {
    const saveButton = screen.getByRole("button", { name: "Save & Close" });
    await act(async () => {
        fireEvent.click(saveButton);
    });
};

// Test suite to test input changes
describe("AddEntityModal Input Changes", () => {
    beforeEach(async () => {
        mockHandleCloseModal.mockClear();
        mockAddEntity.mockClear();
        await renderAddEntityModal();
    });

    it("should update name on user input of good value", async () => {
        const newName = "new_entity_name";
        await fillInput("name", newName);
        expect(screen.getByTestId("input-name").value).toBe(newName);
    });

    it("should update company on user input of good value", async () => {
        const newCompany = "New Company LLC";
        await fillInput("company", newCompany);
        expect(screen.getByTestId("input-company").value).toBe(newCompany);
    });

    it("should update address on user input of good value", async () => {
        const newAddress = "New Address";
        await fillInput("address", newAddress);
        expect(screen.getByTestId("input-address").value).toBe(newAddress);
    });

    it("should update phone_number on user input of good value", async () => {
        const newPhone = "555-123-4567";
        await fillInput("phone_number", newPhone);
        expect(screen.getByTestId("input-phone_number").value).toBe(newPhone);
    });

    it("should update email on user input of good value", async () => {
        const newEmail = "test@work.org";
        await fillInput("email", newEmail);
        expect(screen.getByTestId("input-email").value).toBe(newEmail);
    });
});

describe("AddEntityModal Validation (validateInputs)", () => {
    beforeEach(async () => {
        mockHandleCloseModal.mockClear();
        mockAddEntity.mockClear();
        await renderAddEntityModal();
    });

    it("should prevent save and display error when name is empty", async () => {
        await fillValidInputs();
        await fillInput("name", "");
        await clickSave();

        expect(mockAddEntity).not.toHaveBeenCalled();
        expect(screen.getByText("Entity Name cannot be empty.")).toBeInTheDocument();
    });

    it("should prevent save and display error when phone_number is invalid (too short)", async () => {
        await fillValidInputs();
        await fillInput("phone_number", "1234");
        await clickSave();

        expect(mockAddEntity).not.toHaveBeenCalled();
        expect(screen.getByText("Phone Number must be 10 digits.")).toBeInTheDocument();
    });

    it("should prevent save and display error when phone_number is invalid (too long)", async () => {
        await fillValidInputs();
        await fillInput("phone_number", "123-456-7890123");
        await clickSave();

        expect(mockAddEntity).not.toHaveBeenCalled();
        expect(screen.getByText("Phone Number must be 10 digits.")).toBeInTheDocument();
    });

    it("should prevent save and display error when phone_number is invalid (unallowed characters)", async () => {
        await fillValidInputs();
        await fillInput("phone_number", "abd-d12-1234");
        await clickSave();

        expect(mockAddEntity).not.toHaveBeenCalled();
        expect(screen.getByText("Phone Number must be 10 digits.")).toBeInTheDocument();
    });

    it("should prevent save and display error when email is invalid (bad format)", async () => {
        await fillValidInputs();
        await fillInput("email", "invalid-email");
        await clickSave();

        expect(mockAddEntity).not.toHaveBeenCalled();
        expect(screen.getByText("Email must follow standard format.")).toBeInTheDocument();
    });

    it("should prevent save and display error when email is invalid (unallowed characters)", async () => {
        await fillValidInputs();
        await fillInput("email", "<>email>%*}@domain.com");
        await clickSave();

        expect(mockAddEntity).not.toHaveBeenCalled();
        expect(screen.getByText("Email must follow standard format.")).toBeInTheDocument();
    });

    // Checks valid save
    it("should allow save when all required fields are valid (and optional fields are present)", async () => {
        await fillValidInputs();
        await clickSave();

        expect(mockAddEntity).toHaveBeenCalledTimes(1);
        expect(mockHandleCloseModal).toHaveBeenCalledTimes(1);
    });

    it("should allow save when only the required name field is valid", async () => {
        await fillInput("name", "Required Name Only");
        await clickSave();

        expect(mockAddEntity).toHaveBeenCalledTimes(1);
        expect(mockHandleCloseModal).toHaveBeenCalledTimes(1);
    });
});
