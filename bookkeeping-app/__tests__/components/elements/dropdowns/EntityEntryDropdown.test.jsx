/*
 * Tests for EntityEntryDropdown component.
 *
 */

import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import EntityEntryDropdown from "@/src/components/elements/dropdowns/EntityEntryDropdown";
import EntitiesCtx from "@/src/components/contexts/EntitiesCtx";

// Mocking enviroment variables
jest.mock("@/src/constants", () => ({
    ENVIRONMENT: "test",
    BASE_URL: "http://test-url.com",
}));

// Mocking utilities and modals
jest.mock("@/src/components/elements/utilities/Button.jsx", () => ({ text, onClick }) => (
    <button onClick={onClick}>{text}</button>
));
jest.mock("@/src/components/elements/modals/AddEntityModal", () => ({ handleCloseModal }) => (
    <div data-testid="add-entity-modal" onClick={handleCloseModal}>
        Add Entity Modal
    </div>
));

// The scrollRef is mocked simply as it's not being tested
const mockScrollRef = {
    current: null,
};
// Use real timers for the handleBlur setTimeout
jest.useFakeTimers();

const mockEntityList = [
    { id: 1, name: "Entity1" },
    { id: 2, name: "Entity2" },
    { id: 3, name: "Entity3" },
    { id: 4, name: "Entity4" },
];

// Mocking context provider
const MockEntitiesCtxProvider = ({ children, entityList = mockEntityList }) => (
    <EntitiesCtx.Provider value={{ ctxEntityList: entityList }}>{children}</EntitiesCtx.Provider>
);

const mockOnChange = jest.fn();
const renderEntityDropdown = () => {
    return render(
        <MockEntitiesCtxProvider>
            <EntityEntryDropdown scrollRef={mockScrollRef} onChange={mockOnChange} />
        </MockEntitiesCtxProvider>
    );
};

describe("EntityEntryDropdown Rendering and initial state", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderEntityDropdown();
    });

    it("should display an empty initial value in the input field", () => {
        expect(screen.getByRole("textbox")).toHaveValue("");
    });

    it("should have dropdown be display:none on render", () => {
        expect(screen.getByRole("dropdown-anchor")).toHaveClass("noDisplay");
        expect(screen.queryByText("All Entities")).toBeInTheDocument();
        expect(screen.queryByText("Entity2")).toBeInTheDocument();
    });
});

describe("EntityEntryDropdown Opening and Filtering", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderEntityDropdown();
    });

    it("should expand and remove noDisplay when input is focused", () => {
        const input = screen.getByRole("textbox");
        fireEvent.focus(input);

        // Clear search term to show all accounts
        fireEvent.change(input, { target: { value: "" } });

        expect(screen.getByText("All Entities")).toBeInTheDocument();
        expect(screen.getByText("Add Entity")).toBeInTheDocument();
        expect(screen.getByText("Entity1")).toBeInTheDocument();
        expect(screen.getByText("Entity2")).toBeInTheDocument();
        expect(screen.getByRole("dropdown-anchor")).not.toHaveClass("noDisplay");
    });

    it("should filter entities based on user input", () => {
        const input = screen.getByRole("textbox");

        // Type 'cred'
        fireEvent.change(input, { target: { value: "2" } });

        // Dropdown should be expanded and show only "Credit Card"
        expect(screen.getByText("All Entities")).toBeInTheDocument();
        expect(screen.getByText("Entity2")).toBeInTheDocument();
        expect(screen.queryByText("Entity3")).not.toBeInTheDocument();
        expect(screen.queryByText("Entity4")).not.toBeInTheDocument();
    });

    it("should display 'No matching accounts found.' when filter yields no results", () => {
        const input = screen.getByRole("textbox");

        // Type 'xyz'
        fireEvent.change(input, { target: { value: "xyz" } });

        expect(screen.getByText("No matching entities found.")).toBeInTheDocument();
        expect(screen.queryByText("Entity1")).not.toBeInTheDocument();
    });
});

describe("EntityEntryDropdown Selection and Closing", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderEntityDropdown();

        const input = screen.getByRole("textbox");
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: "" } });
    });

    it("should close and update input when a new entity is selected", async () => {
        expect(screen.getByRole("dropdown-anchor")).not.toHaveClass("noDisplay"); // Check open

        const entity2 = screen.getByText("Entity2");
        fireEvent.click(entity2);

        expect(screen.getByRole("textbox")).toHaveValue("Entity2");
        expect(screen.getByRole("dropdown-anchor")).toHaveClass("noDisplay");

        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(mockOnChange).toHaveBeenCalledWith({ id: 2, name: "Entity2" });
    });

    it("should set dropdown to display none when clicked outside of", async () => {
        expect(screen.getByRole("dropdown-anchor")).not.toHaveClass("noDisplay"); // Check open
        fireEvent.mouseDown(document.body);

        await waitFor(() => {
            expect(screen.getByRole("dropdown-anchor")).toHaveClass("noDisplay");
        });
    });
});

describe("AccountEntryDropdown Add Account Modal", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderEntityDropdown();
    });

    it("should open the Add Entity Modal when the button is clicked", () => {
        fireEvent.focus(screen.getByRole("textbox"));
        expect(screen.queryByTestId("add-entity-modal")).not.toBeInTheDocument();

        const addButton = screen.getByText("Add Entity");
        fireEvent.click(addButton);

        expect(screen.getByTestId("add-entity-modal")).toBeInTheDocument();
    });

    it("should close the Add Entity Modal when handleCloseModal is called", () => {
        fireEvent.focus(screen.getByRole("textbox"));
        fireEvent.click(screen.getByText("Add Entity"));

        const modal = screen.getByTestId("add-entity-modal");
        fireEvent.click(modal);

        expect(screen.queryByTestId("add-entity-modal")).not.toBeInTheDocument();
    });
});
