/*
 *   Tests for Entitiespage component.
 *
 */

import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import { useState, useMemo } from "react";
import EntitiesPage from "@/src/pages/EntitiesPage";
import EntitiesCtx from "@/src/components/contexts/EntitiesCtx";
import TransactionsCtx from "@/src/components/contexts/TransactionsCtx";

// Mocking enviroment variables
jest.mock("@/src/constants", () => ({
    ENVIRONMENT: "test",
    BASE_URL: "http://test-url.com",
}));

// Mocking context providers
const mockCtxEntityList = [
    {
        id: 1,
        name: "Entity 1",
        company: "Company 1",
        address: "Address 1",
        phone_number: "123-123-1234",
        email: "entity1@email.com",
    },
    {
        id: 2,
        name: "Entity 2",
        company: "Company 2",
        address: "Address 2",
        phone_number: "456-456-4567",
        email: "entity2@email.com",
    },
];
const mockCtxUpdateEntity = jest.fn();
let mockCtxActiveEntity;
let mockSetCtxActiveEntity;
const MockEntitiesCtxProvider = ({ children, initialActiveEntity = null }) => {
    const [ctxActiveEntity, setCtxActiveEntity] = useState(initialActiveEntity);

    mockSetCtxActiveEntity = setCtxActiveEntity;
    mockCtxActiveEntity = ctxActiveEntity;

    const mockedValue = useMemo(
        () => ({
            ctxEntityList: mockCtxEntityList,
            ctxUpdateEntity: mockCtxUpdateEntity,
            ctxActiveEntity: ctxActiveEntity,
            setCtxActiveEntity: setCtxActiveEntity,
        }),
        [ctxActiveEntity]
    );

    return <EntitiesCtx.Provider value={mockedValue}>{children}</EntitiesCtx.Provider>;
};

const mockCtxTranList = [];
const mockSetCtxTranList = jest.fn();
const mockSetCtxFilterBy = jest.fn();
const MockTransactionsCtxProvider = ({ children }) => (
    <TransactionsCtx.Provider
        value={{ ctxTranList: mockCtxTranList, setCtxTranList: mockSetCtxTranList, setCtxFilterBy: mockSetCtxFilterBy }}
    >
        {children}
    </TransactionsCtx.Provider>
);

// Mocking the Image Import
jest.mock("@/src/assets/pen-icon.svg", () => "pen-icon.svg");

// Mocking child components used within Entities Page
jest.mock("@/src/components/elements/items/TransactionItem", () => ({ vals, setPageTrans }) => (
    <div data-testid={`transaction-item-${vals.id}`} onClick={() => setPageTrans([])}>
        <p>{vals.payee}</p>
        <p>{vals.amount}</p>
    </div>
));
jest.mock("@/src/components/elements/modals/AddEntityModal", () => ({ handleCloseModal }) => (
    <div data-testid="add-entity-modal" onClick={handleCloseModal}>
        Add Entity Modal
    </div>
));
jest.mock("@/src/components/elements/modals/ConfirmationModal.jsx", () => ({ text, onConfirm, onCancel }) => (
    <div data-testid="confirmation-modal">
        <button data-testid="confirm-action" onClick={onConfirm}>
            {text.confirm_txt}
        </button>
        <button data-testid="cancel-action" onClick={onCancel}>
            {text.cancel_txt}
        </button>
    </div>
));
jest.mock(
    "@/src/components/elements/utilities/SearchBox",
    () =>
        ({ itemName, items, onItemClick, onAddButtonClick }) =>
            (
                <div data-testid="search-box">
                    <p>
                        Search {itemName} Mock ({items.length} items)
                    </p>
                    <button onClick={onAddButtonClick}>Add New {itemName}</button>
                    {items.map((item) => (
                        <button key={item.id} data-testid={`search-item-${item.id}`} onClick={() => onItemClick(item)}>
                            {item.name}
                        </button>
                    ))}
                </div>
            )
);
jest.mock("@/src/components/elements/utilities/NoResultsDisplay", () => ({ mainText, guideText }) => (
    <div data-testid="no-results-display">
        <p>{mainText}</p>
        <span>{guideText}</span>
    </div>
));
jest.mock("@/src/components/elements/utilities/Input.jsx", () => ({ name, value, onChange }) => (
    <>
        <input data-testid={`input-${name}`} name={name} value={value} onChange={onChange} />
    </>
));
jest.mock("@/src/components/elements/utilities/Button.jsx", () => ({ text, onClick }) => (
    <button onClick={onClick}>{text}</button>
));

// Functon to create an EntitiesPage with context
const renderEntitiesPage = async () => {
    return render(
        <MockTransactionsCtxProvider>
            <MockEntitiesCtxProvider>
                <EntitiesPage />
            </MockEntitiesCtxProvider>
        </MockTransactionsCtxProvider>
    );
};

