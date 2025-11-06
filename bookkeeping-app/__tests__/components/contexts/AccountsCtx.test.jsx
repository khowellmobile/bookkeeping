/*
 * Tests for AccountsCtx component.
 *
 */
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { useContext } from "react";
import { AccountsCtxProvider } from "@/src/components/contexts/AccountsCtx";
import AccountsCtx from "@/src/components/contexts/AccountsCtx";
import PropertiesCtx from "@/src/components/contexts/PropertiesCtx";
import AuthCtx from "@/src/components/contexts/AuthCtx";
import useSWRImmutable from "swr/immutable";

// Mocking environment variables
jest.mock("@/src/constants", () => ({
    ENVIRONMENT: "test",
    BASE_URL: "http://test-url.com",
}));

// Mock useSWRImmutable
jest.mock("swr/immutable", () => ({
    __esModule: true,
    default: jest.fn(),
}));

const mockMutate = jest.fn();

// Configure the SWR mock to return initial data
useSWRImmutable.mockImplementation(() => ({
    data: [{ id: 1, name: "Test Account 1" }],
    error: undefined,
    mutate: mockMutate,
}));

// Mock the useToast hook
const mockShowToast = jest.fn();
jest.mock("@/src/components/contexts/ToastCtx", () => ({
    useToast: () => ({ showToast: mockShowToast }),
}));

// Define placeholder for global.fetch and spy
if (typeof global.fetch === "undefined") {
    global.fetch = jest.fn();
}
const mockFetch = jest.spyOn(global, "fetch");

// Mock Parent Context Providers
const mockAccessToken = "mock-token";
const MockAuthsCtxProvider = ({ children }) => (
    <AuthCtx.Provider value={{ ctxAccessToken: mockAccessToken }}>{children}</AuthCtx.Provider>
);

const mockActiveProperty = { id: 1, name: "Test Property" };
const MockPropertiesCtxProvider = ({ children }) => (
    <PropertiesCtx.Provider value={{ ctxActiveProperty: mockActiveProperty }}>{children}</PropertiesCtx.Provider>
);

// Component to consume the AccountsCtx and expose values for testing
const TestComponent = () => {
    const context = useContext(AccountsCtx);
    return (
        <div>
            <span data-testid="active-account-name">{context.ctxActiveAccount.name}</span>
            <span data-testid="account-list-count">{context.ctxAccountList ? context.ctxAccountList.length : 0}</span>
            <button onClick={() => context.setCtxActiveAccount({ name: "Updated Account" })}>Set Account</button>
            <button onClick={() => context.ctxAddAccount({ name: "New Acc" })}>Add Account</button>
        </div>
    );
};

// Function to render the Provider wrapped around the consumer component
const renderAccountsProvider = () => {
    return render(
        <MockAuthsCtxProvider>
            <MockPropertiesCtxProvider>
                <AccountsCtxProvider>
                    <TestComponent />
                </AccountsCtxProvider>
            </MockPropertiesCtxProvider>
        </MockAuthsCtxProvider>
    );
};

describe("AccountsCtxProvider initial render/consume", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useSWRImmutable.mockImplementation(() => ({
            data: [{ id: 1, name: "Test Account 1" }],
            error: undefined,
            mutate: mockMutate,
        }));
    });

    test("should provide the correct initial state and list from SWR", () => {
        renderAccountsProvider();

        // Check the initial active account (set by useState/useEffect)
        const activeAccountName = screen.getByTestId("active-account-name");
        expect(activeAccountName).toHaveTextContent("None Selected");

        // Check the account list count (data mocked by useSWRImmutable)
        const accountListCount = screen.getByTestId("account-list-count");
        expect(accountListCount).toHaveTextContent("1");
    });
});

describe("AccountsCtxProvider state update", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useSWRImmutable.mockImplementation(() => ({
            data: [{ id: 1, name: "Test Account 1" }],
            error: undefined,
            mutate: mockMutate,
        }));
    });

    test("should update the active account when setCtxActiveAccount is called", () => {
        renderAccountsProvider();

        const activeAccountName = screen.getByTestId("active-account-name");
        expect(activeAccountName).toHaveTextContent("None Selected");

        const setAccountButton = screen.getByText("Set Account");
        fireEvent.click(setAccountButton);

        expect(activeAccountName).toHaveTextContent("Updated Account");
    });
});

describe("AccountsCtxProvider ctxAddAccount", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useSWRImmutable.mockImplementation(() => ({
            data: [{ id: 1, name: "Test Account 1" }],
            error: undefined,
            mutate: mockMutate,
        }));
    });

    test("should successfully add an account, update SWR cache, and show success toast", async () => {
        const newAccountData = { id: 2, name: "New Account Added" };
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => newAccountData,
        });

        renderAccountsProvider();

        const addButton = screen.getByText("Add Account");
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalled();
        });

        expect(mockMutate).toHaveBeenCalledTimes(1);
        expect(mockShowToast).toHaveBeenCalledWith("Account added", "success", 3000);

        const accountListCount = screen.getByTestId("account-list-count");

        await waitFor(() => {
            expect(accountListCount).toHaveTextContent("2");
        });
    });

    test("should handle API failure when adding an account and show error toast", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: "Server Error" }),
        });

        const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

        renderAccountsProvider();

        const addButton = screen.getByText("Add Account");
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalled();
        });

        // Uncomment with completion is issue #224
        // expect(mockMutate).not.toHaveBeenCalled();
        // expect(mockShowToast).toHaveBeenCalledWith("Error adding Account", "error", 5000);

        consoleError.mockRestore();
    });
});
