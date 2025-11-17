/*
 * Tests for EntityDropdown component.
 *
 */

import { render, screen, fireEvent } from "@testing-library/react";
import EntityDropdown from "@/src/components/elements/dropdowns/EntityDropdown";
import EntitiesCtx from "@/src/components/contexts/EntitiesCtx";

// Mocking enviroment variables
jest.mock("@/src/constants", () => ({
    ENVIRONMENT: "test",
    BASE_URL: "http://test-url.com",
}));

const mockEntityList = [
    { id: 1, name: "Entity1" },
    { id: 2, name: "Entity2" },
    { id: 3, name: "Entity3" },
];

// Mocking context provider
const MockEntitiesCtxProvider = ({ children }) => (
    <EntitiesCtx.Provider value={{ ctxEntityList: mockEntityList }}>{children}</EntitiesCtx.Provider>
);

const mockEntity = {
    id: 1,
    name: "Entity1",
};
const mockOnChange = jest.fn();

const renderEntityDropdown = (entity = mockEntity) => {
    return render(
        <MockEntitiesCtxProvider>
            <EntityDropdown initalVal={entity} onChange={mockOnChange} />
        </MockEntitiesCtxProvider>
    );
};

const renderAltClassEntityDropdown = (entity = mockEntity) => {
    return render(
        <MockEntitiesCtxProvider>
            <EntityDropdown initalVal={entity} onChange={mockOnChange} altClass="alt-style" />
        </MockEntitiesCtxProvider>
    );
};

describe("EntityDropdown Rendering and opening", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderEntityDropdown();
    });

    it("should display the initial account name and not display other entities", () => {
        expect(screen.getByText("Entity1")).toBeInTheDocument();
        expect(screen.queryByText("Entity2")).not.toBeInTheDocument();
        expect(screen.queryByText("Entity3")).not.toBeInTheDocument();
    });

    it("should expand and display all entities (and activeEntity) when display div is clicked", () => {
        const displayDiv = screen.getByText("Entity1");
        fireEvent.click(displayDiv);

        expect(screen.getAllByText("Entity1")[0]).toBeInTheDocument();
        expect(screen.getAllByText("Entity1")[1]).toBeInTheDocument();
        expect(screen.getByText("Entity2")).toBeInTheDocument();
        expect(screen.getByText("Entity3")).toBeInTheDocument();
    });
});

describe("EntityDropdown Closing", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderEntityDropdown();
    });

    const expandDropdown = () => {
        const displayDiv = screen.getByText("Entity1");
        fireEvent.click(displayDiv);
    };

    it("should close when clicked outside of", () => {
        expandDropdown();

        fireEvent.mouseDown(document);

        expect(screen.getByText("Entity1")).toBeInTheDocument();
        expect(screen.queryByText("Entity2")).not.toBeInTheDocument();
        expect(screen.queryByText("Entity3")).not.toBeInTheDocument();
    });

    it("should close when entity is selected", () => {
        expandDropdown();

        fireEvent.click(screen.getByText("Entity2"));

        expect(screen.getByText("Entity2")).toBeInTheDocument();
        expect(screen.queryByText("Entity1")).not.toBeInTheDocument();
        expect(screen.queryByText("Entity3")).not.toBeInTheDocument();
    });
});

describe("EntityDropdown onChange call", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderEntityDropdown();
    });

    it("should call onChange with correct information when entity is clicked", () => {
        const displayDiv = screen.getByText("Entity1");
        fireEvent.click(displayDiv);

        fireEvent.click(screen.getByText("Entity2"));

        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(mockOnChange).toHaveBeenCalledWith({ id: 2, name: "Entity2" });
    });
});

describe("EntityDropdown Off-Screen Logic (with altClass)", () => {
    let mockGetBoundingClientRect;

    beforeEach(() => {
        jest.clearAllMocks();

        global.innerHeight = 1000;
        mockGetBoundingClientRect = jest.fn(() => ({
            bottom: 100,
            top: 50,
        }));
        HTMLDivElement.prototype.getBoundingClientRect = mockGetBoundingClientRect;
    });

    afterEach(() => {
        delete HTMLDivElement.prototype.getBoundingClientRect;
    });

    it("should be NOT off-screen and use default '1.5rem' style when element is near the top", () => {
        renderAltClassEntityDropdown();

        const displayDiv = screen.getByText("Entity1");
        fireEvent.click(displayDiv);

        const dropDownContent = screen.getByText("Find Payee").parentElement;
        expect(dropDownContent).toHaveStyle("top: 1.5rem");
    });

    it("should BE off-screen and use reversed '-20rem' style when element is near the bottom", () => {
        global.innerHeight = 500;

        mockGetBoundingClientRect.mockReturnValue({
            bottom: 450,
            top: 400,
        });
        renderAltClassEntityDropdown();

        const displayDiv = screen.getByText("Entity1");
        fireEvent.click(displayDiv);

        const dropDownContent = screen.getByText("Find Payee").parentElement;
        expect(dropDownContent).toHaveStyle("top: -20rem");
    });
});
