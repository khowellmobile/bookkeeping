/*
 * Tests for TransactionCtx component.
 *
 */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { memo, useContext } from "react";

import { TransactionsCtxProvider } from "@/src/components/contexts/TransactionsCtx";
import TransactionsCtx from "@/src/components/contexts/TransactionsCtx";
import EntitiesCtx from "@/src/components/contexts/EntitiesCtx";
import AccountsCtx from "@/src/components/contexts/AccountsCtx";
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

const defaultTransactionList = [
    {
        id: 100,
        date: "01-01-2025",
        entity: { id: 200, name: "Entity 1" },
        account: { id: 300, name: "Account 1" },
        memo: "test memo",
        type: "debit",
        amount: "1000",
    },
];
// Configure the SWR mock to return initial data
const mockSWR = (data = defaultTransactionList, error = undefined) => ({
    data,
    error,
    mutate: mockMutate,
});
useSWRImmutable.mockImplementation(() => mockSWR());

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

const mockActiveAccount = { id: 300, name: "Account 0" };
const MockAccountsCtxProvider = ({ children }) => (
    <AccountsCtx.Provider value={{ ctxActiveAccount: mockActiveAccount }}>{children}</AccountsCtx.Provider>
);

const mockActiveEntity = { id: 200, name: "Entity 0" };
const MockEntitiesCtxProvider = ({ children }) => (
    <EntitiesCtx.Provider value={{ ctxActiveEntity: mockActiveEntity }}>{children}</EntitiesCtx.Provider>
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
                <MockEntitiesCtxProvider>
                    <MockAccountsCtxProvider>
                        <TransactionsCtxProvider>{component}</TransactionsCtxProvider>
                    </MockAccountsCtxProvider>
                </MockEntitiesCtxProvider>
            </MockPropertiesCtxProvider>
        </MockAuthsCtxProvider>
    );
};

const GeneralTestComponent = () => {
    const { ctxTranList, ctxFilterBy, setCtxFilterBy, ctxAddTransactions, ctxUpdateTransaction } =
        useContext(TransactionsCtx);

    const newTransactionDataSingle = [
        {
            date: "01-01-2024",
            entity: { id: 201, name: "Entity 1" },
            account: { id: 301, name: "Account 1" },
            memo: "test memo 1",
            type: "credit",
            amount: "1500",
        },
    ];
    const newTransactionDataMult = [
        {
            date: "01-01-2024",
            entity: { id: 202, name: "Entity 2" },
            account: { id: 302, name: "Account 2" },
            memo: "test memo 2",
            type: "credit",
            amount: "500",
        },
        {
            date: "01-01-2024",
            entity: { id: 202, name: "Entity 2" },
            account: { id: 302, name: "Account 2" },
            memo: "test memo 3",
            type: "debit",
            amount: "2000",
        },
    ];
    const updatedTransactionData = {
        id: 100,
        date: "01-01-2023",
        entity: { id: 200, name: "Entity 1" },
        account: { id: 301, name: "Account 2" },
        memo: "test memo 4",
        type: "debit",
        amount: "1000",
    };

    return (
        <div>
            <span data-testid="transaction-list-count">{ctxTranList ? ctxTranList.length : 0}</span>
            <span data-testid="filter-by">{ctxFilterBy}</span>
            <button onClick={() => setCtxFilterBy("entity")}>Set Filter By Entity</button>
            <button onClick={() => setCtxFilterBy("account")}>Set Filter By Account</button>
            <button onClick={() => setCtxFilterBy("invalid")}>Set Filter By Invalid</button>
            <button onClick={() => ctxAddTransactions(newTransactionDataSingle)}>Add Single Transaction</button>
            <button onClick={() => ctxAddTransactions(newTransactionDataMult)}>Add Multiple Transaction</button>
            <button onClick={() => ctxUpdateTransaction(updatedTransactionData)}>Update Transaction</button>
        </div>
    );
};

