/*
 *   Tests for PasswordResetPage component.
 *
 */

import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import PasswordResetPage from "@/src/pages/PasswordResetPage";

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

const renderPasswordResetPage = (params = { uid: MOCK_UID, token: MOCK_TOKEN }) => {
    mockUseParams.mockReturnValue(params);
    return render(<PasswordResetPage />);
};

describe("PasswordResetPage initial render", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderPasswordResetPage();
    });

    it("should display the correct text on inital state", () => {
        expect(screen.getByText("Password Reset")).toBeInTheDocument();
        expect(screen.getAllByText("Confirm Password")[0]).toBeInTheDocument(); // Header text
        expect(screen.getAllByText("Confirm Password")[1]).toBeInTheDocument(); // Button text
    });
});

describe("PasswordResetPage basic interactions", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderPasswordResetPage();
    });

    it("should update password on user input of good value", () => {
        const password = "goodPass123!";
        const passwordInput = screen.getByTestId("input-password");
        fireEvent.change(passwordInput, { target: { value: password, name: "password" } });

        expect(passwordInput.value).toBe(password);
    });

    it("should update password confirm on user input of good value", () => {
        const passwordConfirm = "goodPass123!";
        const passwordConfirmInput = screen.getByTestId("input-password-confirm");
        fireEvent.change(passwordConfirmInput, { target: { value: passwordConfirm, name: "password" } });

        expect(passwordConfirmInput.value).toBe(passwordConfirm);
    });
});

describe("PasswordResetPage createAccount validation", () => {
    const MOCK_UID = "mock-uid-123";
    const MOCK_TOKEN = "mock-token-abc";

    beforeEach(() => {
        jest.clearAllMocks();

        mockUseParams.mockReturnValue({ uid: MOCK_UID, token: MOCK_TOKEN });
        renderPasswordResetPage();

        consoleErrorSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    const populateInputs = (password, passwordConfirm) => {
        fireEvent.change(screen.getByTestId("input-password"), { target: { value: password } });
        fireEvent.change(screen.getByTestId("input-password-confirm"), { target: { value: passwordConfirm } });
    };

    const clickConfirmPasswordButton = async () => {
        const confirmPasswordButton = screen.getByRole("button", { name: /confirm password/i });
        await act(async () => {
            fireEvent.click(confirmPasswordButton);
        });
    };

    it("should prevent fetch if password is too short", async () => {
        populateInputs("short1", "short1");
        await clickConfirmPasswordButton();

        expect(mockFetch).not.toHaveBeenCalled();
        expect(screen.getByText("Password does not meet requirments")).toBeInTheDocument();
        expect(screen.queryByText("A confirmation email has been sent")).not.toBeInTheDocument();
    });

    it("should prevent fetch if password has unallowed characters", async () => {
        populateInputs("goodPass123§", "goodPass123§");
        await clickConfirmPasswordButton();

        expect(mockFetch).not.toHaveBeenCalled();
        expect(screen.getByText("Password does not meet requirments")).toBeInTheDocument();
        expect(screen.queryByText("A confirmation email has been sent")).not.toBeInTheDocument();
    });

    it("should prevent fetch if passwords do not match", async () => {
        populateInputs("GoodPass123!", "DifferentPass2!");
        await clickConfirmPasswordButton();

        expect(mockFetch).not.toHaveBeenCalled();
        expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
        expect(screen.queryByText("A confirmation email has been sent")).not.toBeInTheDocument();
    });
});

describe("PasswordResetPage api interactions", () => {
    const apiUrl = "http://test-url.com/api/auth/users/reset_password_confirm/";
    const MOCK_UID = "mock-uid-123";
    const MOCK_TOKEN = "mock-token-abc";
    const goodPassword = "GoodPass123!";

    const populateInputs = (password, passwordConfirm) => {
        fireEvent.change(screen.getByTestId("input-password"), { target: { value: password } });
        fireEvent.change(screen.getByTestId("input-password-confirm"), { target: { value: passwordConfirm } });
    };

    const clickConfirmPasswordButton = async () => {
        const confirmPasswordButton = screen.getByRole("button", { name: /confirm password/i });
        await act(async () => {
            fireEvent.click(confirmPasswordButton);
        });
    };

    beforeEach(() => {
        jest.clearAllMocks();

        mockUseParams.mockReturnValue({ uid: MOCK_UID, token: MOCK_TOKEN });
        renderPasswordResetPage();
        populateInputs(goodPassword, goodPassword);

        consoleErrorSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    it("should call fetch with correct payload and handle SUCCESS (204 No Content)", async () => {
        mockFetch.mockResolvedValueOnce({
            status: 204,
            ok: true,
            json: async () => ({}),
        });

        await clickConfirmPasswordButton();

        expect(mockFetch).toHaveBeenCalledWith(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                uid: MOCK_UID,
                token: MOCK_TOKEN,
                new_password: goodPassword,
                re_new_password: goodPassword,
            }),
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
            json: async () => ({}),
        });

        await clickConfirmPasswordButton();

        await waitFor(() => {
            expect(
                screen.getByText("There has been an error please wait a few moments and try again.")
            ).toBeInTheDocument();
        });
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            expect.stringContaining("Confirmation Error: Error: HTTP error! status: 400")
        );
    });

    it("should handle network failure (.catch block)", async () => {
        mockFetch.mockRejectedValueOnce(new Error("Network connection lost"));

        await clickConfirmPasswordButton();

        await waitFor(() => {
            expect(
                screen.getByText("There has been an error please wait a few moments and try again.")
            ).toBeInTheDocument();
        });
        expect(consoleErrorSpy).toHaveBeenCalledWith("Confirmation Error: Error: Network connection lost");
    });

    it("should handle click on 'Return to Login' button after successful activation", async () => {
        mockFetch.mockResolvedValueOnce({ status: 204, ok: true, json: async () => ({}) });

        await clickConfirmPasswordButton();

        await waitFor(() => {
            const returnButton = screen.getByRole("button", { name: /return to login/i });
            fireEvent.click(returnButton);
        });
        expect(mockNavigate).toHaveBeenCalledWith("/");
    });
});

describe("PasswordResetPage initial parameter checks", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        consoleErrorSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    it("should display error and skip fetch if uid is missing in URL on mount", () => {
        mockUseParams.mockReturnValue({ uid: undefined, token: "mock-token" });
        render(<PasswordResetPage />);

        expect(screen.getByText("Missing token. Please return to login and try again.")).toBeInTheDocument();
        expect(mockFetch).not.toHaveBeenCalled();
    });
});
