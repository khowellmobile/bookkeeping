/*
 * Tests for ToastCtx component.
 *
 */
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import { ToastCtxProvider, useToast } from "@/src/components/contexts/ToastCtx";

jest.mock("@/src/components/elements/utilities/ToastNotification", () => {
    return ({ text, type, duration }) => (
        <div data-testid="toast-notification" data-text={text} data-type={type} data-duration={duration}>
            {text}
        </div>
    );
});
jest.useFakeTimers();

const wrapAndRenderComponent = (component) => {
    return render(<ToastCtxProvider>{component}</ToastCtxProvider>);
};

const GeneralTestComponent = () => {
    const { showToast, hideToast } = useToast();

    return (
        <div>
            <button onClick={() => showToast("Success message", "success", 1000)}>Show Success Toast</button>
            <button onClick={() => showToast("Error message", "error", 2000)}>Show Error Toast</button>
            <button onClick={() => hideToast()}>Hide Toast</button>
        </div>
    );
};

// Test component to intentionally use useToast outside the Provider
const UnwrappedTestComponent = () => {
    useToast();
    return null;
};

describe("ToastCtxProvider and useToast hook", () => {
    test("useToast should throw an error when used outside the ToastProvider", () => {
        const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        expect(() => render(<UnwrappedTestComponent />)).toThrow("useToast must be used within a ToastProvider");
        errorSpy.mockRestore();
    });

    test("should render the provider without a visible toast initially", () => {
        wrapAndRenderComponent(<GeneralTestComponent />);
        expect(screen.queryByTestId("toast-notification")).not.toBeInTheDocument();
    });
});

describe("ToastCtxProvider toast queue and auto-hiding", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should display the first toast immediately upon showToast call with correct props", async () => {
        wrapAndRenderComponent(<GeneralTestComponent />);

        fireEvent.click(screen.getByRole("button", { name: "Show Success Toast" }));

        const toast = screen.getByTestId("toast-notification");

        expect(toast).toBeInTheDocument();
        expect(toast).toHaveAttribute("data-text", "Success message");
        expect(toast).toHaveAttribute("data-type", "success");
        expect(toast).toHaveAttribute("data-duration", "1000");
    });

    test("should hide the first toast and show the next one after the duration passes", async () => {
        wrapAndRenderComponent(<GeneralTestComponent />);

        // 1. Queue first toast (1000ms)
        fireEvent.click(screen.getByRole("button", { name: "Show Success Toast" }));

        // 2. Queue second toast (2000ms)
        fireEvent.click(screen.getByRole("button", { name: "Show Error Toast" }));

        // Check first toast is visible
        expect(screen.getByText("Success message")).toBeInTheDocument();

        // Fast-forward by 1000ms - Toast should still be visible (due to buffer)
        jest.advanceTimersByTime(1000);
        expect(screen.getByText("Success message")).toBeInTheDocument();

        // Fast forward 750ms (state change to second toast)
        act(() => {
            jest.advanceTimersByTime(750);
        });

        // First toast should now be gone
        await waitFor(() => {
            expect(screen.queryByText("Success message")).not.toBeInTheDocument();
        });

        // Second toast should now be visible
        const nextToast = screen.getByTestId("toast-notification");
        expect(nextToast).toBeInTheDocument();
        expect(nextToast).toHaveAttribute("data-text", "Error message");
        expect(nextToast).toHaveAttribute("data-type", "error");
        expect(nextToast).toHaveAttribute("data-duration", "2000");

        // Fast forward 2750ms (duration + buffer) (state change to no toast)
        act(() => {
            jest.advanceTimersByTime(2000 + 750);
        });

        // The second toast should now be gone
        await waitFor(() => {
            expect(screen.queryByTestId("toast-notification")).not.toBeInTheDocument();
        });
    });
});

describe("ToastCtxProvider manual hiding (hideToast)", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should hide the currently visible toast and immediately show the next one in the queue", async () => {
        wrapAndRenderComponent(<GeneralTestComponent />);

        // 1. Queue Toasts (1000ms, 2000ms)
        fireEvent.click(screen.getByRole("button", { name: "Show Success Toast" }));
        fireEvent.click(screen.getByRole("button", { name: "Show Error Toast" }));

        // Check first toast is visible
        expect(screen.getByText("Success message")).toBeInTheDocument();

        // Manually click hide button, cancelling the auto-hide timer
        fireEvent.click(screen.getByRole("button", { name: "Hide Toast" }));

        // Advance timer so first toast clears off screen
        act(() => {
            jest.advanceTimersByTime(800);
        });

        // Wait for UI update. First toast should be gone, and second should appear
        await waitFor(() => {
            expect(screen.queryByText("Success message")).not.toBeInTheDocument();
        });

        // Second toast should now be visible
        const nextToast = screen.getByTestId("toast-notification");
        expect(nextToast).toBeInTheDocument();
        expect(nextToast).toHaveAttribute("data-text", "Error message");
        expect(screen.getByText("Error message")).toBeInTheDocument();

        // Fast forward 2750ms (duration + buffer) (state change to no toast)
        act(() => {
            jest.advanceTimersByTime(2000 + 750);
        });

        // Second toast should now be gone
        await waitFor(() => {
            expect(screen.queryByTestId("toast-notification")).not.toBeInTheDocument();
        });
    });
});
