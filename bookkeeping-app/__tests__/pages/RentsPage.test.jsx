/*
 *   Tests for RentsPage component.
 *
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useMemo, useState } from "react";
import RentsPage from "@/src/pages/RentsPage";
import RentPaymentsCtx from "@/src/contexts/RentPaymentsCtx";

jest.mock("@/src/contexts/RentPaymentsCtx", () => {
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

const mockCtxAddPayment = jest.fn();

const createMonthPaymentList = () => {
    const list = Array.from({ length: 31 }, () => []);
    list[0] = [{ id: 1, entity: "Tenant One", amount: "1250", status: "Due" }];
    return list;
};

const MockRentPaymentsCtxProvider = ({
    children,
    paymentList = createMonthPaymentList(),
    activeDate = new Date(2026, 3, 15),
    loading = false,
}) => {
    const [ctxActiveDate, setCtxActiveDate] = useState(activeDate);

    const mockedValue = useMemo(
        () => ({
            ctxMonthPaymentList: paymentList,
            ctxAddPayment: mockCtxAddPayment,
            ctxActiveDate,
            setCtxActiveDate,
            isLoading: loading,
        }),
        [paymentList, ctxActiveDate, loading],
    );

    return <RentPaymentsCtx.Provider value={mockedValue}>{children}</RentPaymentsCtx.Provider>;
};

jest.mock("@/src/components/elements/items/RentItem", () => ({ item, handleSaveRentPayment, removeTemp }) => (
    <div data-testid={`rent-item-${item.id}`}>
        <p>{item.entity || "Temp Rent Item"}</p>
        <button onClick={() => handleSaveRentPayment(0, item)}>Save Rent</button>
        {removeTemp && <button onClick={removeTemp}>Remove Rent</button>}
    </div>
));
jest.mock("@/src/components/elements/utilities/NoResultsDisplay", () => ({ mainText, guideText }) => (
    <div data-testid="no-results-display">
        <p>{mainText}</p>
        <span>{guideText}</span>
    </div>
));
jest.mock("@/src/components/elements/utilities/IsLoadingDisplay", () => () => (
    <div data-testid="is-loading-display">Loading</div>
));

const renderRentsPage = (options = {}) => {
    return render(
        <MockRentPaymentsCtxProvider
            paymentList={options.paymentList}
            activeDate={options.activeDate}
            loading={options.loading}
        >
            <RentsPage />
        </MockRentPaymentsCtxProvider>,
    );
};

describe("RentsPage initial render", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderRentsPage();
    });

    it("should render the active month and rent items on mount", () => {
        expect(screen.getByText("April 2026 Rents")).toBeInTheDocument();
        expect(screen.getByText("Tenant One")).toBeInTheDocument();
        expect(screen.getByText("Sunday")).toBeInTheDocument();
    });

    it("should change the active month when a new month is chosen", async () => {
        fireEvent.click(screen.getAllByAltText("Icon")[0]);
        fireEvent.click(screen.getByText("Feb"));

        await waitFor(() => {
            expect(screen.getByText("February 2026 Rents")).toBeInTheDocument();
        });
    });
});

describe("RentsPage rent interactions", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderRentsPage();
    });

    it("should add a temporary rent item and save it", () => {
        fireEvent.click(screen.getAllByAltText("Icon")[1]);

        expect(screen.getAllByText("Save Rent").length).toBeGreaterThan(1);

        fireEvent.click(screen.getAllByText("Save Rent").at(-1));
        expect(mockCtxAddPayment).toHaveBeenCalled();
    });
});

describe("RentsPage loading and empty states", () => {
    it("should show the loading display while payments are loading", () => {
        jest.clearAllMocks();
        renderRentsPage({ paymentList: [], loading: true });

        expect(screen.getByTestId("is-loading-display")).toBeInTheDocument();
    });

    it("should show the no results display when there are no payments", () => {
        jest.clearAllMocks();
        renderRentsPage({ paymentList: [], loading: false });

        expect(screen.getByTestId("no-results-display")).toBeInTheDocument();
        expect(screen.getByText("Nothing to Load")).toBeInTheDocument();
    });
});
