/*
 *   Tests for SupportPage component.
 *
 */

import { render, screen, fireEvent } from "@testing-library/react";
import SupportPage from "@/src/pages/SupportPage";

jest.mock("@/src/components/elements/misc/SupportTicket", () => () => (
    <div data-testid="support-ticket">Support Ticket Form</div>
));

const renderSupportPage = () => render(<SupportPage />);

describe("SupportPage initial render", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderSupportPage();
    });

    it("should render the default support group state on mount", () => {
        expect(screen.getByText("General")).toBeInTheDocument();
        expect(screen.getByText("Group not made")).toBeInTheDocument();
        expect(screen.getByText("Q & A")).toBeInTheDocument();
        expect(screen.getByText("Contact Us")).toBeInTheDocument();
        expect(screen.getByText("Submit a Ticket")).toBeInTheDocument();
    });
});

describe("SupportPage group interactions", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderSupportPage();
    });

    it("should render the support ticket form when the ticket group is selected", () => {
        fireEvent.click(screen.getByText("Submit a Ticket"));

        expect(screen.getByRole("heading", { name: "Submit a Ticket" })).toBeInTheDocument();
        expect(screen.getByTestId("support-ticket")).toBeInTheDocument();
    });

    it("should switch back to placeholder content when a non-ticket group is selected", () => {
        fireEvent.click(screen.getByText("Submit a Ticket"));
        fireEvent.click(screen.getByText("Contact Us"));

        expect(screen.getByRole("heading", { name: "Contact Us" })).toBeInTheDocument();
        expect(screen.queryByTestId("support-ticket")).not.toBeInTheDocument();
        expect(screen.getByText("Group not made")).toBeInTheDocument();
    });
});
