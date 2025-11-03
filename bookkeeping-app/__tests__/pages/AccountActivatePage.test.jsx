/*
 *   Tests for AccountActivatePage component.
 *
 */

import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import AccountActivatePage from "@/src/pages/AccountActivatePage";

// Mocking enviroment variables
jest.mock("@/src/constants", () => ({
    ENVIRONMENT: "test",
    BASE_URL: "http://test-url.com",
}));

const MOCK_UID = "mock-uid-123";
const MOCK_TOKEN = "mock-token-abc";
const mockUseParams = jest.fn();
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
    useParams: () => mockUseParams(),
}));

// Define placeholder for global.fetch if not already defined
if (typeof global.fetch === "undefined") {
    global.fetch = jest.fn();
}

const mockFetch = jest.spyOn(global, "fetch");
let consoleErrorSpy;

const renderAccountActivatePage = (params = { uid: MOCK_UID, token: MOCK_TOKEN }) => {
    mockUseParams.mockReturnValue(params);
    return render(<AccountActivatePage />);
};

describe("AccountActivatePage inital render", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderAccountActivatePage();
    });

    it("should display the correct text on inital state", () => {
        expect(screen.getByText("Account Activation")).toBeInTheDocument();
        expect(screen.getByText("Confirm Email")).toBeInTheDocument();
    });
});

describe("AccountActivatePage api interactions", () => {
    const apiUrl = "http://test-url.com/api/auth/users/activation/";
    const MOCK_UID = "mock-uid-123";
    const MOCK_TOKEN = "mock-token-abc";

    beforeEach(() => {
        jest.clearAllMocks();

        mockUseParams.mockReturnValue({ uid: MOCK_UID, token: MOCK_TOKEN });
        renderAccountActivatePage();

        consoleErrorSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    const clickConfirmButton = async () => {
        const confirmButton = screen.getByRole("button", { name: /confirm email/i });
        await act(async () => {
            fireEvent.click(confirmButton);
        });
    };

    it("should call fetch with correct payload and handle SUCCESS (204 No Content)", async () => {
        mockFetch.mockResolvedValueOnce({
            status: 204,
            ok: true,
            json: async () => ({}),
        });

        await clickConfirmButton();

        expect(mockFetch).toHaveBeenCalledWith(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uid: MOCK_UID, token: MOCK_TOKEN }),
        });
        await waitFor(() => {
            expect(screen.getByText("Success! You can now navigate back to login!")).toBeInTheDocument();
            expect(screen.getByRole("button", { name: /return to login/i })).toBeInTheDocument();
        });
    });

    it("should handle API failure (non-204 status, e.g., 400)", async () => {
        mockFetch.mockResolvedValueOnce({
            status: 400,
            ok: false,
            json: async () => ({ token: ["Invalid token"] }),
        });

        await clickConfirmButton();

        await waitFor(() => {
            expect(
                screen.getByText("There has been an error please wait a few moments and try again.")
            ).toBeInTheDocument();
        });
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            expect.stringContaining("Activation Error: Error: HTTP error! status: 400")
        );
    });

    it("should handle network failure (.catch block)", async () => {
        mockFetch.mockRejectedValueOnce(new Error("Network connection lost"));

        await clickConfirmButton();

        await waitFor(() => {
            expect(
                screen.getByText("There has been an error please wait a few moments and try again.")
            ).toBeInTheDocument();
        });
        expect(consoleErrorSpy).toHaveBeenCalledWith("Activation Error: Error: Network connection lost");
    });

    it("should handle click on 'Return to Login' button after successful activation", async () => {
        mockFetch.mockResolvedValueOnce({ status: 204, ok: true, json: async () => ({}) });

        await clickConfirmButton();

        await waitFor(() => {
            const returnButton = screen.getByRole("button", { name: /return to login/i });
            fireEvent.click(returnButton);
        });
        expect(mockNavigate).toHaveBeenCalledWith("/");
    });
});

describe("AccountActivatePage initial parameter checks", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        consoleErrorSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    it("should display error and skip fetch if uid is missing in URL on mount", () => {
        mockUseParams.mockReturnValue({ uid: undefined, token: "mock-token" });
        render(<AccountActivatePage />);

        expect(screen.getByText("Missing token. Please return to create account and try again.")).toBeInTheDocument();
        expect(mockFetch).not.toHaveBeenCalled();
    });
});
