import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';

// Test component that uses theme context
function TestComponent() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}

describe('Theme', () => {
  it('should show light theme by default', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    expect(screen.getByText(/Current theme: light/)).toBeInTheDocument();
  });

  it('should toggle theme when button is clicked', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    // Initial state
    expect(screen.getByText(/Current theme: light/)).toBeInTheDocument();
    
    // Click toggle button
    fireEvent.click(screen.getByText('Toggle Theme'));
    
    // Check if theme changed
    expect(screen.getByText(/Current theme: dark/)).toBeInTheDocument();
  });
}); 