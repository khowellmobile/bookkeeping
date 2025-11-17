/*
 * Tests for AuthCtx component.
 *
 */
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { useContext } from "react";
import { AuthCtxProvider } from "@/src/components/contexts/AuthCtx";
import AuthCtx from "@/src/components/contexts/AuthCtx";

// Mocking environment variables
jest.mock("@/src/constants", () => ({
    ENVIRONMENT: "test",
    BASE_URL: "http://test-url.com",
}));

// Mock the useToast hook
const mockShowToast = jest.fn();
jest.mock("@/src/components/contexts/ToastCtx", () => ({
    useToast: () => ({ showToast: mockShowToast }),
}));

// Define placeholder for global.fetch and spy
if (typeof global.fetch === "undefined") {
    global.fetch = jest.fn();
}
const mockFetch = jest.spyOn(global, "fetch");
let consoleLogSpy;

// Function to render the Provider wrapped around the consumer component
const wrapAndRenderComponent = (component) => {
    return render(<AuthCtxProvider>{component}</AuthCtxProvider>);
};

const GeneralTestComponent = () => {
    const context = useContext(AuthCtx);
    const mockUpdatePayload = { email: "new@example.com" };

    return (
        <div>
            <span data-testid="access-token">{context.ctxAccessToken}</span>
            <span data-testid="user-data-email">{context.ctxUserData?.email}</span>
            <button onClick={() => context.setCtxAccessToken("set-mock-token")}>Set Token</button>
            <button onClick={() => context.setCtxAccessToken("new-mock-token")}>Trigger Get User</button>
            <button data-testid="update-user-btn" onClick={() => context.ctxUpdateUser(mockUpdatePayload)}>
                Update User
            </button>
        </div>
    );
};

describe("AuthCtxProvider initial render/consume", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => {
        consoleLogSpy.mockRestore();
    });

    test("should provide the correct initial state", () => {
        wrapAndRenderComponent(<GeneralTestComponent />);

        const accessToken = screen.getByTestId("access-token");
        expect(accessToken).toHaveTextContent("");
    });

    test("should update authToken when setCtxIsCalled", () => {
        wrapAndRenderComponent(<GeneralTestComponent />);

        fireEvent.click(screen.getByRole("button", { name: "Set Token" }));

        const accessToken = screen.getByTestId("access-token");
        expect(accessToken).toHaveTextContent("set-mock-token");
    });
});

describe("AuthCtxProvider ctxGetUser", () => {
    const mockUser = { id: 1, email: "test@example.com", first_name: "Test" };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(Storage.prototype, "getItem").mockReturnValue(null);
        consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => {
        jest.spyOn(Storage.prototype, "getItem").mockRestore();
        consoleLogSpy.mockRestore();
    });

    test("should successfully fetch user data and set ctxUserData when ctxAccessToken is set", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => mockUser,
        });
        jest.spyOn(Storage.prototype, "getItem").mockReturnValue("initial-mock-token");

        wrapAndRenderComponent(<GeneralTestComponent />);

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(
                "http://test-url.com/api/profile/",
                expect.objectContaining({
                    method: "GET",
                    headers: expect.objectContaining({
                        Authorization: `Bearer initial-mock-token`,
                    }),
                })
            );
            const userDataEmail = screen.getByTestId("user-data-email");
            expect(userDataEmail).toHaveTextContent(mockUser.email);
        });
        expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    test("should handle API failure (non-ok status) and log an error", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 401,
            json: async () => ({ detail: "Unauthorized" }),
        });
        jest.spyOn(Storage.prototype, "getItem").mockReturnValue("bad-token");
        wrapAndRenderComponent(<GeneralTestComponent />);

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalled();
        });

        const userDataEmail = screen.getByTestId("user-data-email");
        expect(userDataEmail).toHaveTextContent("");
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining("Error: Error: HTTP error! status: 401"));
        expect(mockShowToast).not.toHaveBeenCalled();
    });

    test("should not call fetch if ctxAccessToken is null", () => {
        jest.spyOn(Storage.prototype, "getItem").mockReturnValue(null);
        wrapAndRenderComponent(<GeneralTestComponent />);

        expect(mockFetch).not.toHaveBeenCalled();
        const userDataEmail = screen.getByTestId("user-data-email");
        expect(userDataEmail).toHaveTextContent("");
    });
});

