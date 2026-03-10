import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import InventoryForgotPasswordPage from '../../pages/inventory/InventoryForgotPasswordPage';

const mockResetPassword = vi.fn();
const mockToggleTheme = vi.fn();

vi.mock('../../context/InventoryAuthContext', () => ({
  useInventoryAuth: () => ({
    resetPassword: mockResetPassword,
  }),
}));

vi.mock('../../context/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    toggleTheme: mockToggleTheme,
  }),
}));

function renderPage() {
  return render(
    <BrowserRouter>
      <InventoryForgotPasswordPage />
    </BrowserRouter>
  );
}

describe('InventoryForgotPasswordPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders reset form fields and actions', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: /reset password/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/name@company\.com/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to sign in/i })).toHaveAttribute('href', '/inventory/login');
  });

  it('submits email and shows success message', async () => {
    const user = userEvent.setup();
    mockResetPassword.mockResolvedValue({});
    renderPage();

    await user.type(screen.getByPlaceholderText(/name@company\.com/i), 'test@example.com');
    await user.click(screen.getByRole('button', { name: /send reset link/i }));

    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith('test@example.com');
      expect(screen.getByText(/check your inbox for password reset instructions/i)).toBeInTheDocument();
    });
  });

  it('maps auth errors to user friendly message', async () => {
    const user = userEvent.setup();
    mockResetPassword.mockRejectedValue({ code: 'auth/user-not-found' });
    renderPage();

    await user.type(screen.getByPlaceholderText(/name@company\.com/i), 'missing@example.com');
    await user.click(screen.getByRole('button', { name: /send reset link/i }));

    await waitFor(() => {
      expect(screen.getByText(/no account found with this email address/i)).toBeInTheDocument();
    });
  });

  it('calls toggleTheme from the theme button', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole('button', { name: /toggle theme/i }));
    expect(mockToggleTheme).toHaveBeenCalled();
  });
});
