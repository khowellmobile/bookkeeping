/*
 *   Tests for CreateUserModal component.
 *
 */

import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import CreateUserModal from "@/src/components/elements/modals/CreateUserModal";

// Mocking enviroment variables
jest.mock("@/src/constants", () => ({
    ENVIRONMENT: "test",
    BASE_URL: "http://test-url.com",
}));

// Define placeholder for global.fetch if not already defined
if (typeof global.fetch === "undefined") {
    global.fetch = jest.fn();
}

const mockFetch = jest.spyOn(global, "fetch");
let consoleErrorSpy;

const mockHandleCloseModal = jest.fn();
const mockSwitchModal = jest.fn();
// Functon to create a CreateUserModal with props
const renderCreateUserModal = () => {
    return render(<CreateUserModal handleCloseModal={mockHandleCloseModal} switchModal={mockSwitchModal} />);
};

describe("CreateUserModal initial render", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderCreateUserModal();
    });

    it("should display the create user text", () => {
        expect(screen.getAllByText("Create Account")[0]).toBeInTheDocument(); // Header text
        expect(screen.getAllByText("Create Account")[1]).toBeInTheDocument(); // Button text
        expect(screen.queryByText("Please enter your details")).toBeInTheDocument();
    });

    it("should have empty inputs", () => {
        const emailInput = screen.getByTestId("input-email");
        const passwordInput = screen.getByTestId("input-password");
        const passwordInputConfirm = screen.getByTestId("input-password-confirm");

        expect(emailInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(passwordInputConfirm).toBeInTheDocument();
        expect(emailInput.value).toBe("");
        expect(passwordInput.value).toBe("");
        expect(passwordInputConfirm.value).toBe("");
    });
});

describe("CreateUserModal basic interactions", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderCreateUserModal();
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

    it("should update password confirm on user input of good value", () => {
        const passwordConfirm = "goodPass123!";
        const passwordConfirmInput = screen.getByTestId("input-password-confirm");
        fireEvent.change(passwordConfirmInput, { target: { value: passwordConfirm, name: "password" } });

        expect(passwordConfirmInput.value).toBe(passwordConfirm);
    });

    it("should call switch modal when login link is clicked", () => {
        const loginLink = screen.getByText("Login");
        fireEvent.click(loginLink);

        expect(mockSwitchModal).toHaveBeenCalledTimes(1);
    });
});

describe("CreateUserModal createAccount validation", () => {
    const goodPassword = "GoodPass123!";
    const testEmail = "new.user@example.com";

    beforeEach(() => {
        jest.clearAllMocks();
        renderCreateUserModal();

        consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    const populateInputs = (email, password, passwordConfirm) => {
        fireEvent.change(screen.getByTestId("input-email"), { target: { value: email } });
        fireEvent.change(screen.getByTestId("input-password"), { target: { value: password } });
        fireEvent.change(screen.getByTestId("input-password-confirm"), { target: { value: passwordConfirm } });
    };

    const clickCreateAccountButton = async () => {
        const createButton = screen.getByRole("button", { name: /create account/i });
        await act(async () => {
            fireEvent.click(createButton);
        });
    };

    it("should prevent fetch if password is too short", async () => {
        populateInputs(testEmail, "short1", "short1");
        await clickCreateAccountButton();

        expect(mockFetch).not.toHaveBeenCalled();
        expect(screen.getByText("Password does not meet requirments")).toBeInTheDocument();
        expect(screen.queryByText("A confirmation email has been sent")).not.toBeInTheDocument();
    });

    it("should prevent fetch if password has unallowed characters", async () => {
        populateInputs(testEmail, "goodPass123§", "goodPass123§");
        await clickCreateAccountButton();

        expect(mockFetch).not.toHaveBeenCalled();
        expect(screen.getByText("Password does not meet requirments")).toBeInTheDocument();
        expect(screen.queryByText("A confirmation email has been sent")).not.toBeInTheDocument();
    });

    it("should prevent fetch if passwords do not match", async () => {
        populateInputs(testEmail, goodPassword, "DifferentPass2!");
        await clickCreateAccountButton();

        expect(mockFetch).not.toHaveBeenCalled();
        expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
        expect(screen.queryByText("A confirmation email has been sent")).not.toBeInTheDocument();
    });
});

describe("CreateUserModal createAccount api interaction", () => {
    const goodPassword = "GoodPass123!";
    const testEmail = "new.user@example.com";
    const apiUrl = "http://test-url.com/api/auth/users/";

    const populateInputs = (email, password, passwordConfirm) => {
        fireEvent.change(screen.getByTestId("input-email"), { target: { value: email } });
        fireEvent.change(screen.getByTestId("input-password"), { target: { value: password } });
        fireEvent.change(screen.getByTestId("input-password-confirm"), { target: { value: passwordConfirm } });
    };

    const clickCreateAccountButton = async () => {
        const createButton = screen.getByRole("button", { name: /create account/i });
        await act(async () => {
            fireEvent.click(createButton);
        });
    };

    beforeEach(() => {
        jest.clearAllMocks();
        renderCreateUserModal();
        populateInputs(testEmail, goodPassword, goodPassword);

        consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    it("should successfully create account and enter 'waiting on email' state", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ id: 1, email: testEmail }),
        });

        clickCreateAccountButton();

        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(mockFetch).toHaveBeenCalledWith(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: testEmail,
                username: testEmail,
                password: goodPassword,
                re_password: goodPassword,
            }),
        });

        await waitFor(() => {
            expect(
                screen.getByText(`A confirmation email has been sent to ${testEmail}. Please return to login!`)
            ).toBeInTheDocument();
            expect(screen.getByRole("button", { name: /back to login/i })).toBeInTheDocument();
            expect(screen.queryByText("Passwords do not match")).not.toBeInTheDocument();
            expect(screen.queryByText("Password does not meet requirments")).not.toBeInTheDocument();
        });
    });

    it("should handle API validation failure (non-ok response with 'email' error)", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ email: ["user with this email already exists."] }),
        });

        clickCreateAccountButton();

        await waitFor(() => {
            expect(screen.getByText("Email: user with this email already exists.")).toBeInTheDocument();
        });
        // Check that the success state was not reached
        expect(screen.queryByText(/A confirmation email has been sent/i)).not.toBeInTheDocument();
    });

    it("should handle API failure (non-ok response with 'non_field_errors')", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ non_field_errors: ["some general error"] }),
        });

        clickCreateAccountButton();

        await waitFor(() => {
            expect(screen.getByText("some general error")).toBeInTheDocument();
        });
    });

    it("should handle network failure (.catch block)", async () => {
        mockFetch.mockRejectedValueOnce(new Error("Network Error"));

        clickCreateAccountButton();

        await waitFor(() => {
            expect(screen.getByText("A network error occurred. Please try again later.")).toBeInTheDocument();
        });
    });

    it("should switch to Login modal when 'Back to Login' is clicked after success", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ id: 1, email: testEmail }),
        });

        clickCreateAccountButton();

        await waitFor(() => {
            const backToLoginButton = screen.getByRole("button", { name: /back to login/i });
            fireEvent.click(backToLoginButton);
        });
        expect(mockSwitchModal).toHaveBeenCalledTimes(1);
    });
});
