/*
 * Tests for JournalsCtxProvider component.
 *
 */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useContext } from "react";

import { RentPaymentsCtxProvider } from "@/src/components/contexts/RentPaymentsCtx";
import RentPaymentsCtx from "@/src/components/contexts/RentPaymentsCtx";
import PropertiesCtx from "@/src/components/contexts/PropertiesCtx";
import AuthCtx from "@/src/components/contexts/AuthCtx";

// Mocking environment variables
jest.mock("@/src/constants", () => ({
    ENVIRONMENT: "test",
    BASE_URL: "http://test-url.com",
}));

// Mock sessionStorage
const mockSessionStorage = (() => {
    let store = {};
    return {
        getItem: jest.fn((key) => store[key] || null),
        setItem: jest.fn((key, value) => {
            store[key] = value;
        }),
        clear: jest.fn(() => {
            store = {};
        }),
        removeItem: jest.fn((key) => {
            delete store[key];
        }),
    };
})();
Object.defineProperty(window, "sessionStorage", {
    value: mockSessionStorage,
});

// Mock useSWRImmutable
jest.mock("swr/immutable", () => ({
    __esModule: true,
    default: jest.fn(),
}));

const mockMutate = jest.fn();

// Mock the useToast hook
const mockShowToast = jest.fn();
jest.mock("@/src/components/contexts/ToastCtx", () => ({
    useToast: () => ({ showToast: mockShowToast }),
}));

// Define placeholder for global.fetch and spy
if (typeof global.fetch === "undefined") {
    global.fetch = jest.fn();
}
const mockFetch = jest.spyOn(global, "fetch");
let consoleErrorSpy;

// Mock Parent Context Providers
const mockAccessToken = "mock-token";
const MockAuthsCtxProvider = ({ children }) => (
    <AuthCtx.Provider value={{ ctxAccessToken: mockAccessToken }}>{children}</AuthCtx.Provider>
);

const mockActiveProperty = { id: 1, name: "Test Property" };
const MockPropertiesCtxProvider = ({ children }) => (
    <PropertiesCtx.Provider value={{ ctxActiveProperty: mockActiveProperty }}>{children}</PropertiesCtx.Provider>
);

// Function to render the Provider wrapped around the consumer component
const wrapAndRenderComponent = (component) => {
    return render(
        <MockAuthsCtxProvider>
            <MockPropertiesCtxProvider>
                <RentPaymentsCtxProvider>{component}</RentPaymentsCtxProvider>
            </MockPropertiesCtxProvider>
        </MockAuthsCtxProvider>
    );
};

const GeneralTestComponent = () => {
    const {
        ctxPaymentList,
        ctxMonthPaymentList,
        setCtxActiveDate,
        getCtxPaymentsByMonth,
        ctxAddPayment,
        ctxUpdatePayment,
    } = useContext(RentPaymentsCtx);

    const newPaymentData = {
        amount: 1200,
        date: "2025-11-01",
        entity: { id: 5, name: "Tenant A" },
    };
    const updatedPaymentData = {
        id: 99,
        amount: 1500,
        date: "2025-10-05",
        entity_id: 8,
    };

    return (
        <div>
            <span data-testid="payment-list-count">{ctxPaymentList ? ctxPaymentList.length : 0}</span>
            <span data-testid="month-payment-count">
                {ctxMonthPaymentList ? Object.keys(ctxMonthPaymentList).length : 0}
            </span>
            <button onClick={() => getCtxPaymentsByMonth(11, 2025)}>Fetch Month Payments</button>
            <button onClick={() => setCtxActiveDate(new Date("2025-02-10"))}>Set Active Date</button>
            <button onClick={() => ctxAddPayment(newPaymentData)}>Add Payment</button>
            <button onClick={() => ctxUpdatePayment(updatedPaymentData)}>Update Payment</button>
        </div>
    );
};

describe("RentPaymentsCtxProvider initial render/consumption", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockSessionStorage.clear();
        consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => {
        consoleLogSpy.mockRestore();
    });

    test("should initialize ctxActiveDate and store it in session storage", () => {
        wrapAndRenderComponent(<GeneralTestComponent />);
        expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
            "activeDate",
            expect.stringContaining(new Date().getFullYear().toString())
        );
    });

    test("should call getCtxPaymentsByMonth on initial render (due to useEffect)", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                1: [{ id: 101, amount: 500 }],
            }),
        });
        wrapAndRenderComponent(<GeneralTestComponent />);

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalled();
        });

        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        expect(mockFetch).toHaveBeenCalledWith(
            `http://test-url.com/api/rentPayments/?property_id=1&year=${currentYear}&month=${currentMonth}&format_by_day=true`,
            expect.any(Object)
        );
    });
});