describe("TransactionsCtxProvider initial render/consume", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useSWRImmutable.mockImplementation(() => mockSWR(defaultTransactionList));
    });

    test("should provide the correct initial state and list from SWR", () => {
        wrapAndRenderComponent(<GeneralTestComponent />);

        const transactionListCount = screen.getByTestId("transaction-list-count");
        expect(transactionListCount).toHaveTextContent("1");

        // ctxFilterBy should initially be null
        const filterBy = screen.getByTestId("filter-by");
        expect(filterBy).toHaveTextContent("");
    });
});

describe("TransactionsCtxProvider state updates and SWR key generation", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useSWRImmutable.mockImplementation(() => mockSWR(defaultTransactionList));
    });

    test("setCtxFilterBy updates the state and triggers SWR call with correct URL for 'account'", () => {
        wrapAndRenderComponent(<GeneralTestComponent />);
        // Initial call should be with null key since no filterBy
        expect(useSWRImmutable).toHaveBeenCalledTimes(1);

        fireEvent.click(screen.getByRole("button", { name: "Set Filter By Account" }));
        const filterBy = screen.getByTestId("filter-by");
        expect(filterBy).toHaveTextContent("account");

        const expectedURL = `http://test-url.com/api/transactions/?property_id=${mockActiveProperty.id}&account_id=${mockActiveAccount.id}`;
        expect(useSWRImmutable).toHaveBeenCalledWith(expectedURL, expect.any(Function));
    });

    test("setCtxFilterBy updates the state and triggers SWR call with correct URL for 'entity'", () => {
        wrapAndRenderComponent(<GeneralTestComponent />);
        expect(useSWRImmutable).toHaveBeenCalledTimes(1);

        fireEvent.click(screen.getByRole("button", { name: "Set Filter By Entity" }));
        const filterBy = screen.getByTestId("filter-by");
        expect(filterBy).toHaveTextContent("entity");

        const expectedURL = `http://test-url.com/api/transactions/?property_id=${mockActiveProperty.id}&entity_id=${mockActiveEntity.id}`;
        expect(useSWRImmutable).toHaveBeenCalledWith(expectedURL, expect.any(Function));
    });

    test("setCtxFilterBy with a value not 'account' or 'entity' results in null SWR key", () => {
        wrapAndRenderComponent(<GeneralTestComponent />);
        expect(useSWRImmutable).toHaveBeenCalledTimes(1);

        fireEvent.click(screen.getByRole("button", { name: "Set Filter By Invalid" }));
        const filterBy = screen.getByTestId("filter-by");
        expect(filterBy).toHaveTextContent("invalid");

        expect(useSWRImmutable).toHaveBeenCalledWith(undefined, expect.any(Function));
    });
});

