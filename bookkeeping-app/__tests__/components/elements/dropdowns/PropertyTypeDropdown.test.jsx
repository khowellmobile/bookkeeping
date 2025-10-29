/*
 * Tests for PropertyTypeDropdown component.
 *
 */

import { render, screen, fireEvent } from "@testing-library/react";
import PropertyTypeDropdown from "@/src/components/elements/dropdowns/PropertyTypeDropdown";

const mockVal = "Commercial";
const mockClickHandler = jest.fn();
const renderPropertyTypeDropdown = (isEditing = true) => {
    return render(
        <PropertyTypeDropdown initalVal={mockVal} clickTypeHandler={mockClickHandler} isEditing={isEditing} />
    );
};

describe("PropertyTypeDropdown Rendering and opening", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderPropertyTypeDropdown();
    });

    it("should display the initial property type and not display dropdown", () => {
        expect(screen.getByText("Commercial")).toBeInTheDocument();
        expect(screen.getByRole("dropdown-menu")).toHaveClass("noDisplay");
    });

    it("should expand and display all property types when display div is clicked", () => {
        const expandButton = screen.getByRole("expansion-button");
        fireEvent.click(expandButton);

        expect(screen.getByText("Commercial")).toBeInTheDocument();
        expect(screen.getByRole("dropdown-menu")).not.toHaveClass("noDisplay");
    });
});

describe("PropertyTypeDropdown Closing", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderPropertyTypeDropdown();
    });

    const expandDropdown = () => {
        const expandButton = screen.getByRole("expansion-button");
        fireEvent.click(expandButton);
    };

    it("should close when expansion button is clicked", () => {
        expandDropdown();
        expect(screen.getByText("Commercial")).toBeInTheDocument();
        expect(screen.getByRole("dropdown-menu")).not.toHaveClass("noDisplay");

        // Click again to close
        expandDropdown();
        expect(screen.getByText("Commercial")).toBeInTheDocument();
        expect(screen.getByRole("dropdown-menu")).toHaveClass("noDisplay");
    });

    it("should close when property type is selected", () => {
        expandDropdown();

        fireEvent.click(screen.getByText("Residential"));

        expect(screen.getByRole("dropdown-menu")).toHaveClass("noDisplay");
    });
});

describe("PropertyTypeDropdown onChange call", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderPropertyTypeDropdown();
    });

    it("should call onChange with correct information when property type is clicked", () => {
        const expandButton = screen.getByRole("expansion-button");
        fireEvent.click(expandButton);

        fireEvent.click(screen.getByText("Residential"));

        expect(mockClickHandler).toHaveBeenCalledTimes(1);
        expect(mockClickHandler).toHaveBeenCalledWith("residential");
    });
});
