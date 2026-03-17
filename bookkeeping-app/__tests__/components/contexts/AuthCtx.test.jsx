import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { useContext } from "react";

import { AuthCtxProvider } from "@/src/contexts/AuthCtx";
import AuthCtx from "@/src/contexts/AuthCtx";
import { configureApiClient } from "@/src/Client";
import { api } from "@/src/Client";

jest.mock("@/src/Client", () => ({
    configureApiClient: jest.fn(),
    api: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        patch: jest.fn(),
        delete: jest.fn(),
    },
}));

const wrap = (component) => render(<AuthCtxProvider>{component}</AuthCtxProvider>);

const TestComponent = () => {
    const ctx = useContext(AuthCtx);
    return (
        <div>
            <span data-testid="loading">{String(ctx.ctxAuthLoading)}</span>
            <span data-testid="token">{ctx.ctxAccessToken || ""}</span>
            <span data-testid="email">{ctx.ctxUserData?.email || ""}</span>
            <button onClick={() => ctx.setCtxAccessToken("new-token")}>Set Token</button>
            <button onClick={() => ctx.setCtxAccessToken(null)}>Clear Token</button>
        </div>
    );
};

describe("AuthCtx", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("hydrates auth from refresh + profile bootstrap", async () => {
        api.post.mockResolvedValueOnce({});
        api.get.mockResolvedValueOnce({ email: "stored@test.com" });

        wrap(<TestComponent />);

        expect(screen.getByTestId("loading")).toHaveTextContent("true");

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith("/api/auth/refresh/", {}, { authRequired: false });
            expect(api.get).toHaveBeenCalledWith("/api/profile/");
            expect(screen.getByTestId("token")).toHaveTextContent("cookie-session");
            expect(screen.getByTestId("email")).toHaveTextContent("stored@test.com");
            expect(screen.getByTestId("loading")).toHaveTextContent("false");
        });
    });

    test("configures api client and unauthorized handler clears auth state", async () => {
        api.post.mockResolvedValueOnce({});
        api.get.mockResolvedValueOnce({ email: "user@test.com" });

        wrap(<TestComponent />);

        await waitFor(() => expect(screen.getByTestId("token")).toHaveTextContent("cookie-session"));

        const latestConfigCall = configureApiClient.mock.calls.at(-1)[0];
        expect(latestConfigCall.tokenGetter()).toBe("cookie-session");

        act(() => {
            latestConfigCall.unauthorizedHandler();
        });
        await waitFor(() => {
            expect(screen.getByTestId("token")).toHaveTextContent("");
            expect(screen.getByTestId("email")).toHaveTextContent("");
        });
    });

    test("refresh failure clears auth state and ends loading", async () => {
        api.post.mockRejectedValueOnce(new Error("boom"));

        wrap(<TestComponent />);

        await waitFor(() => {
            expect(api.get).not.toHaveBeenCalled();
            expect(screen.getByTestId("token")).toHaveTextContent("");
            expect(screen.getByTestId("email")).toHaveTextContent("");
            expect(screen.getByTestId("loading")).toHaveTextContent("false");
        });
    });

    test("setting token reconfigures api client token getter", async () => {
        api.post.mockResolvedValueOnce({});
        api.get.mockResolvedValueOnce({ email: "new@test.com" });

        wrap(<TestComponent />);

        await waitFor(() => expect(screen.getByTestId("token")).toHaveTextContent("cookie-session"));

        fireEvent.click(screen.getByText("Set Token"));

        await waitFor(() => {
            const latestConfigCall = configureApiClient.mock.calls.at(-1)[0];
            expect(latestConfigCall.tokenGetter()).toBe("new-token");
        });
    });
});

