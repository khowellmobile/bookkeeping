/*
 * Tests for Input component.
 *
 */

import { render, screen, fireEvent } from "@testing-library/react";
import Input from "@/src/components/elements/utilities/Input";

// Mocking components
jest.mock("@/src/components/elements/utilities/Button.jsx", () => ({ text, onClick }) => (
    <button onClick={onClick}>{text}</button>
));

const mockOnChange = jest.fn();
const renderInput = (type = "number", value = "test-value") => {
    return render(
        <Input
            type={type}
            name={"test-name"}
            value={value}
            onChange={mockOnChange}
            customStyle={null}
            placeholder={"test-placeholder"}
        />
    );
};

describe("Input Rendering and initial state", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should properly display value on render", () => {
        const val = "hello";
        renderInput("text", val);
        expect(screen.getByRole("textbox")).toHaveValue(val);
    });

    it("should render empty if value passed is empty", () => {
        renderInput("text", "");
        expect(screen.getByRole("textbox")).toHaveValue("");
    });

    it("should properly display place holder on render with no value", () => {
        renderInput("text", "");
        expect(screen.getByPlaceholderText("test-placeholder")).toBeInTheDocument();
    });
});

describe("Input functionality", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should unescape HTML entities in the displayed value", () => {
        const escapedValue = "Test &amp; Value &lt; 5";
        const unescapedValue = "Test & Value < 5";

        renderInput("text", escapedValue);
        expect(screen.getByRole("textbox")).toHaveValue(unescapedValue);
    });

    it("should call inChange when the user changes the inputs value", () => {
        renderInput();
        fireEvent.change(screen.getByRole("textbox"), { target: { value: "changed" } });
        expect(mockOnChange).toHaveBeenCalledTimes(1);
    });
});

describe("Input Validation Logic (useEffect)", () => {
    const renderValidationInput = (type, value, isOptional = true) => {
        return render(
            <Input
                type={type}
                name={"test-name"}
                value={value}
                onChange={mockOnChange}
                customStyle={{}}
                placeholder={"test-placeholder"}
                isOptional={isOptional}
            />
        );
    };

    const expectWarning = (shouldWarn) => {
        const inputElement = screen.getByRole("textbox");
        if (shouldWarn) {
            expect(inputElement).toHaveClass("warn");
        } else {
            expect(inputElement).not.toHaveClass("warn");
        }
    };

    it("should NOT warn when value is empty and isOptional is TRUE", () => {
        renderValidationInput("text", "", true);
        expectWarning(false);
    });

    it("should WARN when value is empty and isOptional is FALSE", () => {
        renderValidationInput("text", "", false);
        expectWarning(true);
    });

    it("should NOT warn for a valid positive number value", () => {
        renderValidationInput("number", "123", false);
        expectWarning(false);
    });

    it("should WARN for a non-numeric value in 'number' type", () => {
        renderValidationInput("number", "abc", false);
        expectWarning(true);
    });

    it("should WARN for a negative number value in 'number' type", () => {
        renderValidationInput("number", "-10", false);
        expectWarning(true);
    });

    it("should NOT warn for a valid email format", () => {
        renderValidationInput("email", "test@example.com", false);
        expectWarning(false);
    });

    it("should WARN for an invalid email format", () => {
        renderValidationInput("email", "invalid-email", false);
        expectWarning(true);
    });

    it("should NOT warn for a valid phone number format (xxx-xxx-xxxx)", () => {
        renderValidationInput("phoneNumber", "555-123-4567", false);
        expectWarning(false);
    });

    it("should WARN for an invalid phone number format", () => {
        renderValidationInput("phoneNumber", "12345", false);
        expectWarning(true);
    });

    it("should NOT warn for a valid date format (YYYY-MM-DD)", () => {
        renderValidationInput("date", "2025-10-06", false);
        expectWarning(false);
    });

    it("should WARN for an invalid date format", () => {
        renderValidationInput("date", "10/06/2025", false);
        expectWarning(true);
    });

    it("should NOT warn for any value if type is not one of the validated types", () => {
        renderValidationInput("text", "any value will pass", false);
        expectWarning(false);
    });
});
