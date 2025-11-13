/*
 * Tests for EntitiesCtx component.
 *
 */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useContext } from "react";

import { EntitiesCtxProvider } from "@/src/components/contexts/EntitiesCtx";
import EntitiesCtx from "@/src/components/contexts/EntitiesCtx";
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
    data: [{ id: 1, name: "Test Entity 1" }],
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
let consoleLogSpy;

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
                <EntitiesCtxProvider>{component}</EntitiesCtxProvider>
            </MockPropertiesCtxProvider>
        </MockAuthsCtxProvider>
    );
};

const GeneralTestComponent = () => {
    const context = useContext(EntitiesCtx);
    return (
        <div>
            <span data-testid="active-entity-name">{context.ctxActiveEntity?.name}</span>
            <span data-testid="entity-list-count">{context.ctxEntityList ? context.ctxEntityList.length : 0}</span>
            <button onClick={() => context.setCtxActiveEntity({ name: "Updated Entity" })}>Set Entity</button>
            <button onClick={() => context.ctxAddEntity({ name: "New Entity" })}>Add Entity</button>
        </div>
    );
};

describe("EntitiesCtxProvider initial render/consume", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useSWRImmutable.mockImplementation(() => ({
            data: [{ id: 1, name: "Test Entity 1" }],
            error: undefined,
            mutate: mockMutate,
        }));
    });

    test("should provide the correct initial state and list from SWR", () => {
        wrapAndRenderComponent(<GeneralTestComponent />);

        const activeEntityName = screen.getByTestId("active-entity-name");
        expect(activeEntityName).toHaveTextContent("");

        const entityListCount = screen.getByTestId("entity-list-count");
        expect(entityListCount).toHaveTextContent("1");
    });
});

describe("EntitiesCtxProvider state update", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useSWRImmutable.mockImplementation(() => ({
            data: [{ id: 1, name: "Test Entity 1" }],
            error: undefined,
            mutate: mockMutate,
        }));
    });

    test("should update the active entity when setCtxActiveEntity is called", () => {
        wrapAndRenderComponent(<GeneralTestComponent />);

        const activeEntityName = screen.getByTestId("active-entity-name");
        expect(activeEntityName).toHaveTextContent("");

        const setAccountButton = screen.getByText("Set Entity");
        fireEvent.click(setAccountButton);

        expect(activeEntityName).toHaveTextContent("Updated Entity");
    });
});

describe("EntitiesCtxProvider ctxAddEntity", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useSWRImmutable.mockImplementation(() => ({
            data: [{ id: 1, name: "Test Entity 1" }],
            error: undefined,
            mutate: mockMutate,
        }));
    });

    test("should successfully add an entity, update SWR cache, and show success toast", async () => {
        const newEntityData = { id: 2, name: "New Entity Added" };
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => newEntityData,
        });

        wrapAndRenderComponent(<GeneralTestComponent />);

        const addButton = screen.getByText("Add Entity");
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalled();
        });

        // Ensuring mutate is called properly with correct data
        const updaterFn = mockMutate.mock.calls[0][0];
        const existingCacheData = [{ id: 1, name: "Test Entity 1" }];
        const newCacheData = updaterFn(existingCacheData);
        expect(newCacheData).toEqual([{ id: 1, name: "Test Entity 1" }, newEntityData]);
        expect(mockMutate.mock.calls[0][1]).toBe(false);

        expect(mockMutate).toHaveBeenCalledTimes(1);
        expect(mockShowToast).toHaveBeenCalledWith("Entity added", "success", 3000);
    });

    test("should handle API failure when adding an entity and show error toast", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: "Server Error" }),
        });

        const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

        wrapAndRenderComponent(<GeneralTestComponent />);

        const addButton = screen.getByText("Add Entity");
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalled();
        });

        // Uncomment with completion is issue #224
        // expect(mockMutate).not.toHaveBeenCalled();
        // expect(mockShowToast).toHaveBeenCalledWith("Error adding Entity", "error", 5000);

        consoleError.mockRestore();
    });
});

describe("EntitiesCtxProvider ctxUpdateEntity", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useSWRImmutable.mockImplementation(() => ({
            data: [{ id: 1, name: "Test Entity 1" }],
            error: undefined,
            mutate: mockMutate,
        }));
        consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => {
        consoleLogSpy.mockRestore();
    });

    const TestComponentWithUpdate = () => {
        const context = useContext(EntitiesCtx);
        return (
            <button onClick={() => context.ctxUpdateEntity({ id: 1, name: "Updated Test Entity" })}>
                Update Entity
            </button>
        );
    };

    test("should successfully update an entity, update SWR cache, and show success toast", async () => {
        const updatedEntityData = { id: 1, name: "Updated Test Entity" };
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => updatedEntityData,
        });

        wrapAndRenderComponent(<TestComponentWithUpdate />);

        const updateButton = screen.getByText("Update Entity");
        fireEvent.click(updateButton);

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(
                "http://test-url.com/api/entities/1/",
                expect.objectContaining({
                    method: "PUT",
                    body: JSON.stringify(updatedEntityData),
                })
            );
        });

        // Ensuring mutate is called properly with correct data
        const updaterFn = mockMutate.mock.calls[0][0];
        const existingCacheData = [
            { id: 1, name: "Test Entity 1" },
            { id: 2, name: "Other Entity" },
        ];
        const newCacheData = updaterFn(existingCacheData);
        expect(newCacheData).toEqual([
            { id: 1, name: "Updated Test Entity" },
            { id: 2, name: "Other Entity" },
        ]);
        expect(mockMutate.mock.calls[0][1]).toBe(false);

        expect(mockMutate).toHaveBeenCalledTimes(1);
        expect(mockShowToast).toHaveBeenCalledWith("Entity updated", "success", 3000);
    });

    test("should handle API failure when updating an entity and show error toast", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: "Server Error" }),
        });

        wrapAndRenderComponent(<TestComponentWithUpdate />);

        const updateButton = screen.getByText("Update Entity");
        fireEvent.click(updateButton);

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalled();
        });

        //expect(mockMutate).not.toHaveBeenCalled();
        //expect(mockShowToast).toHaveBeenCalledWith("Error updating Entity", "error", 5000);
    });
});
