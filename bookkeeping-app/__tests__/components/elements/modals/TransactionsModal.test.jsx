import { render, screen } from '@testing-library/react';
import TransactionModal from '@/src/components/elements/modals/TransactionModal'; 
import TransactionsCtx from '@/src/components/contexts/TransactionsCtx'; 

// --- Mocks and Test Data ---

jest.mock('@/src/constants', () => ({
  ENVIRONMENT: 'test',
  BASE_URL: 'http://test-url.com', // Include any other variables you exported
}));

// 1. Mock the Context Provider
const mockUpdateTransaction = jest.fn();
const MockTransactionsCtxProvider = ({ children }) => (
  <TransactionsCtx.Provider value={{ ctxUpdateTransaction: mockUpdateTransaction }}>
    {children}
  </TransactionsCtx.Provider>
);

// 2. Mock all imported child components to simplify the test (A key step!)
jest.mock('@/src/components/elements/dropdowns/AccountDropdown.jsx', () => () => <div data-testid="account-dropdown" />);
jest.mock('@/src/components/elements/dropdowns/EntityDropdown.jsx', () => () => <div data-testid="entity-dropdown" />);
jest.mock('@/src/components/elements/modals/ConfirmationModal.jsx', () => () => <div data-testid="confirmation-modal" />);
jest.mock('@/src/components/elements/misc/Input.jsx', () => () => <input data-testid="input-mock" />);
jest.mock('@/src/components/elements/utilities/Button.jsx', () => ({ text }) => <button>{text}</button>);

// 3. Define minimal required props
const mockProps = {
  vals: {
    id: 1,
    date: '2025-10-21',
    entity: 'Payee Name',
    account: 'Checking',
    amount: '100.00',
    type: 'debit',
    memo: 'Test Memo',
  },
  handleCloseModal: jest.fn(),
};

describe('TransactionModal Smoke Test', () => {
  it('renders the modal title "Edit Transaction" without crashing', () => {
    // ARRANGE: Render the component wrapped in the mock context provider
    render(
      <MockTransactionsCtxProvider>
        <TransactionModal {...mockProps} />
      </MockTransactionsCtxProvider>
    );

    // ACT & ASSERT: Use RTL's screen to find the static <h2> title
    const titleElement = screen.getByText('Edit Transaction');
    
    // Use the jest-dom matcher to confirm the element is visible
    expect(titleElement).toBeInTheDocument();
  });
});