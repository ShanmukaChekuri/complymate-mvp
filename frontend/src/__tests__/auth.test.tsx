import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';

// Test component that uses auth context
function TestComponent() {
  const { user, login, logout } = useAuth();
  return (
    <div>
      {user ? (
        <>
          <p>Welcome, {user.name}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={() => login('test@example.com', 'password')}>Login</button>
      )}
    </div>
  );
}

// Wrapper component with providers
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <AuthProvider>{children}</AuthProvider>
    </BrowserRouter>
  );
}

describe('Authentication', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should show login button when not authenticated', () => {
    render(<TestComponent />, { wrapper: TestWrapper });
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('should show welcome message after login', async () => {
    render(<TestComponent />, { wrapper: TestWrapper });
    
    // Click login button
    fireEvent.click(screen.getByText('Login'));
    
    // Wait for login to complete
    await waitFor(() => {
      expect(screen.getByText(/Welcome/)).toBeInTheDocument();
    });
  });

  it('should show login button after logout', async () => {
    render(<TestComponent />, { wrapper: TestWrapper });
    
    // Login first
    fireEvent.click(screen.getByText('Login'));
    await waitFor(() => {
      expect(screen.getByText(/Welcome/)).toBeInTheDocument();
    });
    
    // Then logout
    fireEvent.click(screen.getByText('Logout'));
    
    // Check if login button is shown again
    await waitFor(() => {
      expect(screen.getByText('Login')).toBeInTheDocument();
    }, { timeout: 2000 });
  });
}); 