/*
 *   Tests for HomePage component.
 *
 */

import { render, screen } from "@testing-library/react";
import HomePage from "@/src/pages/HomePage";

jest.mock("@/src/components/elements/misc/Shortcuts", () => () => <div data-testid="shortcuts">Shortcuts</div>);
jest.mock("@/src/components/elements/misc/DashBlock", () => ({ title, text, link }) => (
    <div data-testid="dash-block">
        <p>{title}</p>
        <p>{text}</p>
        <span>{link}</span>
    </div>
));
jest.mock("@/src/components/elements/listings/DashListings", () => ({
    AccountListing: () => <div data-testid="account-listing">Account Listing</div>,
    PropertyListing: () => <div data-testid="property-listing">Property Listing</div>,
    ReportListing: () => <div data-testid="report-listing">Report Listing</div>,
}));
jest.mock("@/src/components/elements/misc/MonthlyRentStat", () => () => (
    <div data-testid="monthly-rent-stat">Monthly Rent Stat</div>
));

const renderHomePage = () => render(<HomePage />);

describe("HomePage initial render", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderHomePage();
    });

    it("should render the main dashboard sections on mount", () => {
        expect(screen.getByTestId("shortcuts")).toBeInTheDocument();
        expect(screen.getByTestId("account-listing")).toBeInTheDocument();
        expect(screen.getByTestId("property-listing")).toBeInTheDocument();
        expect(screen.getByTestId("report-listing")).toBeInTheDocument();
        expect(screen.getByTestId("monthly-rent-stat")).toBeInTheDocument();
    });

    it("should render the three notification blocks", () => {
        expect(screen.getAllByTestId("dash-block")).toHaveLength(3);
        expect(screen.getAllByText("Notification")).toHaveLength(3);
    });
});
