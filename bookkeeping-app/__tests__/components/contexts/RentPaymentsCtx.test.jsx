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
import useSWRImmutable from "swr/immutable";

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
const defaultSWRData = { id: 1, amount: 100, date: "2025-01-01", entity: { id: 200, name: "Tenant 200" } };

// Configure the SWR mock to return initial data
useSWRImmutable.mockImplementation(() => ({
    data: [defaultSWRData],
    error: undefined,
    mutate: mockMutate,
}));

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
    const { ctxMonthPaymentList, setCtxActiveDate, ctxAddPayment, ctxUpdatePayment } = useContext(RentPaymentsCtx);
    const newPaymentData = {
        amount: 1200,
        date: "2025-11-01",
        entity: { id: 5, name: "Tenant A" },
    };
    const updatedPaymentData = {
        id: 1,
        amount: 2000,
        date: "2025-10-05",
        entity_id: 8,
    };

    return (
        <div>
            <span data-testid="month-payment-count">
                {ctxMonthPaymentList ? ctxMonthPaymentList.length : 0}
            </span>
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
        useSWRImmutable.mockImplementation(() => ({
            data: [defaultSWRData],
            error: undefined,
            mutate: mockMutate,
        }));
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

    test("should fetch monthPaymentList and store it in SWR variable", () => {
        wrapAndRenderComponent(<GeneralTestComponent />);
        const paymentListCount = screen.getByTestId("month-payment-count");
        expect(paymentListCount).toHaveTextContent("1");
    });
});

describe("RentPaymentsCtxProvider ctxAddPayment", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockSessionStorage.clear();
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
            expect(mockFetch).toHaveBeenCalled();
        });

        const expectedUrl = "http://test-url.com/api/rentPayments/?property_id=1";
        const expectedBodyObject = {
            amount: 1200,
            date: "2025-11-01",
            entity_id: 5,
        };
        const expectedOptions = {
            method: "POST",
            body: JSON.stringify(expectedBodyObject),
            headers: {
                Authorization: `Bearer mock-token`,
                "Content-Type": "application/json",
            },
        };

        expect(mockFetch).toHaveBeenCalledTimes(1);
        const [receivedUrl, receivedOptions] = mockFetch.mock.calls[0];
        expect(receivedUrl.toString()).toBe(expectedUrl);
        expect(receivedOptions.method).toBe(expectedOptions.method);
        expect(receivedOptions.body).toBe(expectedOptions.body);
        expect(receivedOptions.headers).toEqual(expect.objectContaining(expectedOptions.headers));

        // Ensuring mutate is called properly with correct data
        const updaterFn = mockMutate.mock.calls[0][0];
        const existingCacheData = [defaultSWRData];
        const newCacheData = updaterFn(existingCacheData);
        expect(newCacheData).toEqual([defaultSWRData, newPaymentResponse]);
        expect(mockMutate.mock.calls[0][1]).toBe(false);

        expect(mockMutate).toHaveBeenCalledTimes(1);
        expect(mockShowToast).toHaveBeenCalledWith("Payment added", "success", 3000);
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
            expect(mockFetch).toHaveBeenCalledTimes(1);
        });

        expect(mockMutate).not.toHaveBeenCalled();
        expect(mockShowToast).toHaveBeenCalledWith("Error adding payment", "error", 5000);

        consoleLogSpy.mockRestore();
    });
});

describe("RentPaymentsCtxProvider ctxUpdatePayment", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useSWRImmutable.mockImplementation(() => ({
            data: [defaultSWRData],
            error: undefined,
            mutate: mockMutate,
        }));
        consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    test("should successfully update a rent item, update SWR cache, and show success toast", async () => {
        const updatedRentData = { id: 1, amount: 2000, date: "2025-10-05", entity_id: 8 };
        const updatedRentResponse = { id: 1, amount: 2000, date: "2025-10-05", entity: { id: 8, name: "Tenant 8" } };
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => updatedRentResponse,
        });

        wrapAndRenderComponent(<GeneralTestComponent />);

        const updateButton = screen.getByText("Update Payment");
        fireEvent.click(updateButton);

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalled();
        });

        // Define the expected request details
        const expectedUrl = "http://test-url.com/api/rentPayments/1/";
        const expectedBodyObject = updatedRentData;
        const expectedOptions = {
            method: "PUT",
            body: JSON.stringify(expectedBodyObject),
            headers: {
                Authorization: `Bearer mock-token`,
                "Content-Type": "application/json",
            },
        };

        expect(mockFetch).toHaveBeenCalledTimes(1);
        const [receivedUrl, receivedOptions] = mockFetch.mock.calls[0];
        expect(receivedUrl.toString()).toBe(expectedUrl);
        expect(receivedOptions.method).toBe(expectedOptions.method);
        expect(receivedOptions.body).toBe(expectedOptions.body);
        expect(receivedOptions.headers).toEqual(expect.objectContaining(expectedOptions.headers));

        // Ensuring mutate is called properly with correct data
        const updaterFn = mockMutate.mock.calls[0][0];
        const existingCacheData = [defaultSWRData];
        const newCacheData = updaterFn(existingCacheData);
        expect(newCacheData).toEqual([
            { id: 1, amount: 2000, date: "2025-10-05", entity: { id: 8, name: "Tenant 8" } },
        ]);
        expect(mockMutate.mock.calls[0][1]).toBe(false);

        expect(mockMutate).toHaveBeenCalledTimes(1);
        expect(mockShowToast).toHaveBeenCalledWith("Payment updated", "success", 3000);
    });

    test("should handle API failure when updating an account and show error toast", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: "Server Error" }),
        });

        wrapAndRenderComponent(<GeneralTestComponent />);

        const updateButton = screen.getByText("Update Payment");
        fireEvent.click(updateButton);

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalled();
        });

        expect(mockMutate).not.toHaveBeenCalled();
        expect(mockShowToast).toHaveBeenCalledWith("Error updating payment", "error", 5000);
    });
});
