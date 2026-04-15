/*
 *   Tests for SettingsPage component.
 *
 */

import { render, screen, fireEvent } from "@testing-library/react";
import SettingsPage from "@/src/pages/SettingsPage";

jest.mock("@/src/components/elements/misc/DisplaySettings", () => () => (
    <div data-testid="display-settings">Display Settings</div>
));
jest.mock("@/src/components/elements/misc/ProfileInformation", () => () => (
    <div data-testid="profile-information">Profile Information</div>
));

const renderSettingsPage = () => render(<SettingsPage />);

describe("SettingsPage initial render", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderSettingsPage();
    });

    it("should render the settings groups and default heading on mount", () => {
        expect(screen.getByRole("heading", { name: "General" })).toBeInTheDocument();
        expect(screen.getByText("Audio")).toBeInTheDocument();
        expect(screen.getByText("Display")).toBeInTheDocument();
        expect(screen.getByText("Security")).toBeInTheDocument();
        expect(screen.getByText("Accessibility")).toBeInTheDocument();
        expect(screen.getByText("Profile")).toBeInTheDocument();
    });
});

describe("SettingsPage group interactions", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderSettingsPage();
    });

    it("should render display settings when the display group is clicked", () => {
        fireEvent.click(screen.getByText("Display"));

        expect(screen.getByTestId("display-settings")).toBeInTheDocument();
        expect(screen.queryByTestId("profile-information")).not.toBeInTheDocument();
    });

    it("should render profile information when the profile group is clicked", () => {
        fireEvent.click(screen.getByText("Profile"));

        expect(screen.getByTestId("profile-information")).toBeInTheDocument();
        expect(screen.queryByTestId("display-settings")).not.toBeInTheDocument();
    });
});