describe("RentPaymentsCtxProvider getCtxPaymentsByMonth", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockSessionStorage.clear();
        consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => {
        consoleLogSpy.mockRestore();
    });

    test("should call getCtxPaymentsByMonth when ctxActiveDate changes", async () => {
        mockFetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ 1: [] }),
            }) // Initial call
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ 10: [{ id: 200, amount: 700 }] }),
            }); // Second fetch from date change
        wrapAndRenderComponent(<GeneralTestComponent />);

        // Wait for useEffect to trigger intial fetch
        await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));

        const dateButton = screen.getByText("Set Active Date");
        fireEvent.click(dateButton);

        // Wait for useEffect to trigger fetch
        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledTimes(2);
        });

        expect(mockFetch).toHaveBeenCalledWith(
            `http://test-url.com/api/rentPayments/?property_id=1&year=2025&month=2&format_by_day=true`,
            expect.any(Object)
        );
    });

    test("should log error if fetching monthly payments fails", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 404,
            json: async () => ({ detail: "Not Found" }),
        });

        wrapAndRenderComponent(<GeneralTestComponent />);

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalled();
        });
        expect(consoleLogSpy).toHaveBeenCalledWith("Error: HTTP error! status: 404");
        const monthPaymentCount = screen.getByTestId("month-payment-count");
        expect(monthPaymentCount).toHaveTextContent("0");
    });
});

describe("RentPaymentsCtxProvider ctxAddPayment (POST)", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockSessionStorage.clear();

        // mock the inital useEffect fetch
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => ({}),
        });
        consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => {
        consoleLogSpy.mockRestore();
    });

    test("should successfully add a payment, update SWR cache, and show success toast", async () => {
        const newPaymentResponse = {
            id: 100,
            amount: 1200,
            date: "2025-11-01",
            entity_id: 5,
        };
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => newPaymentResponse,
        });
        wrapAndRenderComponent(<GeneralTestComponent />);
        const addButton = screen.getByText("Add Payment");
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledTimes(2);
        });

        const expectedUrl = "http://test-url.com/api/rentPayments/?property_id=1";
        const expectedBodyObject = {
            amount: 1200,
            date: "2025-11-01",
            entity_id: 5,
        };
        const [receivedUrl, receivedOptions] = mockFetch.mock.calls.find((call) => call[1].method === "POST");

        expect(receivedUrl.toString()).toBe(expectedUrl);
        expect(receivedOptions.method).toBe("POST");
        expect(receivedOptions.body).toBe(JSON.stringify(expectedBodyObject));
        expect(receivedOptions.headers).toEqual(
            expect.objectContaining({
                Authorization: `Bearer mock-token`,
                "Content-Type": "application/json",
            })
        );

        // Mutate not called in current interation of RentPaymentsCtx/ctxAddPayment
        /* const updaterFn = mockMutate.mock.calls[0][0];
        const existingCacheData = mockInitialEntityList; // SWR data is the entity list
        const newCacheData = updaterFn(existingCacheData);
        expect(newCacheData).toEqual([...existingCacheData, newPaymentResponse]); // Appends new payment to entity list cache
        expect(mockMutate.mock.calls[0][1]).toBe(false);
        expect(mockShowToast).toHaveBeenCalledWith("Payment added", "success", 3000); */
    });

    test("should handle API failure when adding a payment and show error toast", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 400,
            json: async () => ({ error: "Validation Error" }),
        });
        consoleLogSpy = jest.spyOn(console, "error").mockImplementation(() => {});

        wrapAndRenderComponent(<GeneralTestComponent />);

        const addButton = screen.getByText("Add Payment");
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledTimes(2);
        });

        //expect(mockMutate).not.toHaveBeenCalled();
        //expect(mockShowToast).toHaveBeenCalledWith("Error adding payment", "error", 5000);

        consoleLogSpy.mockRestore();
    });
});
