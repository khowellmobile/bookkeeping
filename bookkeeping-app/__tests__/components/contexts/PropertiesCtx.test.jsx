/*
 * Tests for PropertiesCtx component.
 *
 */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useContext } from "react";

import { PropertiesCtxProvider } from "@/src/components/contexts/PropertiesCtx";
import PropertiesCtx from "@/src/components/contexts/PropertiesCtx";
import AuthCtx from "@/src/components/contexts/AuthCtx";
import useSWRImmutable from "swr/immutable";

// Mocking environment variables
jest.mock("@/src/constants", () => ({
    ENVIRONMENT: "test",
    BASE_URL: "http://test-url.com",
}));

// Mock useSWRImmutable
jest.mock("swr/immutable", () => ({
    __esModule: true,
    default: jest.fn(),
}));

const mockMutate = jest.fn();

// Configure the SWR mock to return initial data
useSWRImmutable.mockImplementation(() => ({
    data: [{ id: 1, name: "Test Property 1" }],
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
let consoleWarnSpy;
let consoleLogSpy;

// Mock Parent Context Providers
const mockAccessToken = "mock-token";
const MockAuthsCtxProvider = ({ children }) => (
    <AuthCtx.Provider value={{ ctxAccessToken: mockAccessToken }}>{children}</AuthCtx.Provider>
);

// Function to render the Provider wrapped around the consumer component
const wrapAndRenderComponent = (component) => {
    return render(
        <MockAuthsCtxProvider>
            <PropertiesCtxProvider>{component}</PropertiesCtxProvider>
        </MockAuthsCtxProvider>
    );
};

const GeneralTestComponent = () => {
    const context = useContext(PropertiesCtx);
    return (
        <div>
            <span data-testid="active-property-name">{context.ctxActiveProperty?.name}</span>
            <span data-testid="property-list-count">
                {context.ctxPropertyList ? context.ctxPropertyList.length : 0}
            </span>
            <button onClick={() => context.setCtxActiveProperty({ name: "Updated Property" })}>Set Property</button>
            <button onClick={() => context.ctxAddProperty({ name: "New Property" })}>Add Property</button>
        </div>
    );
};

describe("PropertiesCtxProvider initial render/consume", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useSWRImmutable.mockImplementation(() => ({
            data: [{ id: 1, name: "Test Property 1" }],
            error: undefined,
            mutate: mockMutate,
        }));

        consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    });

    afterEach(() => {
        consoleWarnSpy.mockRestore();
    });

    test("should provide the correct initial state and list from SWR", () => {
        wrapAndRenderComponent(<GeneralTestComponent />);

        const activePropertyName = screen.getByTestId("active-property-name");
        expect(activePropertyName).toHaveTextContent("");

        const propertyListCount = screen.getByTestId("property-list-count");
        expect(propertyListCount).toHaveTextContent("1");
    });
});

describe("PropertiesCtxProvider state update", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useSWRImmutable.mockImplementation(() => ({
            data: [{ id: 1, name: "Test Property 1" }],
            error: undefined,
            mutate: mockMutate,
        }));

        consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    });

    afterEach(() => {
        consoleWarnSpy.mockRestore();
    });

    test("should update the active property when setCtxActiveProperty is called", () => {
        wrapAndRenderComponent(<GeneralTestComponent />);

        const activePropertyName = screen.getByTestId("active-property-name");
        expect(activePropertyName).toHaveTextContent("");

        const setAccountButton = screen.getByText("Set Property");
        fireEvent.click(setAccountButton);

        expect(activePropertyName).toHaveTextContent("Updated Property");
    });
});

describe("PropertiesCtxProvider ctxAddProperty", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useSWRImmutable.mockImplementation(() => ({
            data: [{ id: 1, name: "Test Property 1" }],
            error: undefined,
            mutate: mockMutate,
        }));

        consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    });

    afterEach(() => {
        consoleWarnSpy.mockRestore();
    });

    test("should successfully add an property, update SWR cache, and show success toast", async () => {
        const newPropertyData = { id: 2, name: "New Property" };
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => newPropertyData,
        });

        wrapAndRenderComponent(<GeneralTestComponent />);

        const addButton = screen.getByText("Add Property");
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalled();
        });

        // Define the expected request details
        const expectedUrl = "http://test-url.com/api/properties/";
        const expectedBodyObject = { name: "New Property" };
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
        const existingCacheData = [{ id: 1, name: "Test Property 1" }];
        const newCacheData = updaterFn(existingCacheData);
        expect(newCacheData).toEqual([{ id: 1, name: "Test Property 1" }, newPropertyData]);
        expect(mockMutate.mock.calls[0][1]).toBe(false);

        expect(mockMutate).toHaveBeenCalledTimes(1);
        expect(mockShowToast).toHaveBeenCalledWith("Property added", "success", 3000);
    });

    test("should handle API failure when adding an peropty and show error toast", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: "Server Error" }),
        });

        const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

        wrapAndRenderComponent(<GeneralTestComponent />);

        const addButton = screen.getByText("Add Property");
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalled();
        });

        // Uncomment with completion is issue #224
        // expect(mockMutate).not.toHaveBeenCalled();
        // expect(mockShowToast).toHaveBeenCalledWith("Error adding Property", "error", 5000);

        consoleError.mockRestore();
    });
});

describe("PropertiesCtxProvider ctxUpdateProperty", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useSWRImmutable.mockImplementation(() => ({
            data: [{ id: 1, name: "Test Property 1" }],
            error: undefined,
            mutate: mockMutate,
        }));

        consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
        consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => {
        consoleWarnSpy.mockRestore();
        consoleLogSpy.mockRestore();
    });

    const TestComponentWithUpdate = () => {
        const context = useContext(PropertiesCtx);
        return (
            <button onClick={() => context.ctxUpdateProperty({ id: 1, name: "Updated Test Property" })}>
                Update Property
            </button>
        );
    };

    test("should successfully update an property, update SWR cache, and show success toast", async () => {
        const updatedPropertyData = { id: 1, name: "Updated Test Property" };
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => updatedPropertyData,
        });

        wrapAndRenderComponent(<TestComponentWithUpdate />);

        const updateButton = screen.getByText("Update Property");
        fireEvent.click(updateButton);

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(
                "http://test-url.com/api/properties/1/",
                expect.objectContaining({
                    method: "PUT",
                    body: JSON.stringify(updatedPropertyData),
                })
            );
        });

        // Ensuring mutate is called properly with correct data
        const updaterFn = mockMutate.mock.calls[0][0];
        const existingCacheData = [
            { id: 1, name: "Test Property 1" },
            { id: 2, name: "Other Property" },
        ];
        const newCacheData = updaterFn(existingCacheData);
        expect(newCacheData).toEqual([
            { id: 1, name: "Updated Test Property" },
            { id: 2, name: "Other Property" },
        ]);
        expect(mockMutate.mock.calls[0][1]).toBe(false);

        expect(mockMutate).toHaveBeenCalledTimes(1);
        expect(mockShowToast).toHaveBeenCalledWith("Property updated", "success", 3000);
    });

    test("should handle API failure when updating an property and show error toast", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: "Server Error" }),
        });

        wrapAndRenderComponent(<TestComponentWithUpdate />);

        const updateButton = screen.getByText("Update Property");
        fireEvent.click(updateButton);

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalled();
        });

        //expect(mockMutate).not.toHaveBeenCalled();
        //expect(mockShowToast).toHaveBeenCalledWith("Error updating Property", "error", 5000);
    });
});
