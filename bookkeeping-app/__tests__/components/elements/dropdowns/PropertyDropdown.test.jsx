/*
 * Tests for PropertyDropdown component.
 *
 */

import { render, screen, fireEvent } from "@testing-library/react";
import PropertyDropdown from "@/src/components/elements/dropdowns/PropertyDropdown";
import PropertiesCtx from "@/src/components/contexts/PropertiesCtx";

// Mocking enviroment variables
jest.mock("@/src/constants", () => ({
    ENVIRONMENT: "test",
    BASE_URL: "http://test-url.com",
}));

const mockActiveProperty = {
    id: 1,
    name: "Property1",
};
const mockPropertyList = [
    { id: 1, name: "Property1" },
    { id: 2, name: "Property2" },
    { id: 3, name: "Property3" },
];
const mockSetActiveProperty = jest.fn();

// Mocking context provider
const MockPropertiesCtxProvider = ({ children }) => (
    <PropertiesCtx.Provider
        value={{
            ctxPropertyList: mockPropertyList,
            ctxActiveProperty: mockActiveProperty,
            setCtxActiveProperty: mockSetActiveProperty,
        }}
    >
        {children}
    </PropertiesCtx.Provider>
);

const renderPropertyDropdown = () => {
    return render(
        <MockPropertiesCtxProvider>
            <PropertyDropdown />
        </MockPropertiesCtxProvider>
    );
};

describe("PropertyDropdown Rendering and opening", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderPropertyDropdown();
    });

    it("should display the initial property name and not display other properties", () => {
        expect(screen.getByText("Property1")).toBeInTheDocument();
        expect(screen.queryByText("Property2")).not.toBeInTheDocument();
        expect(screen.queryByText("Property3")).not.toBeInTheDocument();
    });

    it("should expand and display all properties (and activeProperty) when display div is clicked", () => {
        const expansionButton = screen.getByRole("expansion-button");
        fireEvent.click(expansionButton);

        expect(screen.getAllByText("Property1")[0]).toBeInTheDocument();
        expect(screen.getAllByText("Property1")[1]).toBeInTheDocument();
        expect(screen.getByText("Property2")).toBeInTheDocument();
        expect(screen.getByText("Property3")).toBeInTheDocument();
    });
});

describe("PropertyDropdown Closing", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderPropertyDropdown();
    });

    const expandDropdown = () => {
        const expansionButton = screen.getByRole("expansion-button");
        fireEvent.click(expansionButton);
    };

    it("should close when expansion button is clicked again", () => {
        expandDropdown();

        expect(screen.getAllByText("Property1")[0]).toBeInTheDocument();
        expect(screen.getAllByText("Property1")[1]).toBeInTheDocument();
        expect(screen.getByText("Property2")).toBeInTheDocument();
        expect(screen.getByText("Property3")).toBeInTheDocument();

        // Should close now
        expandDropdown();

        expect(screen.getByText("Property1")).toBeInTheDocument();
        expect(screen.queryByText("Property2")).not.toBeInTheDocument();
        expect(screen.queryByText("Property3")).not.toBeInTheDocument();
    });

    it("should close when property is selected", () => {
        expandDropdown();

        fireEvent.click(screen.queryAllByText("Property1")[1]);

        expect(screen.getByText("Property1")).toBeInTheDocument();
        expect(screen.queryByText("Property2")).not.toBeInTheDocument();
        expect(screen.queryByText("Property3")).not.toBeInTheDocument();
    });
});

describe("PropertyDropdown setActiveProperty call", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderPropertyDropdown();
    });

    it("should call setActiveProperty with correct information when property is clicked", () => {
        const expansionButton = screen.getByRole("expansion-button");
        fireEvent.click(expansionButton);

        fireEvent.click(screen.getByText("Property2"));

        expect(mockSetActiveProperty).toHaveBeenCalledTimes(1);
        expect(mockSetActiveProperty).toHaveBeenCalledWith({ id: 2, name: "Property2" });
    });
});
