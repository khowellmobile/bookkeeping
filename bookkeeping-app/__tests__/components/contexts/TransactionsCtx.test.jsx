import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useContext } from "react";
import useSWRImmutable from "swr/immutable";

import { TransactionsCtxProvider } from "@/src/components/contexts/TransactionsCtx";
import TransactionsCtx from "@/src/components/contexts/TransactionsCtx";
import EntitiesCtx from "@/src/components/contexts/EntitiesCtx";
import AccountsCtx from "@/src/components/contexts/AccountsCtx";
import PropertiesCtx from "@/src/components/contexts/PropertiesCtx";
import AuthCtx from "@/src/components/contexts/AuthCtx";
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
jest.mock("@/src/components/contexts/ToastCtx", () => ({
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
    const ctx = useContext(TransactionsCtx);
    return (
        <div>
            <span data-testid="count">{ctx.ctxTranList?.length || 0}</span>
            <button onClick={() => ctx.setCtxFilterBy("entity")}>Filter Entity</button>
            <button onClick={() => ctx.setCtxFilterBy("account")}>Filter Account</button>
            <button
                onClick={() =>
                    ctx.ctxAddTransactions([
                        { date: "2026-01-01", entity: { id: 20 }, account: { id: 30 }, memo: "m", amount: "10", type: "debit" },
                    ])
                }
            >
                Add
            </button>
            <button
                onClick={() =>
                    ctx.ctxUpdateTransaction({
                        id: 1,
                        date: "2026-01-01",
                        entity: { id: 20 },
                        account: { id: 30 },
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
            data: [{ id: 1, memo: "old" }],
            mutate: mockMutate,
        }));
    });

    test("changes SWR key when filter changes", () => {
        wrap(<TestComponent />);
        expect(useSWRImmutable).toHaveBeenCalledWith(undefined, expect.any(Function));

        fireEvent.click(screen.getByText("Filter Entity"));
        expect(useSWRImmutable).toHaveBeenLastCalledWith(["/api/transactions/", 1, "entity", 20], expect.any(Function));

        fireEvent.click(screen.getByText("Filter Account"));
        expect(useSWRImmutable).toHaveBeenLastCalledWith(["/api/transactions/", 1, "account", 30], expect.any(Function));
    });

    test("adds transactions and refetches accounts", async () => {
        api.post.mockResolvedValueOnce([{ id: 2, memo: "new" }]);
        wrap(<TestComponent />);

        fireEvent.click(screen.getByText("Add"));

        await waitFor(() => expect(api.post).toHaveBeenCalledWith("/api/transactions/", [
            {
                date: "2026-01-01",
                memo: "m",
                amount: "10",
                type: "debit",
                entity_id: 20,
                account_id: 30,
            },
        ], {
            query: { property_id: 1 },
        }));

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
