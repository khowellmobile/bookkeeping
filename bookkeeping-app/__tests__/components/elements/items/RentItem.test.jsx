/*
 * Tests for TransactionEntryItem component.
 *
 */

import { render, screen, fireEvent } from "@testing-library/react";
import RentItem from "@/src/components/elements/items/RentItem";
import RentPaymentsCtx from "@/src/components/contexts/RentPaymentsCtx";

// Mocking enviroment variables
jest.mock("@/src/constants", () => ({
    ENVIRONMENT: "test",
    BASE_URL: "http://test-url.com",
}));

// Mock useToast hook
const mockShowToast = jest.fn();
jest.mock("@/src/components/contexts/ToastCtx", () => ({
    useToast: () => ({ showToast: mockShowToast }),
}));

// Mocking components
jest.mock("@/src/components/elements/utilities/Input", () => ({ type, name, value, onChange }) => (
    <input data-testid={`${name}-input`} type="text" name={name} value={value} onChange={onChange} />
));
jest.mock("@/src/components/elements/dropdowns/EntityDropdown", () => ({ initalVal, onChange }) => (
    <div data-testid="entity-dropdown">
        <button onClick={() => onChange({ id: 99, name: "New Entity Name" })}>
            {initalVal?.name || "Select Entity"}
        </button>
    </div>
));
jest.mock("@/src/components/elements/modals/ConfirmationModal", () => ({ text, onConfirm, onCancel }) => (
    <div data-testid="confirmation-modal">
        <p>{text.msg}</p>
        <button data-testid="confirm-btn" onClick={onConfirm}>
            {text.confirm_txt}
        </button>
        <button data-testid="cancel-btn" onClick={onCancel}>
            {text.cancel_txt}
        </button>
    </div>
));

const mockUpdatePayment = jest.fn();
const mockUpdateFields = jest.fn();
const mockRemoveTemp = jest.fn();
const mockSavePayment = jest.fn();
const MockRentPaymentsCtxProvider = ({ children }) => (
    <RentPaymentsCtx.Provider value={{ ctxUpdatePayment: mockUpdatePayment }}>{children}</RentPaymentsCtx.Provider>
);

const mockItem = {
    id: 1,
    status: "due",
    amount: "100.00",
    entity: { id: 10, name: "Test Entity" },
    date: "2025-10-27",
};

const mockTempItem = {
    id: "temp-123",
    status: "scheduled",
    amount: "50.00",
    entity: null,
    date: "2025-10-27",
};

const renderRentItem = (item = mockItem) => {
    return render(
        <MockRentPaymentsCtxProvider>
            <RentItem
                item={item}
                dayIndex={0}
                removeTemp={mockRemoveTemp}
                handleSaveRentPayment={mockSavePayment}
                pushLeft={false}
                pushUp={false}
            />
        </MockRentPaymentsCtxProvider>
    );
};

describe("RentItem Rendering", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderRentItem();
    });

    it("should display the status, amount, and entity name", () => {
        expect(screen.queryByText("Due")).toBeInTheDocument();
        expect(screen.getByDisplayValue("100.00")).toBeInTheDocument();
        expect(screen.getByText("Test Entity")).toBeInTheDocument();
    });
});

describe("RentItem functionality: Editing and Closing (Existing Item)", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderRentItem();
    });

    it("should call ctxUpdatePayment on close if fields are changed and valid", () => {
        const itemBox = screen.getByText("$100.00, Test Entity").closest("div");
        fireEvent.click(itemBox);

        const amountInput = screen.getByTestId("amount-input");
        fireEvent.change(amountInput, { target: { name: "amount", value: "150.50" } });

        const paidTag = screen.getByText("Paid");
        fireEvent.click(paidTag);

        fireEvent.mouseDown(document.body);
        expect(mockUpdatePayment).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 1,
                amount: "150.50",
                status: "paid",
            })
        );
    });

    it("should reject invalid amount on close, show toast, and NOT update fields", () => {
        const itemBox = screen.getByText("$100.00, Test Entity").closest("div");
        fireEvent.click(itemBox);

        const amountInput = screen.getByTestId("amount-input");
        fireEvent.change(amountInput, { target: { name: "amount", value: "abc" } });

        fireEvent.mouseDown(document.body);
        expect(mockShowToast).toHaveBeenCalledTimes(1);
        expect(mockShowToast).toHaveBeenCalledWith("Invalid fields. Changes Reset.", "error", 5000);

        expect(mockUpdatePayment).not.toHaveBeenCalled();
        expect(screen.getByDisplayValue("100.00")).toBeInTheDocument();
    });
});