describe("AuthCtxProvider ctxUpdateUser", () => {
    const mockUpdatedUserResponse = { id: 1, email: "new@example.com", first_name: "NewName" };
    const mockInitialUserResponse = { id: 1, email: "initial@example.com", first_name: "Initial" };
    const mockUpdatePayload = { email: "new@example.com" };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(Storage.prototype, "getItem").mockReturnValue(null);
        consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
        mockShowToast.mockClear();
    });

    afterEach(() => {
        jest.spyOn(Storage.prototype, "getItem").mockRestore();
        consoleLogSpy.mockRestore();
    });

    test("should successfully update user data, show success toast, and log response", async () => {
        // Inital fetch response from the useEffect
        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => mockInitialUserResponse,
        });
        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => mockUpdatedUserResponse,
        });

        wrapAndRenderComponent(<GeneralTestComponent />);

        fireEvent.click(screen.getByRole("button", { name: "Set Token" }));
        fireEvent.click(screen.getByTestId("update-user-btn"));

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(
                "http://test-url.com/api/profile/",
                expect.objectContaining({
                    method: "PUT",
                    headers: expect.objectContaining({
                        Authorization: `Bearer set-mock-token`,
                        "Content-Type": "application/json",
                    }),
                    body: JSON.stringify(mockUpdatePayload),
                })
            );

            expect(mockShowToast).toHaveBeenCalledTimes(1);
            expect(mockShowToast).toHaveBeenCalledWith("Profile updated", "success", 3000);
        });
    });

    test("should show error toast and log error on API failure (non-ok status)", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 400,
            json: async () => ({}),
        });

        wrapAndRenderComponent(<GeneralTestComponent />);
        fireEvent.click(screen.getByRole("button", { name: "Set Token" }));
        fireEvent.click(screen.getByTestId("update-user-btn"));

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalled();
        });

        expect(mockShowToast).toHaveBeenCalledWith("Error updating Profile", "error", 5000);
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining("Error: Error: HTTP error! status: 400"));
    });
});

describe("AuthCtxProvider ctxUpdatePwd", () => {
    const PWD_DATA = {
        pwdCurr: "currentPassword",
        pwdNew: "newPassword123",
        pwdCnfm: "newPassword123",
    };
    const PWD_ENDPOINT = "http://test-url.com/api/auth/users/set_password/";
    const MOCK_TOKEN = "test-token-for-pwd";

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(Storage.prototype, "getItem").mockReturnValue(MOCK_TOKEN);
        consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
        mockShowToast.mockClear();

        // Mock initial fetch from useEffect
        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({ id: 1, email: "test@example.com" }),
        });
    });

    afterEach(() => {
        jest.spyOn(Storage.prototype, "getItem").mockRestore();
        consoleLogSpy.mockRestore();
    });

    // Helper component for ctxUpdatePwd
    const PwdTestComponent = () => {
        const context = useContext(AuthCtx);
        return (
            <button
                data-testid="update-pwd-btn"
                onClick={() => context.ctxUpdatePwd(PWD_DATA.pwdCurr, PWD_DATA.pwdNew, PWD_DATA.pwdCnfm)}
            >
                Update Password
            </button>
        );
    };

    test("should successfully update password and show success toast", async () => {
        // Mock successful POST response (returns 204 No Content)
        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 204,
            json: async () => ({}),
        });
        wrapAndRenderComponent(<PwdTestComponent />);

        // Wait for the initial fetch to complete
        await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));
        fireEvent.click(screen.getByTestId("update-pwd-btn"));

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledTimes(2); // 1 GET, 1 POST
            expect(mockFetch).toHaveBeenCalledWith(
                PWD_ENDPOINT,
                expect.objectContaining({
                    method: "POST",
                    headers: expect.objectContaining({
                        Authorization: `Bearer ${MOCK_TOKEN}`,
                        "Content-Type": "application/json",
                    }),
                    body: JSON.stringify({
                        current_password: PWD_DATA.pwdCurr,
                        new_password: PWD_DATA.pwdNew,
                        re_new_password: PWD_DATA.pwdCnfm,
                    }),
                })
            );
            expect(mockShowToast).toHaveBeenCalledTimes(1);
            expect(mockShowToast).toHaveBeenCalledWith("Password updated", "success", 3000);
        });
    });

    test("should handle API failure (e.g., wrong current password) and show error toast", async () => {
        // Formatted to emulate how real component receives error messages
        const mockErrorResponse = {
            current_password: ["Invalid current password."],
        };
        const expectedErrorMessage = mockErrorResponse.current_password[0];
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 400,
            json: async () => mockErrorResponse,
        });

        wrapAndRenderComponent(<PwdTestComponent />);
        await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));
        fireEvent.click(screen.getByTestId("update-pwd-btn"));

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledTimes(2);
            expect(mockShowToast).toHaveBeenCalledTimes(1);
            expect(mockShowToast).toHaveBeenCalledWith("Error updating profile", "error", 5000);
            expect(consoleLogSpy).toHaveBeenCalledWith(
                `Password update failed. Status: 400. Error: ${expectedErrorMessage}`
            );
        });
    });

    test("should handle network error and show specific network error toast", async () => {
        mockFetch.mockRejectedValueOnce(new Error("Network connection failed"));
        wrapAndRenderComponent(<PwdTestComponent />);

        await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));
        fireEvent.click(screen.getByTestId("update-pwd-btn"));

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledTimes(2);
            expect(consoleLogSpy).toHaveBeenCalledWith("Error: Error: Network connection failed");
            expect(mockShowToast).toHaveBeenCalledTimes(1);
            expect(mockShowToast).toHaveBeenCalledWith("Network error updating Password", "error", 5000);
        });
    });
});

