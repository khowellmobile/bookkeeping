/*
 * Tests for PwdPopup component.
 *
 */

import { render, screen } from "@testing-library/react";
import PwdPopup from "@/src/components/elements/utilities/PwdPopup";

// 1. Mock the CSS Module classes for testing purposes
jest.mock("./PwdPopup.module.css", () => ({
    true: "is-valid",
    false: "is-invalid",
    mainContainer: "main-container",
    anchor: "popup-anchor",
}));

const renderPwdPopup = ({ topOffset, leftOffset, pwd, isShown }) => {
    return render(<PwdPopup topOffset={topOffset} leftOffset={leftOffset} pwd={pwd} isShown={isShown} />);
};

describe("PwdPopup Rendering and Styling", () => {
    const defaultProps = {
        topOffset: "50px",
        leftOffset: "100px",
        pwd: "a",
        isShown: true,
    };

    it("should render when isShown is TRUE", () => {
        renderPwdPopup(defaultProps);
        expect(screen.getByText(/8 or More Characters/i).closest(".main-container")).toBeInTheDocument();
    });

    it("should NOT render when isShown is FALSE", () => {
        renderPwdPopup({ ...defaultProps, isShown: false });
        expect(screen.queryByText(/8 or More Characters/i)).not.toBeInTheDocument();
    });

    it("should apply correct offset styles to the main container", () => {
        const customProps = { ...defaultProps, topOffset: "10px", leftOffset: "20px" };
        renderPwdPopup(customProps);

        const mainContainer = screen.getByText(/8 or More Characters/i).closest(".main-container");
        expect(mainContainer).toHaveStyle(`top: 10px`);
        expect(mainContainer).toHaveStyle(`left: 20px`);
    });
});

describe("PwdPopup Validation Logic (useEffect)", () => {
    const countPassedChecks = () => {
        return screen.queryAllByText("✔").length;
    };

    const countFailedChecks = () => {
        return screen.queryAllByText("x").length;
    };

    it("should fail ALL requirements for a short password with no number/special character", () => {
        renderPwdPopup({ topOffset: "0", leftOffset: "0", pwd: "test", isShown: true });

        expect(countPassedChecks()).toBe(0);
        expect(countFailedChecks()).toBe(3);
    });

    it("should pass ONLY the character length requirement", () => {
        renderPwdPopup({ topOffset: "0", leftOffset: "0", pwd: "longstring", isShown: true });

        expect(countPassedChecks()).toBe(1);
        expect(countFailedChecks()).toBe(2);
    });

    it("should pass ONLY the number requirement", () => {
        renderPwdPopup({ topOffset: "0", leftOffset: "0", pwd: "1", isShown: true });

        // Expect 1 passed check (Number) and 2 failed checks
        expect(countPassedChecks()).toBe(1);
        expect(countFailedChecks()).toBe(2);
    });

    it("should pass ALL requirements for a strong password", () => {
        renderPwdPopup({ topOffset: "0", leftOffset: "0", pwd: "P@ssword123", isShown: true });

        expect(countPassedChecks()).toBe(3);
        expect(countFailedChecks()).toBe(0);
    });

    it("should update requirements when the password prop changes", () => {
        const { rerender } = renderPwdPopup({ topOffset: "0", leftOffset: "0", pwd: "fail", isShown: true });

        expect(countPassedChecks()).toBe(0);

        rerender(<PwdPopup topOffset={"0"} leftOffset={"0"} pwd={"P@ssword123"} isShown={true} />);

        expect(countPassedChecks()).toBe(3);
    });
});
