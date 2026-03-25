import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useContext } from "react";
import useSWRImmutable from "swr/immutable";

import { AccountsCtxProvider } from "@/src/contexts/AccountsCtx";
import AccountsCtx from "@/src/contexts/AccountsCtx";
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

const MockAuthProvider = ({ children }) => (
    <AuthCtx.Provider value={{ ctxAccessToken: "mock-token" }}>{children}</AuthCtx.Provider>
);

const MockPropertyProvider = ({ children }) => (
    <PropertiesCtx.Provider value={{ ctxActiveProperty: { id: 1, name: "P1" } }}>{children}</PropertiesCtx.Provider>
);

const renderWithProviders = (component) =>
    render(
        <MockAuthProvider>
            <MockPropertyProvider>
                <AccountsCtxProvider>{component}</AccountsCtxProvider>
            </MockPropertyProvider>
        </MockAuthProvider>
    );

const TestComponent = () => {
    const ctx = useContext(AccountsCtx);
    return (
        <div>
            <span data-testid="count">{ctx.ctxAccountList?.length || 0}</span>
            <button onClick={() => ctx.ctxAddAccount({ name: "New" })}>Add</button>
            <button onClick={() => ctx.ctxUpdateAccount({ id: 1, name: "Updated" })}>Update</button>
            <button onClick={() => ctx.ctxDeleteAccount(1)}>Delete</button>
            <button onClick={() => ctx.ctxGetNonPropertyAccounts()}>Get Non Property</button>
        </div>
    );
};

describe("AccountsCtx", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useSWRImmutable.mockImplementation(() => ({
            data: [{ id: 1, name: "A1" }],
            mutate: mockMutate,
        }));
    });

    test("loads account list through SWR key and client", () => {
        renderWithProviders(<TestComponent />);
        expect(useSWRImmutable).toHaveBeenCalledWith(["/api/accounts/", 1], expect.any(Function));
        expect(screen.getByTestId("count")).toHaveTextContent("1");
    });

    test("adds account and updates cache", async () => {
        api.post.mockResolvedValueOnce({ id: 2, name: "New" });
        renderWithProviders(<TestComponent />);

        fireEvent.click(screen.getByText("Add"));

        await waitFor(() => expect(api.post).toHaveBeenCalledWith("/api/accounts/", { name: "New" }, {
            query: { property_id: 1, add_existing: undefined },
        }));

        const updater = mockMutate.mock.calls[0][0];
        expect(updater([{ id: 1, name: "A1" }])).toEqual([{ id: 1, name: "A1" }, { id: 2, name: "New" }]);
        expect(mockShowToast).toHaveBeenCalledWith("Account added", "success", 3000);
    });

    test("handles api error on add", async () => {
        api.post.mockRejectedValueOnce(new ApiError({ status: 400, message: "bad" }));
        renderWithProviders(<TestComponent />);

        fireEvent.click(screen.getByText("Add"));

        await waitFor(() => expect(mockShowToast).toHaveBeenCalledWith("Error adding Account", "error", 5000));
    });

    test("updates account and removes deleted account", async () => {
        api.put
            .mockResolvedValueOnce({ id: 1, name: "Updated" })
            .mockResolvedValueOnce({ id: 1, is_deleted: true });

        renderWithProviders(<TestComponent />);

        fireEvent.click(screen.getByText("Update"));
        await waitFor(() => expect(api.put).toHaveBeenCalledWith("/api/accounts/1/", { id: 1, name: "Updated" }));
        const updateFn = mockMutate.mock.calls[0][0];
        expect(updateFn([{ id: 1, name: "A1" }])).toEqual([{ id: 1, name: "Updated" }]);

        fireEvent.click(screen.getByText("Delete"));
        await waitFor(() => expect(api.put).toHaveBeenCalledWith("/api/accounts/1/", { is_deleted: true }));
        const deleteFn = mockMutate.mock.calls[1][0];
        expect(deleteFn([{ id: 1, name: "A1" }, { id: 2, name: "A2" }])).toEqual([{ id: 2, name: "A2" }]);
    });
});

