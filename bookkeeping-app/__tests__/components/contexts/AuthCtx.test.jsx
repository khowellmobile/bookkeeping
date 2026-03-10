import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useContext } from "react";

import { AuthCtxProvider } from "@/src/components/contexts/AuthCtx";
import AuthCtx from "@/src/components/contexts/AuthCtx";
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
        localStorage.clear();
    });

    test("hydrates token from localStorage", async () => {
        localStorage.setItem("accessToken", "stored-token");
        api.get.mockResolvedValueOnce({ email: "stored@test.com" });
        wrap(<TestComponent />);
        expect(screen.getByTestId("token")).toHaveTextContent("stored-token");
        await waitFor(() => expect(api.get).toHaveBeenCalledWith("/api/profile/"));
    });

    test("fetches profile when token exists", async () => {
        localStorage.setItem("accessToken", "stored-token");
        api.get.mockResolvedValueOnce({ email: "user@test.com" });

        wrap(<TestComponent />);

        await waitFor(() => expect(api.get).toHaveBeenCalledWith("/api/profile/"));
        expect(screen.getByTestId("email")).toHaveTextContent("user@test.com");
    });

    test("clears user data when profile call fails", async () => {
        localStorage.setItem("accessToken", "stored-token");
        api.get.mockRejectedValueOnce(new Error("boom"));

        wrap(<TestComponent />);

        await waitFor(() => expect(api.get).toHaveBeenCalled());
        expect(screen.getByTestId("email")).toHaveTextContent("");
    });

    test("setting token triggers profile fetch", async () => {
        api.get.mockResolvedValueOnce({ email: "new@test.com" });
        wrap(<TestComponent />);

        fireEvent.click(screen.getByText("Set Token"));

        await waitFor(() => expect(api.get).toHaveBeenCalledWith("/api/profile/"));
        expect(screen.getByTestId("email")).toHaveTextContent("new@test.com");
    });
});
