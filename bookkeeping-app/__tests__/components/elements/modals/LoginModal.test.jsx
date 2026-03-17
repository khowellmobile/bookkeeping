/*
 *   Tests for LoginModal component.
 *
 */

import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import LoginModal from "@/src/components/elements/modals/LoginModal";
import { useAuth } from "@/src/hooks/useAuth";

jest.mock("@/src/hooks/useAuth", () => ({
    useAuth: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
}));

const mockLogin = jest.fn();
const mockRequestPswdReset = jest.fn();

const mockHandleCloseModal = jest.fn();
const mockSwitchModal = jest.fn();
// Functon to create a login modal with context and props
const renderLoginModal = () => {
    mockLogin.mockResolvedValue({ success: false, message: "" });
    mockRequestPswdReset.mockResolvedValue({ success: true, message: "Success!" });

    useAuth.mockReturnValue({
        login: mockLogin,
        requestPswdReset: mockRequestPswdReset,
    });

    return render(
        <LoginModal handleCloseModal={mockHandleCloseModal} switchModal={mockSwitchModal} />
    );
};

describe("LoginModal initial render", () => {
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

    beforeEach(() => {
        jest.clearAllMocks();
        renderLoginModal();

        fireEvent.change(screen.getByTestId("input-email"), { target: { value: testEmail } });
        fireEvent.change(screen.getByTestId("input-password"), { target: { value: testPassword } });
    });

    it("should handle successful login (200 OK)", async () => {
        mockLogin.mockResolvedValueOnce({
            success: true,
            message: "Login successful.",
        });

        const loginButton = screen.getByRole("button", { name: /login/i });

        await act(async () => {
            fireEvent.click(loginButton);
        });

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith(testEmail, testPassword);
            expect(screen.getByText("Login successful.")).toBeInTheDocument();
            expect(mockNavigate).toHaveBeenCalledWith("/app/home");
        });
    });

    it("should handle login failure (non-ok response, e.g., 401)", async () => {
        mockLogin.mockResolvedValueOnce({
            success: false,
            message: "Invalid credentials",
        });

        const loginButton = screen.getByRole("button", { name: /login/i });

        await act(async () => {
            fireEvent.click(loginButton);
        });

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith(testEmail, testPassword);
            expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });

    it("should handle network failure (.catch block)", async () => {
        mockLogin.mockResolvedValueOnce({
            success: false,
            message: "A network error occurred. Please try again.",
        });

        const loginButton = screen.getByRole("button", { name: /login/i });

        await act(async () => {
            fireEvent.click(loginButton);
        });

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith(testEmail, testPassword);
            expect(screen.getByText("A network error occurred. Please try again.")).toBeInTheDocument();
        });
    });
});

