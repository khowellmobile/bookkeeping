/*
 *   Tests for LoginModal component.
 *
 */

import { render, screen, fireEvent,waitFor, act } from "@testing-library/react";
import LoginModal from "@/src/components/elements/modals/LoginModal";
import AuthCtx from "@/src/components/contexts/AuthCtx";

// Mocking enviroment variables
jest.mock("@/src/constants", () => ({
    ENVIRONMENT: "test",
    BASE_URL: "http://test-url.com",
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
}));

// Define placeholder for global.fetch if not already defined
if (typeof global.fetch === "undefined") {
    global.fetch = jest.fn();
}

const mockFetch = jest.spyOn(global, "fetch");
const localStorageSetItem = jest.fn();
Object.defineProperty(window, "localStorage", {
    value: {
        setItem: localStorageSetItem,
    },
    writable: true,
});
let consoleErrorSpy;

// Mocking context provider
const mockSetAccessToken = jest.fn();
const mockRequestPswdReset = jest.fn();
const MockAuthsCtxProvider = ({ children }) => (
    <AuthCtx.Provider value={{ setCtxAccessToken: mockSetAccessToken, requestPswdReset: mockRequestPswdReset }}>
        {children}
    </AuthCtx.Provider>
);

const mockHandleCloseModal = jest.fn();
const mockSwitchModal = jest.fn();
// Functon to create a login modal with context and props
const renderLoginModal = () => {
    return render(
        <MockAuthsCtxProvider>
            <LoginModal handleCloseModal={mockHandleCloseModal} switchModal={mockSwitchModal} />
        </MockAuthsCtxProvider>
    );
};

describe("LoginModal inital render", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderLoginModal();
    });

    it("should display the login text", () => {
        expect(screen.getByText("Welcome Back")).toBeInTheDocument();
        expect(screen.queryByText("Please enter your details")).toBeInTheDocument();
    });

    it("should have empty inputs", () => {
        const emailInput = screen.getByTestId("input-email");
        const passwordInput = screen.getByTestId("input-password");

        expect(emailInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(emailInput.value).toBe("");
        expect(passwordInput.value).toBe("");
    });
});

describe("LoginModal basic interactions", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderLoginModal();
    });

    it("should update email on user input of good value", () => {
        const newEmail = "test@gmail.com";
        const emailInput = screen.getByTestId("input-email");
        fireEvent.change(emailInput, { target: { value: newEmail, name: "email" } });

        expect(emailInput.value).toBe(newEmail);
    });

    it("should update password on user input of good value", () => {
        const password = "goodPass123!";
        const passwordInput = screen.getByTestId("input-password");
        fireEvent.change(passwordInput, { target: { value: password, name: "password" } });

        expect(passwordInput.value).toBe(password);
    });

    it("should call switch modal when signup link is clicked", () => {
        const signUpLink = screen.getByText("Sign Up");
        fireEvent.click(signUpLink);

        expect(mockSwitchModal).toHaveBeenCalledTimes(1);
    });
});

describe("LoginModal password reset link", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderLoginModal();
    });

    it("should call requestPswdReset with email when password reset link is clicked", async () => {
        const newEmail = "test@gmail.com";
        const emailInput = screen.getByTestId("input-email");
        fireEvent.change(emailInput, { target: { value: newEmail, name: "email" } });

        const pswdResetLink = screen.getByText("Password Reset");

        await act(async () => {
            fireEvent.click(pswdResetLink);
        });

        expect(mockRequestPswdReset).toHaveBeenCalledTimes(1);
        expect(mockRequestPswdReset).toHaveBeenCalledWith(newEmail);
    });

    it("should not call requestPswdReset when password reset link is clicked with empty email", async () => {
        const pswdResetLink = screen.getByText("Password Reset");

        await act(async () => {
            fireEvent.click(pswdResetLink);
        });

        expect(mockRequestPswdReset).not.toHaveBeenCalled();

        const errMsg = screen.getByText("Ensure a proper email is entered before resetting password.");
        expect(errMsg).toBeInTheDocument();
    });
});

describe("LoginModal handleLogin functionality", () => {
    const testEmail = "test@user.com";
    const testPassword = "password123";
    const testAccessToken = "mock.jwt.access.token";
    const apiUrl = "http://test-url.com/api/auth/jwt/create/";

    beforeEach(() => {
        jest.clearAllMocks();
        renderLoginModal();

        fireEvent.change(screen.getByTestId("input-email"), { target: { value: testEmail } });
        fireEvent.change(screen.getByTestId("input-password"), { target: { value: testPassword } });

        // Spy on console.error but replace with empty function
        consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    it("should handle successful login (200 OK)", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ access: testAccessToken, refresh: "mock.refresh.token" }),
        });

        const loginButton = screen.getByRole("button", { name: /login/i });

        await act(async () => {
            fireEvent.click(loginButton);
        });

        expect(mockFetch).toHaveBeenCalledWith(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: testEmail, password: testPassword }),
        });

        await waitFor(() => {
            expect(localStorageSetItem).toHaveBeenCalledWith("accessToken", testAccessToken);
            expect(mockSetAccessToken).toHaveBeenCalledWith(testAccessToken);
            expect(mockNavigate).toHaveBeenCalledWith("/app/home");
            expect(mockHandleCloseModal).toHaveBeenCalledTimes(1);
        });
    });

    it("should handle login failure (non-ok response, e.g., 401)", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 401,
            json: async () => ({ detail: "Invalid credentials" }),
        });

        const loginButton = screen.getByRole("button", { name: /login/i });

        await act(async () => {
            fireEvent.click(loginButton);
        });

        await waitFor(() => {
            expect(screen.getByText("Login failed please try again.")).toBeInTheDocument();
            expect(localStorageSetItem).not.toHaveBeenCalled();
            expect(mockNavigate).not.toHaveBeenCalled();
            expect(mockHandleCloseModal).not.toHaveBeenCalled();
        });
    });

    it("should handle network failure (.catch block)", async () => {
        mockFetch.mockRejectedValueOnce(new Error("Network Error"));

        const loginButton = screen.getByRole("button", { name: /login/i });

        await act(async () => {
            fireEvent.click(loginButton);
        });

        await waitFor(() => {
            expect(screen.getByText("Login failed please try again.")).toBeInTheDocument();
            expect(localStorageSetItem).not.toHaveBeenCalled();
        });
    });
});