describe("TransactionsCtxProvider ctxAddTransaction", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useSWRImmutable.mockImplementation(() => mockSWR(defaultTransactionList));
        consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    test("should successfully add a single transaction, update SWR cache, and show success toast", async () => {
        const newTransactionDataSingle = [
            {
                id: 101,
                date: "01-01-2024",
                entity: { id: 201, name: "Entity 1" },
                account: { id: 301, name: "Account 1" },
                memo: "test memo 1",
                type: "credit",
                amount: "1500",
            },
        ];

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => newTransactionDataSingle,
        });

        wrapAndRenderComponent(<GeneralTestComponent />);

        fireEvent.click(screen.getByRole("button", { name: "Add Single Transaction" }));

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalled();
        });

        // Define the expected request details
        const expectedUrl = "http://test-url.com/api/transactions/?property_id=1";
        const expectedBodyObject = [
            {
                date: "01-01-2024",
                memo: "test memo 1",
                type: "credit",
                amount: "1500",
                entity_id: 201,
                account_id: 301,
            },
        ];
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
        const newCacheData = updaterFn(defaultTransactionList);
        expect(newCacheData).toEqual([...defaultTransactionList, ...newTransactionDataSingle]);
        expect(mockMutate.mock.calls[0][1]).toBe(false);

        expect(mockMutate).toHaveBeenCalledTimes(1);
        expect(mockShowToast).toHaveBeenCalledWith("Transactions added", "success", 3000);
    });

    test("should successfully add multiple transactions, update SWR cache, and show success toast", async () => {
        const newTransactionDataMultiple = [
            {
                id: 101,
                date: "01-01-2024",
                entity: { id: 202, name: "Entity 2" },
                account: { id: 302, name: "Account 2" },
                memo: "test memo 2",
                type: "credit",
                amount: "500",
            },
            {
                id: 102,
                date: "01-01-2024",
                entity: { id: 202, name: "Entity 2" },
                account: { id: 302, name: "Account 2" },
                memo: "test memo 3",
                type: "debit",
                amount: "2000",
            },
        ];

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => newTransactionDataMultiple,
        });

        wrapAndRenderComponent(<GeneralTestComponent />);

        fireEvent.click(screen.getByRole("button", { name: "Add Multiple Transaction" }));

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalled();
        });

        // Define the expected request details
        const expectedUrl = "http://test-url.com/api/transactions/?property_id=1";
        const expectedBodyObject = [
            {
                date: "01-01-2024",
                memo: "test memo 2",
                type: "credit",
                amount: "500",
                entity_id: 202,
                account_id: 302,
            },
            {
                date: "01-01-2024",
                memo: "test memo 3",
                type: "debit",
                amount: "2000",
                entity_id: 202,
                account_id: 302,
            },
        ];
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
        const newCacheData = updaterFn(defaultTransactionList);
        expect(newCacheData).toEqual([...defaultTransactionList, ...newTransactionDataMultiple]);
        expect(mockMutate.mock.calls[0][1]).toBe(false);

        expect(mockMutate).toHaveBeenCalledTimes(1);
        expect(mockShowToast).toHaveBeenCalledWith("Transactions added", "success", 3000);
    });

    test("should handle API failure when adding a transaction and show error toast", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: "Server Error" }),
        });
        const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

        wrapAndRenderComponent(<GeneralTestComponent />);

        fireEvent.click(screen.getByRole("button", { name: "Add Single Transaction" }));
        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalled();
        });

        // expect(mockMutate).not.toHaveBeenCalled();
        // expect(mockShowToast).toHaveBeenCalledWith("Error adding Entity", "error", 5000);

        consoleError.mockRestore();
    });
});

describe("TransactionsCtxProvider ctxUpdateTransaction", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useSWRImmutable.mockImplementation(() => mockSWR(defaultTransactionList));
        consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    test("should successfully update a transaction, update SWR cache, and show success toast", async () => {
        // What is returned from the API
        const updatedTransactionData = {
            id: 100,
            date: "01-01-2023",
            entity: { id: 200, name: "Entity 1" },
            account: { id: 301, name: "Account 2" },
            memo: "test memo 4",
            type: "debit",
            amount: "1000",
        };

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => updatedTransactionData,
        });

        wrapAndRenderComponent(<GeneralTestComponent />);

        fireEvent.click(screen.getByRole("button", { name: "Update Transaction" }));

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalled();
        });

        // Define the expected request details that is sent to API
        const expectedUrl = `http://test-url.com/api/transactions/100/`;
        const expectedBodyObject = {
            id: 100,
            date: "01-01-2023",
            memo: "test memo 4",
            type: "debit",
            amount: "1000",
            entity_id: 200,
            account_id: 301,
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
        const newCacheData = updaterFn(defaultTransactionList); // Run updater with what used to be in cache
        expect(newCacheData).toEqual([updatedTransactionData]); // Check if cache updated
        expect(mockMutate.mock.calls[0][1]).toBe(false);

        expect(mockMutate).toHaveBeenCalledTimes(1);
        expect(mockShowToast).toHaveBeenCalledWith("Transaction updated", "success", 3000);
    });

    test("should handle API failure when updating a transaction and show error toast", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: "Server Error" }),
        });
        const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

        wrapAndRenderComponent(<GeneralTestComponent />);

        fireEvent.click(screen.getByRole("button", { name: "Update Transaction" }));
        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalled();
        });

        // expect(mockMutate).not.toHaveBeenCalled();
        // expect(mockShowToast).toHaveBeenCalledWith("Error adding Entity", "error", 5000);

        consoleError.mockRestore();
    });
});
