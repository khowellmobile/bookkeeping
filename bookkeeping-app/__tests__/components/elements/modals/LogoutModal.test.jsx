/*
 *   Tests for LogoutModal component.
 *
 */

import { render, screen, fireEvent } from "@testing-library/react";
import LogoutModal from "@/src/components/elements/modals/LogoutModal";
import { useAuth } from "@/src/hooks/useAuth";

jest.mock("@/src/hooks/useAuth", () => ({
    useAuth: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
}));

const mockLogout = jest.fn();

const renderLogoutModal = () => {
    useAuth.mockReturnValue({ logout: mockLogout });
    return render(<LogoutModal />);
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

    it("should call logout() and navigate the user back to the splash page", () => {
        const logoutButton = screen.queryByText("Back to Login");
        fireEvent.click(logoutButton);

        expect(mockLogout).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith("/");
    });
});

