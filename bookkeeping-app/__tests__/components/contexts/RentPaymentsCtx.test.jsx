import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useContext } from "react";
import useSWRImmutable from "swr/immutable";

import { RentPaymentsCtxProvider } from "@/src/contexts/RentPaymentsCtx";
import RentPaymentsCtx from "@/src/contexts/RentPaymentsCtx";
import PropertiesCtx from "@/src/contexts/PropertiesCtx";
import AuthCtx from "@/src/contexts/AuthCtx";
import { api, ApiError } from "@/src/Client";

jest.mock("swr/immutable", () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock("@/src/Client", () => {
    class MockApiError extends Error {
        constructor({ message = "error", status = 0 } = {}) {
            super(message);
            this.status = status;
        }
    }

    return {
        ApiError: MockApiError,
        api: {
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn(),
            patch: jest.fn(),
            delete: jest.fn(),
        },
    };
});

const mockShowToast = jest.fn();
jest.mock("@/src/contexts/ToastCtx", () => ({
    useToast: () => ({ showToast: mockShowToast }),
}));

const mockMutate = jest.fn();

const wrap = (component) =>
    render(
        <AuthCtx.Provider value={{ ctxAccessToken: "mock-token" }}>
            <PropertiesCtx.Provider value={{ ctxActiveProperty: { id: 1 } }}>{component}</PropertiesCtx.Provider>
        </AuthCtx.Provider>
    );

const TestComponent = () => {
    const ctx = useContext(RentPaymentsCtx);
    return (
        <div>
            <span data-testid="count">{ctx.ctxMonthPaymentList?.length || 0}</span>
            <button onClick={() => ctx.ctxAddPayment({ amount: 100, date: "2026-01-01", entity: { id: 9 } })}>Add</button>
            <button onClick={() => ctx.ctxUpdatePayment({ id: 1, amount: 200, date: "2026-01-01" })}>Update</button>
            <button onClick={() => ctx.ctxGetMonthlySummary(1, 2026)}>Summary</button>
        </div>
    );
};

describe("RentPaymentsCtx", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        sessionStorage.clear();
        useSWRImmutable.mockImplementation(() => ({
            data: [[{ id: 1, amount: 100, date: "2026-01-01" }]],
            isLoading: false,
            mutate: mockMutate,
        }));
    });

    test("uses SWR tuple key", () => {
        wrap(
            <RentPaymentsCtxProvider>
                <TestComponent />
            </RentPaymentsCtxProvider>
        );
        expect(useSWRImmutable).toHaveBeenCalledWith(expect.any(Array), expect.any(Function));
    });

    test("adds payment through client and mutates day bucket", async () => {
        api.post.mockResolvedValueOnce({ id: 2, amount: 100, date: "2026-01-01" });
        wrap(
            <RentPaymentsCtxProvider>
                <TestComponent />
            </RentPaymentsCtxProvider>
        );

        fireEvent.click(screen.getByText("Add"));
        await waitFor(() => expect(api.post).toHaveBeenCalledWith("/api/rentPayments/", {
            amount: 100,
            date: "2026-01-01",
            entity_id: 9,
        }, {
            query: { property_id: 1 },
        }));

        expect(mockShowToast).toHaveBeenCalledWith("Payment added", "success", 3000);
    });

    test("updates payment and fetches monthly summary", async () => {
        api.put.mockResolvedValueOnce({ id: 1, amount: 200, date: "2026-01-01" });
        api.get.mockResolvedValueOnce({ total: 200 });

        wrap(
            <RentPaymentsCtxProvider>
                <TestComponent />
            </RentPaymentsCtxProvider>
        );

        fireEvent.click(screen.getByText("Update"));
        await waitFor(() => expect(api.put).toHaveBeenCalledWith("/api/rentPayments/1/", { id: 1, amount: 200, date: "2026-01-01" }));

        fireEvent.click(screen.getByText("Summary"));
        await waitFor(() => expect(api.get).toHaveBeenCalledWith("/api/rentPayments/monthsummary/", {
            query: { property_id: 1, month: 1, year: 2026 },
        }));
    });

    test("handles api errors", async () => {
        api.post.mockRejectedValueOnce(new ApiError({ status: 400, message: "bad" }));
        wrap(
            <RentPaymentsCtxProvider>
                <TestComponent />
            </RentPaymentsCtxProvider>
        );

        fireEvent.click(screen.getByText("Add"));
        await waitFor(() => expect(mockShowToast).toHaveBeenCalledWith("Error adding payment", "error", 5000));
    });
});

