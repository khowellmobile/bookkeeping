import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useContext } from "react";
import useSWRImmutable from "swr/immutable";

import { EntitiesCtxProvider } from "@/src/components/contexts/EntitiesCtx";
import EntitiesCtx from "@/src/components/contexts/EntitiesCtx";
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
            <PropertiesCtx.Provider value={{ ctxActiveProperty: { id: 1, name: "P1" } }}>
                <EntitiesCtxProvider>{component}</EntitiesCtxProvider>
            </PropertiesCtx.Provider>
        </AuthCtx.Provider>
    );

const TestComponent = () => {
    const ctx = useContext(EntitiesCtx);
    return (
        <div>
            <span data-testid="count">{ctx.ctxEntityList?.length || 0}</span>
            <button onClick={() => ctx.ctxAddEntity({ name: "New E" })}>Add</button>
            <button onClick={() => ctx.ctxUpdateEntity({ id: 1, name: "Updated E" })}>Update</button>
        </div>
    );
};

describe("EntitiesCtx", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useSWRImmutable.mockImplementation(() => ({
            data: [{ id: 1, name: "E1" }],
            mutate: mockMutate,
        }));
    });

    test("loads list through SWR with client key", () => {
        wrap(<TestComponent />);
        expect(useSWRImmutable).toHaveBeenCalledWith(["/api/entities/", 1], expect.any(Function));
        expect(screen.getByTestId("count")).toHaveTextContent("1");
    });

    test("adds entity and mutates cache", async () => {
        api.post.mockResolvedValueOnce({ id: 2, name: "New E" });
        wrap(<TestComponent />);

        fireEvent.click(screen.getByText("Add"));

        await waitFor(() => expect(api.post).toHaveBeenCalledWith("/api/entities/", { name: "New E" }, {
            query: { property_id: 1 },
        }));
        const updater = mockMutate.mock.calls[0][0];
        expect(updater([{ id: 1, name: "E1" }])).toEqual([{ id: 1, name: "E1" }, { id: 2, name: "New E" }]);
        expect(mockShowToast).toHaveBeenCalledWith("Entity added", "success", 3000);
    });

    test("invalid entity error path", async () => {
        api.post.mockRejectedValueOnce(new ApiError({ status: 422, message: "invalid" }));
        wrap(<TestComponent />);
        fireEvent.click(screen.getByText("Add"));

        await waitFor(() => expect(mockShowToast).toHaveBeenCalledWith("Invalid entity data", "error", 5000));
    });

    test("updates entity and handles unauthorized", async () => {
        api.put
            .mockResolvedValueOnce({ id: 1, name: "Updated E" })
            .mockRejectedValueOnce(new ApiError({ status: 401, message: "unauthorized" }));
        wrap(<TestComponent />);

        fireEvent.click(screen.getByText("Update"));
        await waitFor(() => expect(api.put).toHaveBeenCalledWith("/api/entities/1/", { id: 1, name: "Updated E" }));
        const updater = mockMutate.mock.calls[0][0];
        expect(updater([{ id: 1, name: "E1" }, { id: 2, name: "E2" }])).toEqual([
            { id: 1, name: "Updated E" },
            { id: 2, name: "E2" },
        ]);

        fireEvent.click(screen.getByText("Update"));
        await waitFor(() =>
            expect(mockShowToast).toHaveBeenCalledWith("Session expired. Please log in again.", "error", 5000)
        );
    });
});
