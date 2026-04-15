/*
 *   Tests for PropertiesPage component.
 *
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { useMemo, useState } from "react";
import PropertiesPage from "@/src/pages/PropertiesPage";
import PropertiesCtx from "@/src/contexts/PropertiesCtx";

jest.mock("@/src/contexts/PropertiesCtx", () => {
    const React = require("react");
    return {
        __esModule: true,
        default: React.createContext({}),
    };
});

// Mocking enviroment variables
jest.mock("@/src/constants", () => ({
    ENVIRONMENT: "test",
    BASE_URL: "http://test-url.com",
}));

const mockShowConfirmModal = jest.fn();
const mockCtxUpdateProperty = jest.fn();

jest.mock("@/src/contexts/ConfirmModalCtx", () => ({
    useConfirmModal: () => ({
        showConfirmModal: mockShowConfirmModal,
    }),
}));

const mockCtxPropertyList = [
    {
        id: 1,
        name: "Elm House",
        address: "123 Elm St",
        property_type: "Single Family",
        number_of_units: "2",
        rent: "1250",
        is_active: "true",
    },
    {
        id: 2,
        name: "Oak Apartments",
        address: "456 Oak Ave",
        property_type: "Multi Family",
        number_of_units: "6",
        rent: "4800",
        is_active: "true",
    },
];

const MockPropertiesCtxProvider = ({ children, initialActiveProperty = null }) => {
    const [ctxActiveProperty, setCtxActiveProperty] = useState(initialActiveProperty);

    const mockedValue = useMemo(
        () => ({
            ctxPropertyList: mockCtxPropertyList,
            ctxUpdateProperty: mockCtxUpdateProperty,
            setCtxActiveProperty,
            ctxActiveProperty,
        }),
        [ctxActiveProperty]
    );

    return <PropertiesCtx.Provider value={mockedValue}>{children}</PropertiesCtx.Provider>;
};

jest.mock("@/src/assets/pen-icon.svg", () => "pen-icon.svg");
jest.mock("@/src/components/elements/modals/AddPropertyModal", () => ({ handleCloseModal }) => (
    <div data-testid="add-property-modal" onClick={handleCloseModal}>
        Add Property Modal
    </div>
));
jest.mock(
    "@/src/components/elements/utilities/SearchBox",
    () =>
        ({ itemName, items, onItemClick, onAddButtonClick }) => (
            <div data-testid="search-box">
                <button onClick={onAddButtonClick}>Add New {itemName}</button>
                {items.map((item) => (
                    <button key={item.id} data-testid={`search-item-${item.id}`} onClick={() => onItemClick(item)}>
                        {item.name}
                    </button>
                ))}
            </div>
        )
);
jest.mock("@/src/components/elements/misc/RentInformation", () => () => (
    <div data-testid="rent-information">Rent Information</div>
));
jest.mock("@/src/components/elements/dropdowns/PropertyTypeDropdown", () => ({ val, clickTypeHandler, isEditing }) => (
    <div data-testid="property-type-dropdown">
        <p>{val || "No Type Selected"}</p>
        {isEditing && <button onClick={() => clickTypeHandler("Commercial")}>Set Commercial</button>}
    </div>
));
jest.mock("@/src/components/elements/utilities/Input", () => ({ type, name, value, onChange, disabled }) => (
    <input data-testid={`input-${name || type}`} type={type} name={name} value={value} onChange={onChange} disabled={disabled} />
));
jest.mock("@/src/components/elements/utilities/Button", () => ({ text, onClick }) => (
    <button onClick={onClick}>{text}</button>
));

const renderPropertiesPage = (initialActiveProperty = null) => {
    return render(
        <MockPropertiesCtxProvider initialActiveProperty={initialActiveProperty}>
            <PropertiesPage />
        </MockPropertiesCtxProvider>
    );
};

describe("PropertiesPage initial render", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderPropertiesPage();
    });

    it("should render the property tools and information sections on mount", () => {
        expect(screen.getByTestId("search-box")).toBeInTheDocument();
        expect(screen.getByText("General Information")).toBeInTheDocument();
        expect(screen.getByText("Financial Information")).toBeInTheDocument();
        expect(screen.getByTestId("rent-information")).toBeInTheDocument();
    });

    it("should open and close the Add Property modal", () => {
        expect(screen.queryByTestId("add-property-modal")).not.toBeInTheDocument();

        fireEvent.click(screen.getByText("Add New Property"));
        expect(screen.getByTestId("add-property-modal")).toBeInTheDocument();

        fireEvent.click(screen.getByTestId("add-property-modal"));
        expect(screen.queryByTestId("add-property-modal")).not.toBeInTheDocument();
    });
});

describe("PropertiesPage property editing", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderPropertiesPage();
    });

    it("should load a selected property and save changed values", () => {
        fireEvent.click(screen.getByTestId("search-item-1"));
        expect(screen.getByTestId("input-name").value).toBe("Elm House");

        fireEvent.click(screen.getByAltText("Icon"));
        fireEvent.change(screen.getByTestId("input-address"), {
            target: { name: "address", value: "999 Updated Ave" },
        });
        fireEvent.click(screen.getByText("Save"));

        expect(mockCtxUpdateProperty).toHaveBeenCalledWith({
            id: 1,
            name: "Elm House",
            address: "999 Updated Ave",
            property_type: "Single Family",
            number_of_units: "2",
            rent: "1250",
            is_active: "true",
        });
    });

    it("should open a discard confirmation when changing properties with unsaved edits", () => {
        fireEvent.click(screen.getByTestId("search-item-1"));
        fireEvent.click(screen.getByAltText("Icon"));
        fireEvent.change(screen.getByTestId("input-name"), {
            target: { name: "name", value: "Changed Property Name" },
        });

        fireEvent.click(screen.getByTestId("search-item-2"));

        expect(mockShowConfirmModal).toHaveBeenCalled();
    });

    it("should confirm delete flow when the delete button is clicked", () => {
        mockShowConfirmModal.mockImplementationOnce((text, onConfirm) => onConfirm());

        fireEvent.click(screen.getByTestId("search-item-1"));
        fireEvent.click(screen.getByAltText("Icon"));
        fireEvent.click(screen.getByText("Delete"));

        expect(mockCtxUpdateProperty).toHaveBeenCalledWith({ id: 1, is_deleted: true });
    });
});
