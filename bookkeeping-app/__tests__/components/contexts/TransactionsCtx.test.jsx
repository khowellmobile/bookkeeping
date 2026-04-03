import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useContext } from "react";
import useSWRImmutable from "swr/immutable";

import { TransactionsCtxProvider } from "@/src/contexts/TransactionsCtx";
import TransactionsCtx from "@/src/contexts/TransactionsCtx";
import EntitiesCtx from "@/src/contexts/EntitiesCtx";
import AccountsCtx from "@/src/contexts/AccountsCtx";
import PropertiesCtx from "@/src/contexts/PropertiesCtx";
import AuthCtx from "@/src/contexts/AuthCtx";
import { useTransactions } from "@/src/hooks/useTransactions";
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
const mockRefetchAccounts = jest.fn();

const wrap = (component) =>
    render(
        <AuthCtx.Provider value={{ ctxAccessToken: "mock-token" }}>
            <PropertiesCtx.Provider value={{ ctxActiveProperty: { id: 1 } }}>
                <EntitiesCtx.Provider value={{ ctxActiveEntity: { id: 20 } }}>
                    <AccountsCtx.Provider value={{ ctxActiveAccount: { id: 30 }, ctxRefetchAccounts: mockRefetchAccounts }}>
                        <TransactionsCtxProvider>{component}</TransactionsCtxProvider>
                    </AccountsCtx.Provider>
                </EntitiesCtx.Provider>
            </PropertiesCtx.Provider>
        </AuthCtx.Provider>
    );

const TestComponent = () => {
    const { ctxFilterBy, setCtxFilterBy } = useContext(TransactionsCtx);
    const {
        tranList,
        filteredTransactions,
        searchTerm,
        setSearchTerm,
        handleChange,
        addTransactions,
        updateTransaction,
    } = useTransactions();

    return (
        <div>
            <span data-testid="filter">{ctxFilterBy || "unset"}</span>
            <span data-testid="tran-count">{tranList?.length || 0}</span>
            <span data-testid="filtered-count">{filteredTransactions.length}</span>
            <span data-testid="search-term">{searchTerm}</span>
            <button onClick={() => setCtxFilterBy("entity")}>Filter Entity</button>
            <button onClick={() => setCtxFilterBy("account")}>Filter Account</button>
            <button onClick={() => setSearchTerm("rent")}>Search Rent</button>
            <button
                onClick={() =>
                    handleChange(0, {
                        date: "2026-01-01",
                        entity: { id: 20, name: "Tenant" },
                        account: { id: 30, name: "Checking" },
                        memo: "rent",
                        amount: "10",
                        type: "debit",
                    })
                }
            >
                Seed Add
            </button>
            <button onClick={() => addTransactions()}>Add</button>
            <button
                onClick={() =>
                    updateTransaction({
                        id: 1,
                        date: "2026-01-01",
                        entity: { id: 20, name: "Tenant" },
                        account: { id: 30, name: "Checking" },
                        memo: "u",
                        amount: "20",
                        type: "credit",
                    })
                }
            >
                Update
            </button>
        </div>
    );
};

describe("TransactionsCtx", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useSWRImmutable.mockImplementation(() => ({
            data: [
                {
                    id: 1,
                    memo: null,
                    account: { name: "Checking" },
                    entity: { name: "Tenant" },
                },
                {
                    id: 2,
                    memo: "rent",
                    account: { name: "Reserve" },
                    entity: null,
                },
            ],
            mutate: mockMutate,
        }));
    });

    test("changes SWR key when filter changes", () => {
        wrap(<TestComponent />);
        expect(useSWRImmutable).toHaveBeenCalledWith(undefined, expect.any(Function));

        fireEvent.click(screen.getByText("Filter Entity"));
        expect(screen.getByTestId("filter").textContent).toBe("entity");
        expect(useSWRImmutable).toHaveBeenLastCalledWith(["/api/transactions/", 1, "entity", 20], expect.any(Function));

        fireEvent.click(screen.getByText("Filter Account"));
        expect(screen.getByTestId("filter").textContent).toBe("account");
        expect(useSWRImmutable).toHaveBeenLastCalledWith(["/api/transactions/", 1, "account", 30], expect.any(Function));
    });

    test("keeps transactions searchable with null fields", () => {
        wrap(<TestComponent />);

        expect(screen.getByTestId("tran-count").textContent).toBe("2");
        expect(screen.getByTestId("filtered-count").textContent).toBe("2");

        fireEvent.click(screen.getByText("Search Rent"));

        expect(screen.getByTestId("search-term").textContent).toBe("rent");
        expect(screen.getByTestId("filtered-count").textContent).toBe("1");
    });

    test("adds transactions and refetches accounts", async () => {
        api.post.mockResolvedValueOnce([{ id: 2, memo: "new" }]);
        wrap(<TestComponent />);

        fireEvent.click(screen.getByText("Seed Add"));
        fireEvent.click(screen.getByText("Add"));

        await waitFor(() =>
            expect(api.post).toHaveBeenCalledWith(
                "/api/transactions/",
                [
                    {
                        date: "2026-01-01",
                        memo: "rent",
                        amount: "10",
                        type: "debit",
                        entity_id: 20,
                        account_id: 30,
                    },
                ],
                {
                    query: { property_id: 1 },
                },
            ),
        );

        expect(mockRefetchAccounts).toHaveBeenCalled();
        expect(mockShowToast).toHaveBeenCalledWith("Transactions added", "success", 3000);
    });

    test("updates transaction and handles api errors", async () => {
        api.put.mockResolvedValueOnce({ id: 1, memo: "u" }).mockRejectedValueOnce(new ApiError({ status: 400, message: "bad" }));
        wrap(<TestComponent />);

        fireEvent.click(screen.getByText("Update"));
        await waitFor(() => expect(api.put).toHaveBeenCalledWith("/api/transactions/1/", {
            id: 1,
            date: "2026-01-01",
            memo: "u",
            amount: "20",
            type: "credit",
            entity_id: 20,
            account_id: 30,
        }));
        expect(mockShowToast).toHaveBeenCalledWith("Transaction updated", "success", 3000);

        fireEvent.click(screen.getByText("Update"));
        await waitFor(() => expect(mockShowToast).toHaveBeenCalledWith("Error updating transaction", "error", 5000));
    });
});