describe("AuthCtxProvider requestPswdReset", () => {
    const PWD_RESET_ENDPOINT = "http://test-url.com/api/auth/users/reset_password/";
    const MOCK_EMAIL = "user@example.com";
    const SUCCESS_MESSAGE = "Success! If the email is registered, you will receive a reset link shortly.";
    const FAILURE_MESSAGE = "An error occurred. Please try again.";
    const NETWORK_MESSAGE = "A network error occurred. Please check your connection.";

    beforeEach(() => {
        jest.clearAllMocks();
        consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    // Helper component for requestPswdReset
    const ResetPwdTestComponent = ({ email }) => {
        const context = useContext(AuthCtx);
        const handleReset = async () => {
            const result = await context.requestPswdReset(email);
            // Exposes result in testable way
            screen.getByTestId("reset-result").textContent = result;
        };

        return (
            <>
                <button data-testid="reset-pwd-btn" onClick={handleReset}>
                    Request Reset
                </button>
                <span data-testid="reset-result"></span>
            </>
        );
    };

    test("should successfully request reset (status 204) and return success message", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 204,
            json: async () => ({}),
        });
        wrapAndRenderComponent(<ResetPwdTestComponent email={MOCK_EMAIL} />);

        fireEvent.click(screen.getByTestId("reset-pwd-btn"));

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledTimes(1);
            expect(mockFetch).toHaveBeenCalledWith(
                PWD_RESET_ENDPOINT,
                expect.objectContaining({
                    method: "POST",
                    headers: expect.objectContaining({
                        "Content-Type": "application/json",
                    }),
                    body: JSON.stringify({ email: MOCK_EMAIL }),
                })
            );
            expect(screen.getByTestId("reset-result")).toHaveTextContent(SUCCESS_MESSAGE);
            expect(consoleErrorSpy).not.toHaveBeenCalled();
        });
    });

    test("should handle API failure (non-ok status, e.g., 400) and return failure message while logging error status", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 400,
            json: async () => ({}),
        });
        wrapAndRenderComponent(<ResetPwdTestComponent email={MOCK_EMAIL} />);
        fireEvent.click(screen.getByTestId("reset-pwd-btn"));

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledTimes(1);
            expect(screen.getByTestId("reset-result")).toHaveTextContent(FAILURE_MESSAGE);
            expect(consoleErrorSpy).toHaveBeenCalledWith("Reset Password Request Error Status:", 400);
        });
    });

    test("should handle network error (try/catch block) and return network error message while logging error", async () => {
        const networkError = new Error("DNS resolution failed");
        mockFetch.mockRejectedValueOnce(networkError);
        wrapAndRenderComponent(<ResetPwdTestComponent email={MOCK_EMAIL} />);
        fireEvent.click(screen.getByTestId("reset-pwd-btn"));

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledTimes(1);
            expect(screen.getByTestId("reset-result")).toHaveTextContent(NETWORK_MESSAGE);
            expect(consoleErrorSpy).toHaveBeenCalledWith("Network Error:", networkError);
        });
    });
});