// Test suite to test input changes
describe("EntitiesPage Inital Render", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderEntitiesPage();
    });

    it("should render initial entities and components on mount", () => {
        expect(screen.getByText("Entity 1")).toBeInTheDocument();
        expect(screen.getByText("Entity 2")).toBeInTheDocument();
        expect(screen.getByText("General Information")).toBeInTheDocument();
        expect(screen.getByText("Add New Entity")).toBeInTheDocument();
    });

    it("should start in non editing mode", () => {
        expect(screen.getByRole("input-cluster")).not.toHaveClass("editing");
    });
});

describe("EntitiesPage basic UI changes", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderEntitiesPage();
    });

    it("should open entity information when clicked in list", async () => {
        fireEvent.click(screen.getByText("Entity 1"));
        expect(screen.getByTestId("input-company").value).toBe("Company 1");
        expect(screen.getByTestId("edit-entity-button")).toBeInTheDocument();
    });

    it("should change isEditing to true when the edit button is clicked", () => {
        expect(screen.getByRole("input-cluster")).not.toHaveClass("editing");
        fireEvent.click(screen.getByText("Entity 1"));
        fireEvent.click(screen.getByTestId("edit-entity-button"));
        expect(screen.getByRole("input-cluster")).toHaveClass("editing");
    });

    it("should change isEditing to false when the cancel button is clicked", () => {
        fireEvent.click(screen.getByText("Entity 1"));
        fireEvent.click(screen.getByTestId("edit-entity-button"));
        expect(screen.getByRole("input-cluster")).toHaveClass("editing");

        const cancelButton = screen.getByText("Cancel");
        expect(cancelButton).toBeInTheDocument();
        fireEvent.click(cancelButton);

        expect(screen.getByRole("input-cluster")).not.toHaveClass("editing");
    });

    it("should open the Add Entity Modal when the button is clicked", () => {
        expect(screen.queryByTestId("add-entity-modal")).not.toBeInTheDocument();

        fireEvent.click(screen.getByText("Add New Entity"));

        expect(screen.getByTestId("add-entity-modal")).toBeInTheDocument();
    });

    it("should close the Add Entity Modal when handleCloseModal is called", () => {
        fireEvent.click(screen.getByText("Add New Entity"));

        const modal = screen.getByTestId("add-entity-modal");
        fireEvent.click(modal);

        expect(screen.queryByTestId("add-entity-modal")).not.toBeInTheDocument();
    });
});

describe("EntitiesPage confimration modal functionality", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderEntitiesPage();
    });

    it("should open the confirmation modal when `delete` is clicked", async () => {
        fireEvent.click(screen.getByText("Entity 1"));
        fireEvent.click(screen.getByTestId("edit-entity-button"));
        fireEvent.click(screen.getByText("Delete"));

        expect(screen.getByTestId("confirmation-modal")).toBeInTheDocument();
    });

    it("should open the confirmation modal when `cancel` is clicked w/ changes", async () => {
        fireEvent.click(screen.getByText("Entity 1"));
        fireEvent.click(screen.getByTestId("edit-entity-button"));

        const nameInput = screen.getByTestId("input-name");
        fireEvent.change(nameInput, { target: { value: "changed name", name: "name" } });

        fireEvent.click(screen.getByText("Cancel"));

        expect(screen.getByTestId("confirmation-modal")).toBeInTheDocument();
    });

    it("should open the confirmation modal when different entity is clicked w/ changes", async () => {
        fireEvent.click(screen.getByText("Entity 1"));
        fireEvent.click(screen.getByTestId("edit-entity-button"));

        const nameInput = screen.getByTestId("input-name");
        fireEvent.change(nameInput, { target: { value: "changed name", name: "name" } });

        fireEvent.click(screen.getByText("Entity 2"));

        expect(screen.getByTestId("confirmation-modal")).toBeInTheDocument();
    });

    it("should not open the confirmation modal when `cancel` is clicked w/o changes", async () => {
        fireEvent.click(screen.getByText("Entity 1"));
        fireEvent.click(screen.getByTestId("edit-entity-button"));

        fireEvent.click(screen.getByText("Cancel"));

        expect(screen.queryByTestId("confirmation-modal")).not.toBeInTheDocument();
    });

    it("should not call updateEntity and close modal when `keep editing` is clicked", async () => {
        fireEvent.click(screen.getByText("Entity 1"));
        fireEvent.click(screen.getByTestId("edit-entity-button"));

        const nameInput = screen.getByTestId("input-name");
        fireEvent.change(nameInput, { target: { value: "changed name", name: "name" } });

        fireEvent.click(screen.getByText("Cancel"));

        expect(screen.getByTestId("confirmation-modal")).toBeInTheDocument();

        fireEvent.click(screen.getByTestId("cancel-action"));

        expect(mockCtxUpdateEntity).not.toHaveBeenCalled();
        expect(mockCtxActiveEntity.name).toBe("Entity 1");
        expect(screen.getByTestId("input-name").value).toBe("changed name");
    });

    it("should not call updateEntity, clear changes, and close modal when `discard changes` is clicked", async () => {
        fireEvent.click(screen.getByText("Entity 1"));
        fireEvent.click(screen.getByTestId("edit-entity-button"));

        const nameInput = screen.getByTestId("input-name");
        fireEvent.change(nameInput, { target: { value: "changed name", name: "name" } });

        fireEvent.click(screen.getByText("Cancel"));

        expect(screen.getByTestId("confirmation-modal")).toBeInTheDocument();

        fireEvent.click(screen.getByTestId("confirm-action"));

        expect(mockCtxUpdateEntity).not.toHaveBeenCalled();
        expect(mockCtxActiveEntity.name).toBe("Entity 1");
        expect(screen.getByTestId("input-name").value).toBe("Entity 1");
    });
});

