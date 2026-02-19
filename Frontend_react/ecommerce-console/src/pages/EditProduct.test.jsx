import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import EditProduct from './EditProduct';
import api from '../api/client';

// Mock the API client
vi.mock('../api/client', () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
  },
}));

describe('EditProduct Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and displays product data correctly', async () => {
    const mockProduct = {
      productId: 1,
      productName: 'Test Product',
      sku: 'TEST-123',
      basePrice: 99.99,
      stockQty: 50,
      description: 'Test description',
      imageUrl: 'http://example.com/image.jpg',
      category: { categoryId: 1, name: 'Books' }
    };

    const mockCategories = [
      { categoryId: 1, name: 'Books' },
      { categoryId: 2, name: 'Electronics' }
    ];

    api.get.mockImplementation((url) => {
      if (url === '/api/categories') {
        return Promise.resolve({ data: mockCategories });
      }
      if (url === '/api/products/1') {
        return Promise.resolve({ data: mockProduct });
      }
      return Promise.reject(new Error('Not found'));
    });

    render(
      <MemoryRouter initialEntries={['/products/1/edit']}>
        <Routes>
          <Route path="/products/:id/edit" element={<EditProduct />} />
        </Routes>
      </MemoryRouter>
    );

    // Initial loading state
    expect(screen.getByText(/Loading product data/i)).toBeInTheDocument();

    // Check if form fields are populated
    await waitFor(() => {
        expect(screen.getByDisplayValue('Test Product')).toBeInTheDocument();
        expect(screen.getByDisplayValue('TEST-123')).toBeInTheDocument();
        expect(screen.getByDisplayValue('99.99')).toBeInTheDocument();
        expect(screen.getByDisplayValue('50')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Test description')).toBeInTheDocument();
        // Check category select
        expect(screen.getByRole('combobox', { name: /Category/i })).toHaveValue('1');
    });
  });

  it('handles API errors gracefully', async () => {
    // Mock API error
    api.get.mockImplementation((url) => {
        if (url === '/api/categories') return Promise.resolve({ data: [] });
        return Promise.reject({ response: { data: { message: 'Product not found' } } });
    });

    render(
      <MemoryRouter initialEntries={['/products/999/edit']}>
        <Routes>
          <Route path="/products/:id/edit" element={<EditProduct />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to load product/i)).toBeInTheDocument();
      expect(screen.getByText(/Product not found/i)).toBeInTheDocument();
    });
  });
});
