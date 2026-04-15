/*
 *   Tests for SplashPage component.
 *
 */

import { render, screen, fireEvent } from "@testing-library/react";
import SplashPage from "@/src/pages/SplashPage";

jest.mock("@/src/components/elements/modals/LoginModal", () => ({ handleCloseModal, switchModal }) => (
    <div data-testid="login-modal">
        <p>Login Modal</p>
        <button onClick={switchModal}>Switch To Create</button>
        <button onClick={handleCloseModal}>Close Login</button>
    </div>
));
jest.mock("@/src/components/elements/modals/CreateUserModal", () => ({ handleCloseModal, switchModal }) => (
    <div data-testid="create-user-modal">
        <p>Create User Modal</p>
        <button onClick={switchModal}>Switch To Login</button>
        <button onClick={handleCloseModal}>Close Create</button>
    </div>
));

const renderSplashPage = () => render(<SplashPage />);

describe("SplashPage initial render", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderSplashPage();
    });

    it("should render the page intro text and login modal on mount", () => {
        expect(screen.getByRole("heading", { name: /rental bookkeeping\s*made easy/i })).toBeInTheDocument();
        expect(screen.getByTestId("login-modal")).toBeInTheDocument();
    });
});

describe("SplashPage modal switching", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderSplashPage();
    });

    it("should switch from the login modal to the create user modal", () => {
        fireEvent.click(screen.getByText("Switch To Create"));

        expect(screen.queryByTestId("login-modal")).not.toBeInTheDocument();
        expect(screen.getByTestId("create-user-modal")).toBeInTheDocument();
    });

    it("should switch from the create user modal back to the login modal", () => {
        fireEvent.click(screen.getByText("Switch To Create"));
        fireEvent.click(screen.getByText("Switch To Login"));

        expect(screen.getByTestId("login-modal")).toBeInTheDocument();
        expect(screen.queryByTestId("create-user-modal")).not.toBeInTheDocument();
    });

    it("should close the login modal when close is clicked", () => {
        fireEvent.click(screen.getByText("Close Login"));

        expect(screen.queryByTestId("login-modal")).not.toBeInTheDocument();
    });
});
