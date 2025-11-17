/*
 * Tests for PwdPopup component.
 *
 */

import { fireEvent, render, screen } from "@testing-library/react";
import SearchBox from "@/src/components/elements/utilities/SearchBox";

jest.mock("@/src/components/elements/utilities/Button.jsx", () => ({ text, onClick }) => (
    <button onClick={onClick}>{text}</button>
));

const mockOnItemClick = jest.fn();
const mockOnAddButtonClick = jest.fn();
const defaultItemName = "test-item";
const defaultItems = [{ name: "Item 1" }, { name: "Item 2" }, { name: "Item 3" }];
const renderSearchBox = (itemName = defaultItemName, items = defaultItems) => {
    return render(
        <SearchBox
            itemName={itemName}
            items={items}
            onItemClick={mockOnItemClick}
            onAddButtonClick={mockOnAddButtonClick}
        />
    );
};

describe("SearchBox rendering and initial state", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should list all items on render", () => {
        renderSearchBox();
        expect(screen.getByText("Item 1")).toBeInTheDocument();
        expect(screen.getByText("Item 2")).toBeInTheDocument();
        expect(screen.getByText("Item 3")).toBeInTheDocument();
    });

    it("should render all button with item name", () => {
        renderSearchBox();
        expect(screen.getByText("Add test-item")).toBeInTheDocument();
    });
});

describe("SearchBox filtering interactions", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should list all items with no searchTerm", () => {
        renderSearchBox();
        expect(screen.getByText("Item 1")).toBeInTheDocument();
        expect(screen.getByText("Item 2")).toBeInTheDocument();
        expect(screen.getByText("Item 3")).toBeInTheDocument();
    });

    it("should properly filter for search term", () => {
        renderSearchBox();
        expect(screen.getByText("Item 1")).toBeInTheDocument();
        expect(screen.getByText("Item 2")).toBeInTheDocument();
        expect(screen.getByText("Item 3")).toBeInTheDocument();

        const searchInput = screen.getByRole("textbox");
        fireEvent.change(searchInput, { target: { value: "1" } });
        expect(screen.getByText("Item 1")).toBeInTheDocument();
        expect(screen.queryByText("Item 2")).not.toBeInTheDocument();
        expect(screen.queryByText("Item 3")).not.toBeInTheDocument();

        fireEvent.change(searchInput, { target: { value: "item" } });
        expect(screen.getByText("Item 1")).toBeInTheDocument();
        expect(screen.getByText("Item 2")).toBeInTheDocument();
        expect(screen.getByText("Item 3")).toBeInTheDocument();
    });

    it("should show no items and text if no matches", () => {
        renderSearchBox();

        const searchInput = screen.getByRole("textbox");
        fireEvent.change(searchInput, { target: { value: "qwerty" } });
        expect(screen.queryByText("No matching items found.")).toBeInTheDocument();
        expect(screen.queryByText("Item 1")).not.toBeInTheDocument();
        expect(screen.queryByText("Item 2")).not.toBeInTheDocument();
        expect(screen.queryByText("Item 3")).not.toBeInTheDocument();
    });
});

describe("SearchBox click interactions", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should call onItemClick with the correct item when an item is clicked", () => {
        renderSearchBox();

        fireEvent.click(screen.getByText("Item 2"));
        expect(mockOnItemClick).toHaveBeenCalledTimes(1);
        expect(mockOnItemClick).toHaveBeenCalledWith({ name: "Item 2" });

        fireEvent.click(screen.getByText("Item 1"));
        expect(mockOnItemClick).toHaveBeenCalledTimes(2);
        expect(mockOnItemClick).toHaveBeenCalledWith({ name: "Item 1" });
    });

    it("should call onAddButtonClick when the 'Add item' button is clicked", () => {
        renderSearchBox();
        fireEvent.click(screen.getByText(`Add ${defaultItemName}`));

        expect(mockOnAddButtonClick).toHaveBeenCalledTimes(1);
        expect(mockOnAddButtonClick).toHaveBeenCalledWith(expect.anything());
    });

    it("should call onItemClick with the correct item after filtering", () => {
        renderSearchBox();
        const searchInput = screen.getByRole("textbox");
        fireEvent.change(searchInput, { target: { value: "3" } });

        fireEvent.click(screen.getByText("Item 3"));

        expect(mockOnItemClick).toHaveBeenCalledTimes(1);
        expect(mockOnItemClick).toHaveBeenCalledWith({ name: "Item 3" });
        expect(screen.queryByText("Item 1")).not.toBeInTheDocument();
        expect(screen.queryByText("Item 2")).not.toBeInTheDocument();
    });
});
