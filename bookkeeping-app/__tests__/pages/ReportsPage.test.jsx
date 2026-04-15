/*
 *   Tests for ReportsPage component.
 *
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ReportsPage from "@/src/pages/ReportsPage";
import AccountsCtx from "@/src/contexts/AccountsCtx";

jest.mock("@/src/contexts/AccountsCtx", () => {
    const React = require("react");
    return {
        __esModule: true,
        default: React.createContext({}),
    };
});

const mockAddReport = jest.fn();

// Mocking enviroment variables
jest.mock("@/src/constants", () => ({
    ENVIRONMENT: "test",
    BASE_URL: "http://test-url.com",
}));

jest.mock("@/src/hooks/useReportApi", () => ({
    useReportAPI: () => ({
        addReport: mockAddReport,
    }),
}));
jest.mock("@/src/components/elements/reports/BalanceSheet", () => ({ accounts }) => (
    <div data-testid="balance-sheet">Balance Sheet ({accounts.length})</div>
));
jest.mock("@/src/components/elements/reports/ProfitLoss", () => ({ accounts }) => (
    <div data-testid="profit-loss">Profit &amp; Loss ({accounts.length})</div>
));
jest.mock("@/src/components/elements/utilities/Button", () => ({ text, onClick }) => (
    <button onClick={onClick}>{text}</button>
));

const mockCtxAccountList = [
    { id: 1, name: "Checking" },
    { id: 2, name: "Rent Income" },
];

const renderReportsPage = () => {
    return render(
        <AccountsCtx.Provider value={{ ctxAccountList: mockCtxAccountList }}>
            <ReportsPage />
        </AccountsCtx.Provider>
    );
};

describe("ReportsPage initial render", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderReportsPage();
    });

    it("should render the report tools and quick select history on mount", () => {
        expect(screen.getByText("Reports")).toBeInTheDocument();
        expect(screen.getByText("Quick Select")).toBeInTheDocument();
        expect(screen.getByText("Run Report")).toBeInTheDocument();
        expect(screen.getAllByText("All Time").length).toBeGreaterThan(0);
    });
});

describe("ReportsPage report actions", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderReportsPage();
    });

    it("should run the default profit and loss report", () => {
        fireEvent.click(screen.getByText("Run Report"));

        expect(mockAddReport).toHaveBeenCalledWith({
            type: "profit_loss",
            report_range_type: "Custom",
            start_date: "",
            end_date: "",
        });
        expect(screen.getByTestId("profit-loss")).toBeInTheDocument();
    });

    it("should change report options and run a balance sheet report", async () => {
        fireEvent.click(screen.getAllByText("Profit & Loss")[0]);
        fireEvent.click(screen.getAllByText("Balance Sheet")[0]);
        fireEvent.click(screen.getByText("Custom"));
        fireEvent.click(screen.getAllByText("All Time")[0]);

        await waitFor(() => {
            expect(screen.getByDisplayValue("1900-01-01")).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText("Run Report"));

        expect(mockAddReport).toHaveBeenCalledWith({
            type: "balance_sheet",
            report_range_type: "All Time",
            start_date: "1900-01-01",
            end_date: expect.any(String),
        });
        expect(screen.getByTestId("balance-sheet")).toBeInTheDocument();
    });
});
