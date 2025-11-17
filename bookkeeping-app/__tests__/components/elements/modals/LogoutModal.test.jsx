/*
 *   Tests for LogoutModal component.
 *
 */

import { render, screen, fireEvent } from "@testing-library/react";
import LogoutModal from "@/src/components/elements/modals/LogoutModal";
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

const mockLogoutUser = jest.fn();
const MockAuthsCtxProvider = ({ children }) => (
    <AuthCtx.Provider value={{ logoutUser: mockLogoutUser }}>{children}</AuthCtx.Provider>
);

const renderLogoutModal = () => {
    return render(
        <MockAuthsCtxProvider>
            <LogoutModal />
        </MockAuthsCtxProvider>
    );
};

describe("LoginModal render and functionality", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderLogoutModal();
    });

    it("should display the logout text", () => {
        expect(screen.getByText("You password has been changed.")).toBeInTheDocument();
        expect(screen.queryByText("Please login again to confirm password change.")).toBeInTheDocument();
        expect(screen.queryByText("Back to Login")).toBeInTheDocument();
    });

    it("should call logoutUser() and navigate the user back to the splash page", () => {
        const logoutButton = screen.queryByText("Back to Login");
        fireEvent.click(logoutButton);

        expect(mockLogoutUser).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith("/");
    });
});
