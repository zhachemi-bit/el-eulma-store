import type { Product, Vendor, Order, Address, Testimonial } from '@/types';
import type { User, LoginCredentials, SignUpData } from '@/types/auth';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const getHeaders = () => {
  const token = localStorage.getItem('eleulma_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

const safeJson = async (response: Response) => {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  const text = await response.text();
  throw new Error(`Expected JSON but received: ${text.slice(0, 100)}${text.length > 100 ? '...' : ''}`);
};

export const api = {
  // Stats
  getPublicStats: async (): Promise<{ products: number; vendors: number; wilayas: number }> => {
    const response = await fetch(`${API_BASE}/stats`);
    if (!response.ok) {
      // Fallback if endpoint doesn't exist yet
      return { products: 50000, vendors: 3000, wilayas: 58 };
    }
    return response.json();
  },

  // Auth
  signup: async (data: SignUpData): Promise<{ user: User; token: string }> => {
    const response = await fetch(`${API_BASE}/users/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await safeJson(response).catch(() => ({ error: 'Signup failed (HTML response)' }));
      throw new Error(error.error || 'Signup failed');
    }
    return safeJson(response);
  },

  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
    const response = await fetch(`${API_BASE}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      const error = await safeJson(response).catch(() => ({ error: 'Login failed (HTML response)' }));
      throw new Error(error.error || 'Login failed');
    }
    return safeJson(response);
  },

  forgotPassword: async (email: string): Promise<{ message: string; debug_key?: string }> => {
    const response = await fetch(`${API_BASE}/users/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }
    return response.json();
  },

  verifyResetKey: async (email: string, key: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE}/users/verify-reset-key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, key }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Verification failed');
    }
    return response.json();
  },

  resetPassword: async (data: any): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE}/users/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Reset failed');
    }
    return response.json();
  },

  // Products
  getProducts: async (params?: { category?: string; search?: string; limit?: number; page?: number; vendorId?: string }): Promise<Product[]> => {
    const cleanParams: Record<string, string> = {};
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          cleanParams[key] = String(value);
        }
      });
    }
    const query = new URLSearchParams(cleanParams).toString();
    const response = await fetch(`${API_BASE}/products?${query}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch products');
    const result = await response.json();
    return result.data || result;
  },

  getProductById: async (id: string): Promise<Product> => {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
  },

  createProduct: async (productData: any): Promise<Product> => {
    const response = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || error.details?.[0]?.message || 'Failed to create product');
    }
    return response.json();
  },

  updateProduct: async (id: string, productData: any): Promise<Product> => {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to update product');
    }
    return response.json();
  },

  deleteProduct: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete product');
  },

  addReview: async (productId: string, data: { rating: number; comment?: string }): Promise<any> => {
    const response = await fetch(`${API_BASE}/products/${productId}/reviews`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add review');
    }
    return response.json();
  },

  // Testimonials
  getTestimonials: async (): Promise<Testimonial[]> => {
    const response = await fetch(`${API_BASE}/testimonials`);
    if (!response.ok) throw new Error('Failed to fetch testimonials');
    return response.json();
  },

  addTestimonial: async (data: { name: string; location: string; quote: string; rating: number }): Promise<Testimonial> => {
    const response = await fetch(`${API_BASE}/testimonials`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit testimonial');
    }
    return response.json();
  },

  // Vendors
  getVendors: async (): Promise<Vendor[]> => {
    const response = await fetch(`${API_BASE}/vendors`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch vendors');
    return response.json();
  },

  getVendorById: async (id: string): Promise<Vendor & { products: Product[] }> => {
    const response = await fetch(`${API_BASE}/vendors/${id}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch vendor');
    return response.json();
  },

  getVendorStats: async (): Promise<any> => {
    const response = await fetch(`${API_BASE}/vendors/me/stats`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch vendor stats');
    return response.json();
  },

  // Orders
  createOrder: async (orderData: Partial<Order>): Promise<Order> => {
    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error('Failed to create order');
    return response.json();
  },

  getOrdersByUser: async (userId: string): Promise<Order[]> => {
    const response = await fetch(`${API_BASE}/orders/user/${userId}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },

  // User profile
  getMe: async (): Promise<User> => {
    const response = await fetch(`${API_BASE}/users/me`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch user profile');
    return response.json();
  },

  updateProfile: async (data: Partial<User> & { currentPassword?: string; newPassword?: string }): Promise<{ message: string; user: User }> => {
    const response = await fetch(`${API_BASE}/users/me`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update profile');
    }
    return response.json();
  },

  // User Addresses
  getUserAddresses: async (userId: string): Promise<Address[]> => {
    const response = await fetch(`${API_BASE}/users/${userId}/addresses`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch addresses');
    return response.json();
  },

  createAddress: async (addressData: Partial<Address> & { userId: string }): Promise<Address> => {
    const response = await fetch(`${API_BASE}/users/addresses`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(addressData),
    });
    if (!response.ok) throw new Error('Failed to create address');
    return response.json();
  },

  // Admin
  getAdminStats: async (): Promise<any> => {
    const response = await fetch(`${API_BASE}/admin/stats`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch admin stats');
    return response.json();
  },

  getAdminVendors: async (params?: { status?: string; search?: string }): Promise<Vendor[]> => {
    const query = new URLSearchParams(params as any).toString();
    const response = await fetch(`${API_BASE}/admin/vendors?${query}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch admin vendors');
    return response.json();
  },

  approveVendor: async (id: string): Promise<any> => {
    const response = await fetch(`${API_BASE}/admin/vendors/${id}/approve`, {
      method: 'PATCH',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to approve vendor');
    return response.json();
  },

  rejectVendor: async (id: string): Promise<any> => {
    const response = await fetch(`${API_BASE}/admin/vendors/${id}/reject`, {
      method: 'PATCH',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to reject vendor');
    return response.json();
  },

  applyVendor: async (data: any): Promise<any> => {
    const response = await fetch(`${API_BASE}/vendors/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit application');
    }
    return response.json();
  },
};
