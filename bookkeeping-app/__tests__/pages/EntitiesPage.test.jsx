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
    { id: 1, name: "Entity 1", company: "Company 1" },
    { id: 2, name: "Entity 2", company: "Company 2" },
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
jest.mock("@/src/components/elements/modals/ConfirmationModal.jsx", () => ({ text, onConfirm }) => (
    <div data-testid="confirmation-modal">
        <button data-testid="confirm-delete-action" onClick={onConfirm}>
            {text.confirm_txt}
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

    it("should change isEditing when the edit button is clicked", () => {
        fireEvent.click(screen.getByText("Entity 1"));
        fireEvent.click(screen.getByTestId("edit-entity-button"));
        expect(screen.getByRole("input-cluster")).toHaveClass("editing");
    });
});
