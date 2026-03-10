import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useContext } from "react";
import useSWRImmutable from "swr/immutable";

import { JournalsCtxProvider } from "@/src/components/contexts/JournalsCtx";
import JournalsCtx from "@/src/components/contexts/JournalsCtx";
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
            <PropertiesCtx.Provider value={{ ctxActiveProperty: { id: 1 } }}>{component}</PropertiesCtx.Provider>
        </AuthCtx.Provider>
    );

const TestComponent = () => {
    const ctx = useContext(JournalsCtx);
    const postData = {
        journal_date: "2026-01-01",
        journal_items: [{ account: { id: 5 }, debit: 10, credit: 0 }],
    };
    const putData = {
        id: 10,
        journal_date: "2026-01-02",
        journal_items: [{ id: 1, account: { id: 7 }, debit: 0, credit: 10 }],
    };

    return (
        <div>
            <span data-testid="count">{ctx.ctxJournalList?.length || 0}</span>
            <button onClick={() => ctx.ctxUpdateJournal(null, null, "POST", postData)}>Create</button>
            <button onClick={() => ctx.ctxUpdateJournal(10, "/api/journals/10/", "PUT", putData)}>Update</button>
            <button onClick={() => ctx.ctxDeleteJournal(10)}>Delete</button>
        </div>
    );
};

describe("JournalsCtx", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useSWRImmutable.mockImplementation(() => ({
            data: [{ id: 10, journal_date: "2026-01-01" }],
            mutate: mockMutate,
        }));
    });

    test("uses SWR key with property id", () => {
        wrap(
            <JournalsCtxProvider>
                <TestComponent />
            </JournalsCtxProvider>
        );
        expect(useSWRImmutable).toHaveBeenCalledWith(["/api/journals/", 1], expect.any(Function));
        expect(screen.getByTestId("count")).toHaveTextContent("1");
    });

    test("creates and updates journals through client", async () => {
        api.post.mockResolvedValueOnce({ id: 11, journal_date: "2026-01-01" });
        api.put.mockResolvedValueOnce({ id: 10, journal_date: "2026-01-02" });

        wrap(
            <JournalsCtxProvider>
                <TestComponent />
            </JournalsCtxProvider>
        );

        fireEvent.click(screen.getByText("Create"));
        await waitFor(() => expect(api.post).toHaveBeenCalledWith("/api/journals/", {
            journal_date: "2026-01-01",
            journal_items: [{ debit: 10, credit: 0, account_id: 5 }],
        }, {
            query: { property_id: 1 },
        }));

        fireEvent.click(screen.getByText("Update"));
        await waitFor(() => expect(api.put).toHaveBeenCalledWith("/api/journals/10/", {
            id: 10,
            journal_date: "2026-01-02",
            journal_items: [{ id: 1, debit: 0, credit: 10, account_id: 7 }],
        }));

        expect(mockShowToast).toHaveBeenCalledWith("Journal saved", "success", 3000);
    });

    test("deletes journal and handles error", async () => {
        api.put.mockResolvedValueOnce({});

        wrap(
            <JournalsCtxProvider>
                <TestComponent />
            </JournalsCtxProvider>
        );

        fireEvent.click(screen.getByText("Delete"));
        await waitFor(() => expect(api.put).toHaveBeenCalledWith("/api/journals/10/", { is_deleted: true }));
        expect(mockShowToast).toHaveBeenCalledWith("Journal deleted", "success", 3000);

        api.put.mockRejectedValueOnce(new ApiError({ status: 500, message: "bad" }));
        fireEvent.click(screen.getByText("Delete"));
        await waitFor(() => expect(mockShowToast).toHaveBeenCalledWith("Error deleting journal", "error", 5000));
    });
});
