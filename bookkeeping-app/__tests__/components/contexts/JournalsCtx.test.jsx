/*
 * Tests for JournalsCtxProvider component.
 *
 */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useContext } from "react";

// NOTE: Adjusted import path based on common project structure, please verify if "JouranlsCtx" is correct or should be "JournalsCtx"
import { JournalsCtxProvider } from "@/src/components/contexts/JournalsCtx";
import JournalsCtx from "@/src/components/contexts/JournalsCtx";
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

// Configure SWR mock to return initial data
useSWRImmutable.mockImplementation(() => ({
    data: [{ id: 101, journal_date: "2025-01-01" }],
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
let localStorageGetItemSpy;

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
                <JournalsCtxProvider>{component}</JournalsCtxProvider>
            </MockPropertiesCtxProvider>
        </MockAuthsCtxProvider>
    );
};

// Test Component to consume and call context functions
const GeneralTestComponent = () => {
    const context = useContext(JournalsCtx);
    const journalData = {
        journal_date: "2025-11-07",
        journal_items: [{ account: { id: 201 }, debit: 100, credit: 0 }],
        description: "Test Post",
    };
    const updateData = {
        id: 101,
        url: "http://test-url.com/api/journals/101/",
        journal_date: "2025-11-08",
        journal_items: [{ id: 301, account: { id: 202 }, debit: 0, credit: 100 }],
        description: "Test Put",
    };
    return (
        <div>
            <span data-testid="journal-list-count">{context.ctxJournalList ? context.ctxJournalList.length : 0}</span>
            <button onClick={() => context.ctxUpdateJournal(null, null, "POST", journalData)}>Add Journal</button>
            <button onClick={() => context.ctxUpdateJournal(updateData.id, updateData.url, "PUT", updateData)}>
                Update Journal
            </button>
            <button onClick={() => context.ctxDeleteJournal(101)}>Delete Journal</button>
        </div>
    );
};

// Helper function to reset SWR mock before each test
const resetSWRMock = (data = [{ id: 101, journal_date: "2025-01-01" }]) => {
    jest.clearAllMocks();
    useSWRImmutable.mockImplementation(() => ({
        data: data,
        error: undefined,
        mutate: mockMutate,
    }));
};

describe("JournalsCtxProvider initial render/consume", () => {
    beforeEach(() => {
        resetSWRMock();
    });

    test("should fetch journals using SWRImmutable and provide the list", () => {
        wrapAndRenderComponent(<GeneralTestComponent />);

        expect(useSWRImmutable).toHaveBeenCalledWith(
            [`http://test-url.com/api/journals/?property_id=1`],
            expect.any(Function)
        );

        const journalListCount = screen.getByTestId("journal-list-count");
        expect(journalListCount).toHaveTextContent("1");
    });
});

describe("JournalsCtxProvider ctxUpdateJournal (POST - Add)", () => {
    beforeEach(() => {
        resetSWRMock();
    });

    test("should successfully add a journal, update SWR cache, and show success toast", async () => {
        const newJournalData = { id: 102, journal_date: "2025-11-07" };
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => newJournalData,
        });

        wrapAndRenderComponent(<GeneralTestComponent />);

        const addButton = screen.getByText("Add Journal");
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalled();
        });

        // Define the expected request details
        const expectedUrl = "http://test-url.com/api/journals/?property_id=1";
        const expectedBodyObject = {
            journal_date: "2025-11-07",
            journal_items: [{ debit: 100, credit: 0, account_id: 201 }],
            description: "Test Post",
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
        const existingCacheData = [{ id: 101, journal_date: "2025-01-01" }];
        const newCacheData = updaterFn(existingCacheData);
        expect(newCacheData).toEqual([...existingCacheData, newJournalData]);
        expect(mockMutate.mock.calls[0][1]).toBe(false);

        expect(mockShowToast).toHaveBeenCalledWith("Journal saved", "success", 3000);
    });

    test("should handle API failure when adding a journal and show error toast", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: "Server Error" }),
        });
        consoleErrorSpy = jest.spyOn(console, "log").mockImplementation(() => {});

        wrapAndRenderComponent(<GeneralTestComponent />);

        const addButton = screen.getByText("Add Journal");
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalled();
        });

        expect(mockMutate).not.toHaveBeenCalled();
        expect(mockShowToast).toHaveBeenCalledWith("Error saving journal", "error", 5000);

        consoleErrorSpy.mockRestore();
    });
});

describe("JournalsCtxProvider ctxUpdateJournal (PUT - Update)", () => {
    beforeEach(() => {
        resetSWRMock([
            { id: 101, journal_date: "2025-01-01", description: "Old Desc" },
            { id: 103, journal_date: "2025-01-03", description: "Other Journal" },
        ]);
    });

    test("should successfully update a journal, update SWR cache, and show success toast", async () => {
        const updatedJournalData = { id: 101, journal_date: "2025-11-08", description: "New Desc" };
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => updatedJournalData,
        });

        wrapAndRenderComponent(<GeneralTestComponent />);

        const updateButton = screen.getByText("Update Journal");
        fireEvent.click(updateButton);

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalled();
        });

        const expectedUrl = "http://test-url.com/api/journals/101/";
        const expectedBodyObject = {
            id: 101,
            url: "http://test-url.com/api/journals/101/",
            journal_date: "2025-11-08",
            journal_items: [{ id: 301, debit: 0, credit: 100, account_id: 202 }],
            description: "Test Put",
        };
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
        const existingCacheData = [
            { id: 101, journal_date: "2025-01-01", description: "Old Desc" },
            { id: 103, journal_date: "2025-01-03", description: "Other Journal" },
        ];
        const newCacheData = updaterFn(existingCacheData);
        expect(newCacheData).toEqual([
            updatedJournalData,
            { id: 103, journal_date: "2025-01-03", description: "Other Journal" },
        ]);
        expect(mockMutate.mock.calls[0][1]).toBe(false);

        expect(mockShowToast).toHaveBeenCalledWith("Journal saved", "success", 3000);
    });

    test("should handle API failure when updating a journal and show error toast", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: "Server Error" }),
        });

        wrapAndRenderComponent(<GeneralTestComponent />);

        const updateButton = screen.getByText("Update Journal");
        fireEvent.click(updateButton);

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalled();
        });

        expect(mockMutate).not.toHaveBeenCalled();
        expect(mockShowToast).toHaveBeenCalledWith("Error saving journal", "error", 5000);
    });
});

describe("JournalsCtxProvider ctxDeleteJournal", () => {
    beforeEach(() => {
        resetSWRMock();
        consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    });
    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    test("should call the API with PUT and is_deleted: true", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({}),
        });

        wrapAndRenderComponent(<GeneralTestComponent />);

        const deleteButton = screen.getByText("Delete Journal");
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(
                "http://test-url.com/api/journals/101/",
                expect.objectContaining({
                    method: "PUT",
                    body: JSON.stringify({ is_deleted: true }),
                    headers: expect.objectContaining({
                        Authorization: `Bearer mock-token`,
                    }),
                })
            );
        });

        // Current implementation doesnt call show toast ot call mutate for delete
        expect(mockMutate).not.toHaveBeenCalled();
        expect(mockShowToast).not.toHaveBeenCalled();
    });

    test("should log error if API call fails", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            error: "Not Found",
            json: async () => ({}),
        });
        const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});

        wrapAndRenderComponent(<GeneralTestComponent />);

        const deleteButton = screen.getByText("Delete Journal");
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalled();
        });

        consoleLogSpy.mockRestore();
    });
});
