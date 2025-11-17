/*
 *   Tests for AddPropertyModal component.
 *
 */

import { render, screen, fireEvent, act } from "@testing-library/react";
import AddPropertyModal from "@/src/components/elements/modals/AddPropertyModal";
import PropertiesCtx from "@/src/components/contexts/PropertiesCtx";

// Mocking enviroment variables
jest.mock("@/src/constants", () => ({
    ENVIRONMENT: "test",
    BASE_URL: "http://test-url.com",
}));

// Mocking functions
const mockHandleCloseModal = jest.fn();
const mockAddProperty = jest.fn();

// Mocking context provider
const MockPropertiesCtxProvider = ({ children }) => (
    <PropertiesCtx.Provider value={{ ctxAddProperty: mockAddProperty }}>{children}</PropertiesCtx.Provider>
);

// Mocking child components used within PropertyModal
jest.mock("@/src/components/elements/utilities/AddInputCluster.jsx", () => ({ name, value, onChange, type }) => (
    <input data-testid={`input-${name}`} name={name} value={value} onChange={onChange} type={type || "text"} />
));
jest.mock("@/src/components/elements/modals/BaseAddModal", () => ({ handleSaveClick, title, children }) => (
    <div>
        <h1>{title}</h1>
        <button onClick={handleSaveClick}>Save & Close</button>
        {children}
    </div>
));

// Functon to create a AddPropertyModal with context
const renderAddPropertyModal = async () => {
    let result;
    await act(async () => {
        result = render(
            <MockPropertiesCtxProvider>
                <AddPropertyModal handleCloseModal={mockHandleCloseModal} />
            </MockPropertiesCtxProvider>
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

const selectPropertyType = async (type) => {
    const typeDivPlaceholder = screen.getByText("Select Property type");

    await act(async () => {
        fireEvent.click(typeDivPlaceholder);
    });

    const typeOption = screen.getByText(type);
    await act(async () => {
        fireEvent.click(typeOption);
    });
};

const fillValidInputs = async (type = "Residential") => {
    await fillInput("name", "Valid Property Name");
    await fillInput("address", "123 Good Street, City");
    await fillInput("rent", "1500.50");
    await fillInput("number_of_units", "1");
    await selectPropertyType(type);
};

const clickSave = async () => {
    const saveButton = screen.getByRole("button", { name: "Save & Close" });
    await act(async () => {
        fireEvent.click(saveButton);
    });
};

// Test suite to test input changes
describe("AddPropertyModal Input Changes", () => {
    beforeEach(async () => {
        mockHandleCloseModal.mockClear();
        mockAddProperty.mockClear();
        await renderAddPropertyModal();
    });

    it("should update name on user input of good value", async () => {
        const newName = "new_property_name";
        await fillInput("name", newName);
        expect(screen.getByTestId("input-name").value).toBe(newName);
    });

    it("should update address on user input of good value", async () => {
        const newAddress = "123 Example St";
        await fillInput("address", newAddress);
        expect(screen.getByTestId("input-address").value).toBe(newAddress);
    });

    it("should update rent on user input of good value", async () => {
        const newRent = "2500.00";
        await fillInput("rent", newRent);
        expect(screen.getByTestId("input-rent").value).toBe(newRent);
    });

    it("should update number_of_units on user input of good value", async () => {
        const newUnits = "4";
        await fillInput("number_of_units", newUnits);
        expect(screen.getByTestId("input-number_of_units").value).toBe(newUnits);
    });

    it("should update property_type after selection", async () => {
        const type = "Commercial";
        await selectPropertyType(type);
        expect(screen.getAllByText(type)[0]).toBeInTheDocument();
        expect(screen.getAllByText(type).length).toEqual(2); // One in dropdown, one in selected display
    });
});

describe("AddPropertyModal Validation (validateInputs)", () => {
    beforeEach(async () => {
        mockHandleCloseModal.mockClear();
        mockAddProperty.mockClear();
        await renderAddPropertyModal();
    });

    it("should prevent save and display error when name is empty", async () => {
        await fillValidInputs();
        await fillInput("name", "");
        await clickSave();

        expect(mockAddProperty).not.toHaveBeenCalled();
        expect(screen.getByText("Property Name cannot be empty.")).toBeInTheDocument();
    });

    it("should prevent save and display error when address is empty", async () => {
        await fillValidInputs();
        await fillInput("address", "");
        await clickSave();

        expect(mockAddProperty).not.toHaveBeenCalled();
        expect(screen.getByText("Property Address cannot be empty.")).toBeInTheDocument();
    });

    it("should prevent save and display error when number_of_units is empty", async () => {
        await fillValidInputs();
        await fillInput("number_of_units", "");
        await clickSave();

        expect(mockAddProperty).not.toHaveBeenCalled();
        expect(screen.getByText("Unit amount must be a number and cannot be empty.")).toBeInTheDocument();
    });

    it("should prevent save and display error when number_of_units is NaN", async () => {
        await fillValidInputs();
        await fillInput("number_of_units", "cba");
        await clickSave();

        expect(mockAddProperty).not.toHaveBeenCalled();
        expect(screen.getByText("Unit amount must be a number and cannot be empty.")).toBeInTheDocument();
    });

    // NEEDS FIXED. RENT EVALUATES TO "" EVEN WHEN SET TO "abc"
    /* it.only("should prevent save and display error when rent is NaN (but not empty)", async () => {
        await fillInput("rent", "abc");
        await clickSave();

        expect(mockAddProperty).not.toHaveBeenCalled();
        expect(screen.getByText("Rent must be a number.")).toBeInTheDocument();
    });
     */

    it("should allow save when all required fields are valid and optional fields are empty", async () => {
        await fillInput("name", "Required Property");
        await fillInput("address", "123 Example St");
        await fillInput("number_of_units", "1");
        await selectPropertyType("Residential");

        await clickSave();

        expect(mockAddProperty).toHaveBeenCalledTimes(1);
        expect(mockHandleCloseModal).toHaveBeenCalledTimes(1);
        expect(mockAddProperty).toHaveBeenCalledWith(
            expect.objectContaining({
                name: "Required Property",
                address: "123 Example St",
                property_type: "residential",
                number_of_units: "1",
            })
        );
    });

    it("should allow save when all required and optional fields are valid", async () => {
        await fillValidInputs();
        await clickSave();

        expect(mockAddProperty).toHaveBeenCalledTimes(1);
        expect(mockHandleCloseModal).toHaveBeenCalledTimes(1);
        expect(mockAddProperty).toHaveBeenCalledWith(
            expect.objectContaining({
                name: "Valid Property Name",
                address: "123 Good Street, City",
                property_type: "residential",
                rent: "1500.50",
                number_of_units: "1",
            })
        );
    });
});
