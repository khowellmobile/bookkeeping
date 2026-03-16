import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useContext } from "react";
import useSWRImmutable from "swr/immutable";

import { PropertiesCtxProvider } from "@/src/components/contexts/PropertiesCtx";
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

const wrap = (component) =>
    render(
        <AuthCtx.Provider value={{ ctxAccessToken: "mock-token" }}>
            <PropertiesCtxProvider>{component}</PropertiesCtxProvider>
        </AuthCtx.Provider>
    );

const TestComponent = () => {
    const ctx = useContext(PropertiesCtx);
    return (
        <div>
            <span data-testid="count">{ctx.ctxPropertyList?.length || 0}</span>
            <button onClick={() => ctx.ctxAddProperty({ name: "New P" })}>Add</button>
            <button onClick={() => ctx.ctxUpdateProperty({ id: 1, name: "Updated P" })}>Update</button>
            <button onClick={() => ctx.setCtxActiveProperty({ id: 1, name: "P1" })}>Set Active</button>
        </div>
    );
};

describe("PropertiesCtx", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        sessionStorage.clear();
        useSWRImmutable.mockImplementation(() => ({
            data: [{ id: 1, name: "P1" }],
            mutate: mockMutate,
        }));
    });

    test("loads properties through SWR client fetcher", () => {
        wrap(<TestComponent />);
        expect(useSWRImmutable).toHaveBeenCalledWith("/api/properties/", expect.any(Function));
        expect(screen.getByTestId("count")).toHaveTextContent("1");
    });

    test("adds property and mutates list", async () => {
        api.post.mockResolvedValueOnce({ id: 2, name: "New P" });
        wrap(<TestComponent />);

        fireEvent.click(screen.getByText("Add"));

        await waitFor(() => expect(api.post).toHaveBeenCalledWith("/api/properties/", { name: "New P" }));
        const updater = mockMutate.mock.calls[0][0];
        expect(updater([{ id: 1, name: "P1" }])).toEqual([{ id: 1, name: "P1" }, { id: 2, name: "New P" }]);
        expect(mockShowToast).toHaveBeenCalledWith("Property added", "success", 3000);
    });

    test("updates property and persists selected property id", async () => {
        api.put.mockResolvedValueOnce({ id: 1, name: "Updated P" });
        wrap(<TestComponent />);

        fireEvent.click(screen.getByText("Update"));
        await waitFor(() => expect(api.put).toHaveBeenCalledWith("/api/properties/1/", { id: 1, name: "Updated P" }));
        const updater = mockMutate.mock.calls[0][0];
        expect(updater([{ id: 1, name: "P1" }, { id: 2, name: "P2" }])).toEqual([
            { id: 1, name: "Updated P" },
            { id: 2, name: "P2" },
        ]);

        fireEvent.click(screen.getByText("Set Active"));
        await waitFor(() => expect(sessionStorage.getItem("activePropertyId")).toBe("1"));
    });

    test("shows api error toast on update failure", async () => {
        api.put.mockRejectedValueOnce(new ApiError({ status: 400, message: "bad" }));
        wrap(<TestComponent />);

        fireEvent.click(screen.getByText("Update"));

        await waitFor(() => expect(mockShowToast).toHaveBeenCalledWith("Error updating Property", "error", 5000));
    });
});