describe("EntitiesPage entity editing", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderEntitiesPage();
    });

    it("should display tool buttons when editing icon clicked", () => {
        fireEvent.click(screen.getByText("Entity 1"));
        fireEvent.click(screen.getByTestId("edit-entity-button"));
        expect(screen.getByText("Save")).toBeInTheDocument();
        expect(screen.getByText("Cancel")).toBeInTheDocument();
        expect(screen.getByText("Delete")).toBeInTheDocument();
    });

    it("should update the entity when save is clicked", async () => {
        fireEvent.click(screen.getByText("Entity 1"));
        fireEvent.click(screen.getByTestId("edit-entity-button"));

        const newName = "new_name";
        const nameInput = screen.getByTestId("input-name");
        fireEvent.change(nameInput, { target: { value: newName, name: "name" } });

        fireEvent.click(screen.getByText("Save"));

        expect(mockCtxUpdateEntity).toHaveBeenCalledTimes(1);
        expect(mockCtxUpdateEntity).toHaveBeenCalledWith({
            ...mockCtxEntityList[0],
            name: newName,
            created_at: "", // Not sure where this value is coming from, not in mock data
        });
    });

    it("should delete the entity when delete is clicked", async () => {
        fireEvent.click(screen.getByText("Entity 1"));
        fireEvent.click(screen.getByTestId("edit-entity-button"));

        fireEvent.click(screen.getByText("Delete"));

        expect(screen.getByTestId("confirmation-modal")).toBeInTheDocument();
        fireEvent.click(screen.getByTestId("confirm-action"));

        expect(mockCtxUpdateEntity).toHaveBeenCalledTimes(1);
        expect(mockCtxUpdateEntity).toHaveBeenCalledWith({
            id: 1,
            is_deleted: true,
        });
    });
});

describe("EntitiesPage edit field validation", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderEntitiesPage();
    });

    it("should not update (fail validation) the entity when name is empty", async () => {
        fireEvent.click(screen.getByText("Entity 1"));
        fireEvent.click(screen.getByTestId("edit-entity-button"));

        const nameInput = screen.getByTestId("input-name");
        fireEvent.change(nameInput, { target: { value: "", name: "name" } });

        fireEvent.click(screen.getByText("Save"));

        expect(mockCtxUpdateEntity).not.toHaveBeenCalled();
        expect(screen.getByText("Error: Invalid edits. Check formats and try again.")).toBeInTheDocument();
    });

    it("should not update (fail validation) the entity when phone number is not correct format", async () => {
        fireEvent.click(screen.getByText("Entity 1"));
        fireEvent.click(screen.getByTestId("edit-entity-button"));

        const nameInput = screen.getByTestId("input-phone_number");
        fireEvent.change(nameInput, { target: { value: "1234", name: "phone_number" } });

        fireEvent.click(screen.getByText("Save"));

        expect(mockCtxUpdateEntity).not.toHaveBeenCalled();
    });

    it("should not update (fail validation) the entity when email is not correct format", async () => {
        fireEvent.click(screen.getByText("Entity 1"));
        fireEvent.click(screen.getByTestId("edit-entity-button"));

        const nameInput = screen.getByTestId("input-phone_number");
        fireEvent.change(nameInput, { target: { value: "test@email@test.com", name: "email" } });

        fireEvent.click(screen.getByText("Save"));

        expect(mockCtxUpdateEntity).not.toHaveBeenCalled();
    });
});