describe("RentItem functionality: Deletion (Existing Item)", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderRentItem();
    });

    it("should open and successfully complete the deletion process", () => {
        const itemBox = screen.getByText("$100.00, Test Entity").closest("div");
        fireEvent.click(itemBox);

        const deleteButton = screen.getByText("Delete");
        fireEvent.click(deleteButton);

        expect(screen.getByTestId("confirmation-modal")).toBeInTheDocument();

        const confirmButton = screen.getByTestId("confirm-btn");
        fireEvent.click(confirmButton);

        expect(mockUpdatePayment).toHaveBeenCalledWith({ id: 1, is_deleted: true });
    });
});

describe("RentItem functionality: Temporary Item (temp-ID)", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should start in expanded state and successfully save a new entry", () => {
        renderRentItem(mockTempItem);

        expect(screen.getByDisplayValue("50.00")).toBeInTheDocument();
        expect(screen.getByText("Save")).toBeInTheDocument();

        const entityDropdownButton = screen.getByText("Select Entity");
        fireEvent.click(entityDropdownButton);

        const saveButton = screen.getByText("Save");
        fireEvent.click(saveButton);

        const expectedSavedPayment = {
            amount: "50.00",
            status: "scheduled",
            date: "2025-10-27",
            entity: { id: 99, name: "New Entity Name" },
        };

        expect(mockSavePayment).toHaveBeenCalledWith(0, expectedSavedPayment);
    });

    it("should remove the temporary item when 'Cancel' is clicked", () => {
        renderRentItem(mockTempItem);

        const cancelButton = screen.getByText("Cancel");
        fireEvent.click(cancelButton);

        expect(mockRemoveTemp).toHaveBeenCalled();
        expect(mockSavePayment).not.toHaveBeenCalled();
        expect(mockUpdateFields).not.toHaveBeenCalled();
    });

    it("should fail validation if amount field is missing on save", () => {
        const testTempItem = {
            id: "temp-123",
            status: "due",
            amount: "",
            entity: { id: 10, name: "Test Entity" },
            date: "2025-10-27",
        };
        renderRentItem(testTempItem);

        const saveButton = screen.getByText("Save");
        fireEvent.click(saveButton);

        expect(mockSavePayment).not.toHaveBeenCalled();
    });

    it("should fail validation if entity field is empty obj on save", () => {
        const testTempItem = {
            id: "temp-123",
            status: "due",
            amount: "100.00",
            entity: {},
            date: "2025-10-27",
        };
        renderRentItem(testTempItem);

        const saveButton = screen.getByText("Save");
        fireEvent.click(saveButton);

        expect(mockSavePayment).not.toHaveBeenCalled();
    });

    it("should fail validation if entity field is null on save", () => {
        const testTempItem = {
            id: "temp-123",
            status: "due",
            amount: "100.00",
            entity: null,
            date: "2025-10-27",
        };
        renderRentItem(testTempItem);

        const saveButton = screen.getByText("Save");
        fireEvent.click(saveButton);

        expect(mockSavePayment).not.toHaveBeenCalled();
    });

    it("should fail validation if status field is missing on save", () => {
        const testTempItem = {
            id: "temp-123",
            status: "",
            amount: "100.00",
            entity: { id: 10, name: "Test Entity" },
            date: "2025-10-27",
        };
        renderRentItem(testTempItem);

        const saveButton = screen.getByText("Save");
        fireEvent.click(saveButton);

        expect(mockSavePayment).not.toHaveBeenCalled();
    });
});
